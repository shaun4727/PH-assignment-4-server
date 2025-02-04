import { OrderModel } from "./order.model";
import { TOrder } from "./order.interface";
import { BookModel } from "../book/book.model";
import { JwtPayload } from "jsonwebtoken";
// import AppError from "../../app/utils/AppError";
import mongoose from "mongoose";
import { orderUtils } from "./order.utils";
import { USER_ROLE } from "../user-auth/user_auth.constant";
import AppError from "../../app/utils/AppError";

const getOrderFromDB = async (user: JwtPayload) => {
  if (user.role === USER_ROLE.user) {
    return OrderModel.find({
      user: user.userId,
      status: { $ne: "Blocked" },
    }).populate([{ path: "products.product" }, { path: "user" }]);
  }

  return OrderModel.find({ status: { $ne: "Blocked" } }).populate([
    { path: "products.product" },
    { path: "user" },
  ]);
};

const deleteOrderFromDB = async (id: string) => {
  const result = await OrderModel.findOneAndUpdate(
    { _id: id },
    { status: "Blocked" },
    { new: true }
  );

  if (!result) {
    throw new AppError(400, "Failed to delete Order!");
  }
};
const updateOrderInDB = async (status: string, id: string) => {
  const result = await OrderModel.findOneAndUpdate(
    { _id: id },
    { status: status },
    { new: true }
  );

  if (!result) {
    throw new AppError(400, "Failed to delete Order!");
  }
};
const orderBookFromDB = async (order: TOrder, client_ip: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const orderDoc = new OrderModel({ ...order });
    const result = await orderDoc.save({ session });

    await Promise.all(
      order.products?.map(async (item) => {
        if (item.stock == item.quantity) {
          await BookModel.updateOne(
            { _id: item.product },
            { $set: { inStock: false } },
            { session }
          );
        }
        const prodCount = Number(item.stock) - Number(item.quantity);
        await BookModel.updateOne(
          { _id: item.product },
          { $set: { quantity: prodCount } },
          { session }
        );
      })
    );

    await session.commitTransaction();
    await session.endSession();

    const shurjopayPayload = {
      amount: order.totalPrice,
      order_id: result._id,
      currency: "BDT",
      customer_name: order?.objectTwo?.customer_name,
      customer_address: order?.objectTwo?.customer_address,
      customer_email: order?.objectTwo?.customer_email,
      customer_phone: order?.objectTwo?.customer_phone,
      customer_city: order?.objectTwo?.customer_city,
      client_ip,
    };

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);
    if (payment?.transactionStatus) {
      await OrderModel.updateOne(
        { _id: result._id },
        {
          transaction: {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
          },
        }
      );
    }
    return payment.checkout_url;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await OrderModel.findOneAndUpdate(
      {
        "transaction.id": order_id,
      },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == "Success"
            ? "Paid"
            : verifiedPayment[0].bank_status == "Failed"
              ? "Pending"
              : verifiedPayment[0].bank_status == "Cancel"
                ? "Cancelled"
                : "",
      }
    );
  }

  return verifiedPayment;
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
  verifyPayment,
  getOrderFromDB,
  deleteOrderFromDB,
  updateOrderInDB,
};
