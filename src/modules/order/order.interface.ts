import { Types } from "mongoose";

export type TOrder = {
  products: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    stock: number;
  }[];
  user: Types.ObjectId;
  totalPrice: number;
  status: "Pending" | "Paid" | "Shipped" | "Completed" | "Cancelled";
  transaction?: {
    id?: string;
    transactionStatus?: string;
    bank_status?: string;
    sp_code?: string;
    sp_message?: string;
    method?: string;
    date_time?: string;
  };
  objectTwo?: TCustomerDetails;
};
export type TCustomerDetails = {
  customer_email?: string;
  customer_name?: string;
  customer_address?: string;
  customer_phone?: number;
  customer_city?: string;
};
