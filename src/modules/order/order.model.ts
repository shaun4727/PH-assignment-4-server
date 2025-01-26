import { Schema, model } from "mongoose";
import { Order } from "./order.interface";

const orderSchema = new Schema<Order>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Product is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    quantity: { type: Number, required: [true, "Quantity is required"] },
    totalPrice: { type: Number, required: [true, "Total Price  is required"] },
    cancelled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.post("save", async function (doc, next) {
  await doc.populate("product");
  await doc.populate("user", "-password -role -isBlocked");
  next();
});

export const OrderModel = model<Order>("Order", orderSchema);
