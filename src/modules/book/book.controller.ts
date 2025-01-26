import { BookServices } from "./book.service";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/middleware/sendResponse";

const createBook = catchAsync(async (req, res) => {
  const result = await BookServices.createBookIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Book created successfully",
    data: result,
  });
});

const getBooks = catchAsync(async (req, res) => {
  const result = await BookServices.getAllBookFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Books retrieved successfully",
    data: result,
  });
});

const getSingleBook = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await BookServices.getOneBookFromDB(productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Book retrieved successfully",
    data: result,
  });
});

const updateSingleBook = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await BookServices.updateOneBookFromDB(productId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Book updated successfully",
    data: result,
  });
});

const deleteSingleBook = catchAsync(async (req, res) => {
  const { productId } = req.params;
  await BookServices.deleteOneBook(productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Book deleted successfully",
  });
});

export const BookControllers = {
  createBook,
  getBooks,
  getSingleBook,
  updateSingleBook,
  deleteSingleBook,
};
