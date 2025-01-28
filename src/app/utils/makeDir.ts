import { NextFunction, Request, Response } from "express";
const fs = require("fs");
const path = require("path");

export const makeFolder = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Define the folder name
    const folderName = "uploads";
    // Create the full path to the folder
    const folderPath = path.join(process.cwd(), folderName);

    // Create the folder if it doesn't already exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(
        `Folder '${folderName}' created successfully at ${folderPath}`
      );
    } else {
      console.log(`Folder '${folderName}' already exists.`);
    }
    next();
  } catch (err) {
    console.log(err);
  }
};
