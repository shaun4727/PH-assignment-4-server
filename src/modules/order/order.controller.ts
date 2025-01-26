import { OrderServices } from "./order.service";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/middleware/sendResponse";

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.orderBookFromDB(req.body, req.user);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const totalRevenues = catchAsync(async (req, res) => {
  const result = await OrderServices.totalRevenue();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Revenue calculated successfully",
    data: {
      totalRevenue: result[0]?.totalRevenue,
    },
  });
});

export const orderControllers = {
  createOrder,
  totalRevenues,
};
