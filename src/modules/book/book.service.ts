import { BookModel } from "./book.model";
import { TBook } from "./book.interface";
import { JwtPayload } from "jsonwebtoken";
import { sendImageToCloudinary } from "../../app/utils/sendImageToCloudinary";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { bookSearchableFields } from "./book.constant";

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

const getAllBookFromDB = async (query: Record<string, unknown>) => {
  const baseQuery = BookModel.find({ inStock: true });
  const bookQuery = new QueryBuilder(baseQuery, query)
    .search(bookSearchableFields)
    .sort()
    .filter()
    .paginate();
  let data = [];
  if (query.dashboard) {
    data = await bookQuery.modelQuery;
  } else {
    data = await bookQuery.modelQuery.limit(9).exec();
  }

  // Execute query and fetch data
  const countQuery = new QueryBuilder(BookModel.find({ inStock: true }), query)
    .search(bookSearchableFields)
    .sort()
    .filter();
  const count = await countQuery.modelQuery.countDocuments();
  return { data, count };
};
const getAllTabBookFromDB = async () => {
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
  getAllTabBookFromDB,
};
