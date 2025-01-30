import express, { NextFunction, Request, Response } from "express";
import { BookControllers } from "./book.controller";

import validateMiddleware from "../../app/middleware/validateRequest";

import auth from "../../app/middleware/auth";
import { USER_ROLE } from "../user-auth/user_auth.constant";
import { bookValidation } from "./book.zod.validation";
import { upload } from "../../app/utils/sendImageToCloudinary";
import { makeFolder } from "../../app/utils/makeDir";
// import { makeFolder } from "../../app/utils/makeDir";

const router = express.Router();

router.post(
  "/",
  makeFolder,
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),

  validateMiddleware(bookValidation.createBookValidationSchema),
  BookControllers.createBook
);
router.get("/", BookControllers.getBooks);
router.get("/tab-books", BookControllers.getTabBooks);
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
