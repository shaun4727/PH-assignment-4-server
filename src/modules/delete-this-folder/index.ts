import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/middleware/sendResponse";

const fs = require("fs");

function getRandomElement(array: any) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDateWithinLastYear() {
  const now: Date = new Date();
  const oneYearAgo: Date = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const randomTimestamp =
    Math.random() * (now.getTime() - oneYearAgo.getTime()) +
    oneYearAgo.getTime();
  return new Date(randomTimestamp).toISOString();
}

function generateRandomBooks(count: number) {
  const titles = [
    "The Great Adventure",
    "Mystery of the Night",
    "Journey to the Unknown",
    "Learning JavaScript",
    "Mastering Design Patterns",
    "A Guide to Algorithms",
    "The Art of Problem Solving",
    "The Fictional World",
    "Science and Beyond",
    "Understanding AI",
  ];
  const authors = [
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Davis",
    "William Miller",
    "Jessica Wilson",
    "David Moore",
    "Elizabeth Taylor",
    "James Anderson",
    "Mary Thomas",
  ];
  const categories = [
    "Fiction",
    "Science",
    "Technology",
    "Education",
    "Adventure",
    "Mystery",
    "Self-Help",
    "Fantasy",
    "History",
    "Biography",
  ];
  const descriptions = [
    "An exciting tale of discovery.",
    "A deep dive into the world of science.",
    "Master the art of coding.",
    "A thrilling mystery to unravel.",
    "Learn to solve complex problems.",
    "Explore the wonders of technology.",
    "A journey through time and history.",
    "An inspiring story of success.",
    "An epic adventure awaits.",
    "Unlock the secrets of the universe.",
  ];

  const books = [];
  for (let i = 0; i < count; i++) {
    const title = getRandomElement(titles);
    const author = getRandomElement(authors);
    const price = parseFloat((Math.random() * 100 + 10).toFixed(2));
    const category = getRandomElement(categories);
    const description = getRandomElement(descriptions);
    const quantity = Math.floor(Math.random() * 100 + 1);
    const inStock = quantity > 0;
    const createdAt = getRandomDateWithinLastYear();
    const updatedAt = getRandomDateWithinLastYear();

    books.push({
      title,
      author,
      price,
      category,
      description,
      quantity,
      inStock,
      createdAt,
      updatedAt,
    });
  }

  return books;
}

const generateBooks = catchAsync(async (req, res) => {
  const books = generateRandomBooks(100);
  fs.writeFileSync("books.json", JSON.stringify(books, null, 2), "utf-8");
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "100 random books JSON file has been generated: books.json",
  });
});

export const TestControllers = {
  generateBooks,
};
