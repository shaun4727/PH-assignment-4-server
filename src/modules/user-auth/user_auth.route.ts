import express from "express";
import { UserControllers } from "./user_auth.controller";
import validateMiddleware from "../../app/middleware/validateRequest";
import { userValidations } from "./user_auth.validation";
import auth from "../../app/middleware/auth";
import { USER_ROLE } from "./user_auth.constant";

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

router.get("/get-users", auth(USER_ROLE.admin), UserControllers.getAllUsers);

router.post(
  "/refresh-token",
  validateMiddleware(userValidations.refreshTokenValidationSchema),
  UserControllers.refreshToken
);
router.patch(
  "/change-status/:userId",
  auth(USER_ROLE.admin),
  UserControllers.deactivateUser
);

export const UserRoutes = router;
