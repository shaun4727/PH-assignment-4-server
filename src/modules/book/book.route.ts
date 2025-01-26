import express from "express";
import { BookControllers } from "./book.controller";

import validateMiddleware from "../../app/middleware/validateRequest";

import auth from "../../app/middleware/auth";
import { USER_ROLE } from "../user-auth/user_auth.constant";
import { bookValidation } from "./book.zod.validation";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin),
  validateMiddleware(bookValidation.createBookValidationSchema),
  BookControllers.createBook
);
router.get("/", BookControllers.getBooks);
router.get("/:productId", BookControllers.getSingleBook);
router.put(
  "/:productId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateMiddleware(bookValidation.updateBookValidationSchema),
  BookControllers.updateSingleBook
);
router.delete(
  "/:productId",
  auth(USER_ROLE.admin),
  BookControllers.deleteSingleBook
);

export const BookRoutes = router;
