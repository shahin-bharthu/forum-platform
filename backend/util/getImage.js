import os from "os";
import path from "path";
import { promises as fs } from "fs";
import { CustomError } from "./customError.js";

export const getImage = async (imagePath, entity) => {
  const osType = os.type();
  const pathDelimiter = osType === "Linux" ? "/" : "\\";
  const avatarPath = imagePath.split(pathDelimiter);
  const fileName = avatarPath.pop();

  if (!fileName) {
    throw new CustomError("Avatar not found", 404);
  }

  const basePath = import.meta.url.replace(osType === "Linux" ? "file://" : "file:///","");  
  const filePath = path.join(basePath, entity === "user" ? "../../avatars" : "../../forumLogos");

  try {
    await fs.access(filePath);
    const absoluteImagePath = path.join(filePath, fileName);
    return absoluteImagePath;
  } catch (err) {
    throw new CustomError("Error accessing avatar/logo image file", 404);
  }
};
