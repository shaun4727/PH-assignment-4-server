# Book Shop Server

**Live Deployment Link:** https://ph-assignment-4-server-1.onrender.com

## Technologies

- TypeScript
- Node.js
- Express.js
- MongoDB with Mongoose

# Roles

#### Admin:

- Can Login (can't be registered)
- Can view detail of product.
- Can add product to cart.
- Can Increase quantity of the products added to cart, remove from cart
- Can make order.
- Can see the order history,manage products, deactivate users in Dashboard

#### User:

- Can Register and Login
- Can view detail of product.
- Can add product to cart, , remove from cart
- Can Increase quantity of the products added to cart
- Can make order.
- Can see the order history in Dashboard

# instruction to setup the project locally

This repository is currently public. To setup this project locally follow the instruction
given below -

1. clone the repository
2. move into project directory
3. create an .env which must contain fields that are defined in .env.example file

4. npm install (run this command)
5. npm run build ( run this command)
6. npm start (to start the server locally)
7. change the cors origin in `src/app` folder.

Now, project setup is done. Hit the api described below to get the expected result.

## API Endpoints

#### 1.1 Register User

**POST** `/api/auth/register`

**Description:** Registers a new user with the platform. It validates user data and saves it to the database.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password"
}
```

#### 1.2 Login User

**POST** `/api/auth/login`

**Description:** Logs in a user in the platform.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password"
}
```

#### 1.3 Get Users

**GET** `/api/auth/get-users`

**Description:** Gets all ther users from database. Only users with admin role can fetch data with this api.

#### 1.4 Get refresh token

**POST** `/api/auth/refresh-token`

**Description:** Gets the refresh token to generate a new access token.

**Request Body:**

```json
{
  "cookies": "cookies"
}
```

#### 2.1 Get All Products

**GET** `/api/products`

**Description:** Gets all the products.

```JavaScript
const args = [
  { name: "page", value: 1 },
  {
    name: "search",
    value: "The Fictional World",
  },
  {
    name: "filter",
    value: encodeURIComponent(
      JSON.stringify({
        author: "John Smith",
        category: "History",
        price: {
          $gte: 50,
          $lte: 400,
        },
      })
    ),
  },
];

const params = new URLSearchParams();
if (args) {
  args.forEach((item: TQueryParam) => {
    params.append(item.name, item.value as string);
  });
}
return {
  url: "/products",
  method: "GET",
  params: params,
};
```

#### 2.2 Create Product

**POST** `/api/products`

**Description:** Creates a product.

**Request Body:**

```json
{
  "title": "Product title",
  "image": "url",
  "author": "author name",
  "price": 123,
  "category": "category name",
  "description": "description name",
  "quantity": 12,
  "inStock": true
}
```

#### 2.3 Update product

**PUT** `/api/products/:id`

**Description:** Updates a product.

**Request Body:**

```json
{
  "title": "Product title",
  "image": "url",
  "author": "author name",
  "price": 123,
  "category": "category name",
  "description": "description name",
  "quantity": 12,
  "inStock": true
}
```

#### 2.4 Delete Product

**DELETE** `/api/products/:id`

**Description:** Deletes a product.

#### 3.1 Get Carousel images

**GET** `/api/carousel/get-carousel`

**Description:** Gets carousel images.

#### 3.2 Get all products

**GET** `/api/products/tab-books`

**Description:** Gets all products.

#### 4.1 Create Order

**POST** `/api/orders`

**Description:** Creates order.

**Request Body:**

```json
{
  "products": [
    {
      "product": 1,
      "quantity": 1,
      "price": 1,
      "stock": 1
    }
  ],
  "user": "user-id",
  "totalPrice": 1,
  "transaction": {
    "id": "string",
    "transactionStatus": "String",
    "bank_status": "String",
    "sp_code": "String",
    "sp_message": "String",
    "method": "String",
    "date_time": "String"
  }
}
```

#### 4.2 Delete Order

**DELETE** `/api/orders/:id`

**Description:** Deletes a order.

#### 4.3 Update Order

**PATCH** `/api/orders`

**Description:** Updates order.

**Request Body:**

```json
{
  "products": [
    {
      "product": 1,
      "quantity": 1,
      "price": 1,
      "stock": 1
    }
  ],
  "user": "user-id",
  "totalPrice": 1,
  "transaction": {
    "id": "string",
    "transactionStatus": "String",
    "bank_status": "String",
    "sp_code": "String",
    "sp_message": "String",
    "method": "String",
    "date_time": "String"
  }
}
```

#### 4.4 Verify Order

**GET** `/api/orders/verify/:order-id`

**Description:** Verifies order.

#### 4.5 Get Orders

**GET** `/api/orders`

**Description:** Gets all the order.

#### Types of Errors Handled

The following common errors has been managed with appropriate responses:

- **Zod Validation Error** (`ZOD_ERROR`): Errors arising from invalid data inputs based on Zod schema validation.
- **Not Found Error** (`NOT_FOUND_ERROR`): When requested resources (e.g., a user, item, or page) are not found.
- **Validation Error** (`VALIDATION_ERROR`): General validation errors (e.g., incorrect data format, missing required fields).
- **Authentication Error** (`AUTH_ERROR`): Issues related to failed authentication (e.g., invalid token or expired session).
- **Authorization Error** (`AUTHORIZATION_ERROR`): When the user lacks the necessary permissions to access a resource.
- **Internal Server Error** (`INTERNAL_SERVER_ERROR`): Unhandled errors or unexpected server issues.

By consistently implementing these error handling mechanisms, I ensure a smooth user experience and easier debugging.
