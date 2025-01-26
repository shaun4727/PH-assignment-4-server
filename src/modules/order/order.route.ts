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
router.get(
  "/revenue",
  auth(USER_ROLE.admin, USER_ROLE.user),
  orderControllers.totalRevenues
);

export const OrderRoutes = router;
