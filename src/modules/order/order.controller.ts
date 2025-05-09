import { OrderServices } from "./order.service";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/middleware/sendResponse";

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.orderBookFromDB(req.body, req.ip!);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.getOrderFromDB(req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.deleteOrderFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order delete successfully",
    data: result,
  });
});
const updateOrder = catchAsync(async (req, res) => {
  const { orderStatus, id } = req.body;
  await OrderServices.updateOrderInDB(orderStatus, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order updated successfully",
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const result = await OrderServices.verifyPayment(
    req.query.order_id as string
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order verified successfully",
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
  verifyPayment,
  getOrders,
  deleteOrder,
  updateOrder,
};
