const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const FileModel = require("../../models/resource/fileModel");
const UserModel = require("../../models/UserModel");
const cloudinary = require("cloudinary").v2;
// const uuid = require("uuid").v4;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE A File

router.post("/", authMiddleware, async (req, res) => {
  const { fileName, fileType, fileTopic, fileUrl, cloudinaryId, cloudinaryResourceType } = req.body;

  if (fileName.length < 1)
    return res.status(401).send("File name must be greater than 0");

  try {
    const newFile = {
      user: req.userId,
      fileName,
      fileUrl,
      fileType,
      fileTopic,
      cloudinaryId,
      cloudinaryResourceType,
    };
    const file = await new FileModel(newFile).save();

    const FileCreated = await FileModel.findById(file._id).populate("user");

    return res.json(FileCreated);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// GET ALL Files

router.get("/", authMiddleware, async (req, res) => {
  try {
    let files;

    files = await FileModel.find().sort({ createdAt: -1 }).populate("user");

    if (files.length === 0) {
      return res.json([]);
    }

    let FilesToBeSent = [...files];
    const { userId } = req;
    FilesToBeSent.length > 0 &&
      FilesToBeSent.sort((a, b) => [
        new Date(b.createdAt) - new Date(a.createdAt),
      ]);

    return res.json(FilesToBeSent);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// DELETE POST

router.delete("/:fileId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { fileId } = req.params;
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send("File not found");
    }
    const user = await UserModel.findById(userId);
    // Delete from Cloudinary if cloudinaryId exists
    if (file.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: file.cloudinaryResourceType || "raw" });
      } catch (err) {
        console.error("Cloudinary deletion error:", err);
      }
    }
    if (file.user.toString() !== userId) {
      if (user.role === "root") {
        await file.remove();
        return res.status(200).send("File deleted Successfully");
      } else {
        return res.status(401).send("Unauthorized");
      }
    }
    await file.remove();
    return res.status(200).send("file deleted Successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

module.exports = router;
