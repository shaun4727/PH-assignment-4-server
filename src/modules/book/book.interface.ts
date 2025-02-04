import { Types } from "mongoose";

export type TBook = {
  title: string;
  author: string;
  price: number;
  image?: string;
  category: string;
  description: string;
  quantity: number;
  inStock: boolean;
  reviews?: TReview[];
  deleted?: false;
};

export type TReview = {
  review: string;
  user: Types.ObjectId;
};
