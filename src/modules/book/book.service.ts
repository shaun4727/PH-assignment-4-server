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
  const baseQuery = BookModel.find({ deleted: false });
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
  const countQuery = new QueryBuilder(BookModel.find({ deleted: false }), query)
    .search(bookSearchableFields)
    .sort()
    .filter();
  const count = await countQuery.modelQuery.countDocuments();
  return { data, count };
};
const getAllTabBookFromDB = async () => {
  const categories = ["Biography", "Education", "Mystery"];

  const bookQueries = categories.map((category) =>
    BookModel.find({ category, deleted: false }).limit(6)
  );

  const booksTab = await Promise.all(bookQueries);
  let result: TBook[] = [];
  booksTab?.forEach((item) => {
    result = [...item, ...result];
  });
  return result;
};

const getOneBookFromDB = async (id: string) => {
  const result = await BookModel.findOne({ _id: id });
  return result;
};

const updateOneBookFromDB = async (
  id: string,
  file: any,
  book: TBook,
  user: JwtPayload
) => {
  if (file) {
    const imageName = `${user.userId}${book.title}`;
    const path = file?.path;

    //send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    book.image = secure_url as string;
  }

  const result = await BookModel.findByIdAndUpdate(id, book, { new: true });
  return result;
};

const deleteOneBook = async (id: string) => {
  const result = await BookModel.findOneAndUpdate(
    { _id: id },
    { deleted: true },
    { new: true }
  );

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
