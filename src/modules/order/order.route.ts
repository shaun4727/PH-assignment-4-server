import express from "express";
import { orderControllers } from "./order.controller";

import validateMiddleware from "../../app/middleware/validateRequest";

import auth from "../../app/middleware/auth";
import { USER_ROLE } from "../user-auth/user_auth.constant";
import { orderValidation } from "./order.zod.validation";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),

  validateMiddleware(orderValidation.createOrderValidationSchema),
  orderControllers.createOrder
);
router.get("/verify", auth(USER_ROLE.user), orderControllers.verifyPayment);

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),

  validateMiddleware(orderValidation.createOrderValidationSchema),
  orderControllers.createOrder
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),

  orderControllers.getOrders
);

router.get(
  "/revenue",
  auth(USER_ROLE.admin, USER_ROLE.user),
  orderControllers.totalRevenues
);

router.delete("/:id", auth(USER_ROLE.admin), orderControllers.deleteOrder);
router.patch("/", auth(USER_ROLE.admin), orderControllers.updateOrder);

export const OrderRoutes = router;
