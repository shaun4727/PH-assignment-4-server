import { Types } from "mongoose";

export type TBook = {
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  quantity: number;
  inStock: boolean;
  reviews?: TReview[];
};

export type TReview = {
  review: string;
  user: Types.ObjectId;
};
