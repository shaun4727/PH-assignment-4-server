import { JwtPayload } from "jsonwebtoken";
import { sendImageToCloudinary } from "../../app/utils/sendImageToCloudinary";
import { CarouselModel } from "./carousel.model";
const fs = require("fs");
const path = require("path");

const createCarouselIntoDB = async (files: any, user: JwtPayload) => {
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

    if (files) {
      const result = await Promise.all(
        files.map(async (file: any, index: number) => {
          const imageName = `${user.userId}-${index}`;
          const path = file?.path;

          //send image to cloudinary
          const { secure_url } = await sendImageToCloudinary(imageName, path);
          return await CarouselModel.create({ image: secure_url });
        })
      );

      return result;
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

export const CarouselServices = {
  createCarouselIntoDB,
};
