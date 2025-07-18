### Back‑end README (back-end/readme.md)

# E-Commerce Back-end API

This back‑end API provides the server‑side functionality for the e-commerce platform. It manages authentication, products, categories, brands, carts, orders, and more using a MySQL database with Sequelize ORM.

# Features

- **Authentication & Authorization:** 
  - Registration (`/auth/register`) and login (`/auth/login`) using JWT.
  - Middleware for route protection and admin-only endpoints.
- **Product Management:** 
  - CRUD operations on products (soft delete included) with raw SQL queries to fetch category and brand names.
- **Category & Brand Management:** 
  - CRUD endpoints for categories (`/categories`) and brands (`/brands`).
- **Cart & Order Processing:** 
  - Endpoints for managing user carts (`/cart`) and creating orders (`/cart/checkout/now`).
  - Unique order number generation.
  - Apply membership discount depending on membership status.
- **Initial Data Population:** 
  - An `/init` endpoint to populate roles, memberships, an initial admin account, and fetch product data.
- **API Documentation:** 
  - Swagger UI documentation is available at `/doc`.
- **Testing:** 
  - Jest and Supertest for automated testing of API endpoints.

# Libraries/Packages Used

- **express:** Web framework for Node.js.
- **sequelize:** ORM for database.
- **jsonwebtoken:** Implements user authentication.
- **crypto:** Encrypting user data.
- **Swagger UI Express:** Provides API documentation.
- **Jest:** JavaScript testing solution.
- **SuperTest:** Module for testing HTTP.
- **mysql2:** MySQL driver for Node.js.
- **body-parser:** Middleware for parsing request bodies.
- **dotenv:** Manage environment variables.

# Installation

1. **Clone the repository** and navigate to the back-end directory:
   ```bash
   cd back-end
   ```

2. **Install dependencies:** Run the following command to install all required dependencies
   ```bash
   npm install
   ```

3. **Configure .env file:**
   Create a `.env` file in the back-end folder with the following:
   ```env
   HOST=localhost
   ADMIN_USERNAME=your_mysql_username
   ADMIN_PASSWORD=your_mysql_password
   DATABASE_NAME=ecommerce_db
   DIALECT=mysql
   PORT=3000
   TOKEN_SECRET=your_jwt_secret
   ```

# Usage

1. **Start the server:** Execute the following command
  ```bash
  npm start
  ```
2. **Generate Secret Token:** Open a new terminal, run the following command
```bash
  node
```
```bash
require('crypto').randomBytes(64).toString('hex')
```
**Copy the token from the terminal, and paste it in the .env file**

3. **Initialize the Database:**
 - Start the server and run the `/init` endpoint (e.g via Postman) to seed initial data.

# Running Tests

### Example API request

**Access the API locally via `http://localhost:3000`. Use tools like Postman or Swagger UI(available at `/docs`) for testing endpoints.**

***Create a brand PUT request*** (with unauthorized privileges)
```json
{
    "name": "github"
}
```
***Error Response***
```json
{
    "status": "error",
    "statusCode": 401,
    "data": {
        "result": "Access denied. Token is required."
    }
}
```

### Run the CRUD tests using:
```bash
npm test
```
This test will:
 - Login in with initial admin account
 - Create a new category
 - Create a new brand
 - Create a new product
 - `GET` the created product
 - `PUT` previously created category
 - `PUT` previously created brand
 - `GET` previously created product with updated category/brand names
 - `DELETE` the product

## API Documentation & Routes

Access the Swagger UI at: [http://localhost:3000/doc](http://localhost:3000/doc)

