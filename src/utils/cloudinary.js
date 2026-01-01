import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "avatars",
      resource_type: "image",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary error:", error.message);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    throw error; // 👈 silently fail mat karo
  }
};


export { uploadToCloudinary };
