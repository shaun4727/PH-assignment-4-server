import { JwtPayload } from "jsonwebtoken";
import { sendImageToCloudinary } from "../../app/utils/sendImageToCloudinary";
import { CarouselModel } from "./carousel.model";

const createCarouselIntoDB = async (files: any, user: JwtPayload) => {
  try {
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
const getAllCarouselFromDB = async () => {
  const result = await CarouselModel.find().sort("-createdAt").limit(5);
  return result;
};
export const CarouselServices = {
  createCarouselIntoDB,
  getAllCarouselFromDB,
};
