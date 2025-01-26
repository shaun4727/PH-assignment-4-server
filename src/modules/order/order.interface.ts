import { Types } from "mongoose";

export type Order = {
  product: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  user: Types.ObjectId;
  cancelled: boolean;
};
