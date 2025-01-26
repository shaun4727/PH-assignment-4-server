import express from "express";
import { UserControllers } from "./user_auth.controller";
import validateMiddleware from "../../app/middleware/validateRequest";
import { userValidations } from "./user_auth.validation";

const router = express.Router();

router.post(
  "/register",
  validateMiddleware(userValidations.createUserValidationSchema),
  UserControllers.createUser
);
router.post(
  "/login",
  validateMiddleware(userValidations.loginValidationSchema),
  UserControllers.userLogin
);

router.post(
  "/refresh-token",
  validateMiddleware(userValidations.refreshTokenValidationSchema),
  UserControllers.refreshToken
);

export const UserRoutes = router;
