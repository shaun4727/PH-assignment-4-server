import { BookModel } from "./book.model";
import { TBook } from "./book.interface";
import { JwtPayload } from "jsonwebtoken";
import { sendImageToCloudinary } from "../../app/utils/sendImageToCloudinary";

const createBookIntoDB = async (file: any, book: TBook, user: JwtPayload) => {
  if (file) {
    const imageName = `${user.userId}${book.title}`;
    const path = file?.path;

    //send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    book.image = secure_url as string;
  }

  const result = await BookModel.create(book); // static method create

  return result;
};

const getAllBookFromDB = async () => {
  const result = await BookModel.find({ inStock: true });
  return result;
};

const getOneBookFromDB = async (id: string) => {
  const result = await BookModel.findOne({ _id: id });
  return result;
};

const updateOneBookFromDB = async (id: string, data: object) => {
  await BookModel.updateOne({ _id: id }, data);
  const result = await BookModel.findOne({ _id: id });
  return result;
};

const deleteOneBook = async (id: string) => {
  const result = await BookModel.deleteOne({ _id: id });

  return result;
};

export const BookServices = {
  createBookIntoDB,
  getAllBookFromDB,
  getOneBookFromDB,
  updateOneBookFromDB,
  deleteOneBook,
};
