import cloudinary from "../configs/cloudinary.js";
import ApiError from "../utils/ApiError.js";

const uploadFile = async ({ buffer, fileName }) => {
  try {
    if (!buffer) {
      throw new ApiError("File buffer is missing", 400);
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          public_id: fileName.split(".")[0],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });
    return {
      url: result.secure_url,
      fileId: result.public_id,
      provider: "cloudinary",
    };
  } catch (error) {
    console.error("Cloud upload failed:", error);
    throw new ApiError("Failed to upload resume", 500);
  }
};

const deleteFile = async ({ fileId }) => {
  try {
    if (!fileId) {
      throw new ApiError("File ID is required", 400);
    }

    await cloudinary.uploader.destroy(fileId, {
      resource_type: "raw",
    });
  } catch (error) {
    console.error("Cloud delete failed:", error);
    throw new ApiError("Failed to delete resume", 500);
  }
};

export { uploadFile, deleteFile };
