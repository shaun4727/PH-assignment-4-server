import { OrderModel } from "./order.model";
import { Order } from "./order.interface";
import { BookModel } from "../book/book.model";
import AppError from "../../app/utils/AppError";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";

const orderBookFromDB = async (order: Order, user: JwtPayload) => {
  const book = await BookModel.findOne({ _id: order.product });

  if (!book) {
    throw new AppError(400, "Book is out of Stock!");
  }

  if (Number(book.quantity) < Number(order.quantity)) {
    throw new AppError(400, "This much quantity is not available!");
  }

  order.user = user.userId;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const orderDoc = new OrderModel({ ...order });
    const result = await orderDoc.save({ session });

    book.quantity = Number(book.quantity) - Number(order.quantity);
    if (book.quantity === 0) {
      book.inStock = false; // Mark as out of stock if the quantity reaches 0
    }

    await BookModel.updateOne({ _id: order.product }, book, { session });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const totalRevenue = async () => {
  const result = await OrderModel.aggregate([
    {
      $lookup: {
        from: "books", // The collection name for the books model
        localField: "product",
        foreignField: "_id",
        as: "prodDetail",
      },
    },
    {
      $unwind: "$prodDetail", // Flatten the array from $lookup
    },
    {
      $group: {
        _id: null, // Group all orders together
        totalRevenue: {
          $sum: { $multiply: ["$quantity", "$prodDetail.price"] }, // Calculate revenue per order
        },
      },
    },
  ]);

  return result;
};

export const OrderServices = {
  orderBookFromDB,
  totalRevenue,
};
