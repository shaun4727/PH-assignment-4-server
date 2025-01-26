import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/middleware/sendResponse";
import { CarouselServices } from "./carousel.service";

const createCarousel = catchAsync(async (req, res) => {
  const result = await CarouselServices.createCarouselIntoDB(
    req.files,
    req.user
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "File uploaded succesfully",
    data: result,
  });
});

export const CarouselController = {
  createCarousel,
};
