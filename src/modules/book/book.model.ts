import { Schema, model, Types } from "mongoose";
import { TBook } from "./book.interface";

const bookSchema = new Schema<TBook>(
  {
    title: { type: String, required: [true, "Title is required"] },
    author: { type: String, required: [true, "Author is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    category: { type: String, required: [true, "Category is required"] },
    description: { type: String, required: [true, "Description is required"] },
    quantity: { type: Number, required: [true, "Quantity is required"] },
    inStock: { type: Boolean, required: [true, "Stock is required"] },
    reviews: [
      {
        review: { type: String, required: [true, "Review is required"] },
        user: {
          type: Types.ObjectId,
          ref: "User",
          required: [true, "User is required"],
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const BookModel = model<TBook>("Book", bookSchema);
