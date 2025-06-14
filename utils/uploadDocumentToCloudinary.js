import axios from "axios";

const uploadDocument = async (document) => {
  try {
    const form = new FormData();
    form.append("file", document);
    form.append("upload_preset", "document_preset");
    // form.append("cloud_name", "mozammalhossain");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dkc85tef8/auto/upload",
      form
    );
    return res.data.url;
  } catch (error) {
    return;
  }
};

export default uploadDocument;
