import axios from "axios";

const uploadDocument = async (document) => {
  try {
    const form = new FormData();
    form.append("file", document);
    form.append("upload_preset", "document_preset");
    //form.append("folder", "document_assets");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dkc85tef8/auto/upload",
      form
    );
    return {
      fileUrl: res.data.secure_url,                // ✅ use secure_url
      cloudinaryId: res.data.public_id, // ✅ just the ID part if you want short form
      cloudinaryResourceType: res.data.resource_type,    // ✅ "raw" for PDF, "image" for images
      fileType: res.data.format                    // ✅ like "pdf", "jpg"
      // Optional: res.data.bytes, res.data.created_at
    };
  } catch (error) {
    return;
  }
};

export default uploadDocument;
