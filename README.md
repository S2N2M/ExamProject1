
# Exam Project 1 | E-Commerce Platform

This project is a e-commerce application split into two separate applications:
- **Back‑end API (Port 3000):** A Node.js/Express API with a MySQL database (using Sequelize), JWT-based authentication, Swagger documentation, and business logic for products, carts, orders etc.
- **Front‑end (Port 3001):** A client application built with Express, EJS, Bootstrap, and plain JavaScript that communicates with the back‑end API endpoints.

## Prerequisites

**Ensure you have the following installed:**

  - **Node.js**: v20.0 or higher
  - **MySQL Server**: v8.0

## Technologies

- **Back‑end:**
  - Node.js/Express
  - Sequelize
  - MySQL
  - JWT for authentication
  - Swagger API documentation accessible via `/doc`
  - Testing with Jest & Supertest

- **Front‑end:**
  - Node.js/Express
  - EJS templates
  - Bootstrap
  - Communicates exclusively with the back‑end API
  - Admin dashboard for managing products, orders, etc.

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/S2N2M/ExamProject1
   ```

2. **Set Up the Back‑end**
   - See the [back-end/README.md](./back-end/readme.md) for installation and running instructions.

3. **Set Up the Front‑end**
   - See the [front-end/README.md](./front-end/readme.md) for installation and running instructions.

## Project Structure

```
/back-end    # Back‑end API source code, tests, Swagger docs, etc.
/front-end   # Front‑end client application (EJS, static assets, etc.)
README.md    # Overall project overview and instructions
```

## Notes

- Ensure your MySQL database is set up and the credentials are correctly configured in the `.env` file (in the back‑end).
- The `/init` endpoint (back‑end) needs to only be ran once to seed initial roles, memberships, and the admin account.
- Swagger documentation for the API is available at `http://localhost:3000/doc`.


## References
- `https://www.w3schools.com/mysql/mysql_wildcards.asp` - Search Query
- `https://sequelize.org/docs/v7/querying/operators/` - Sequelize Operators
- `https://sequelize.org/docs/v7/models/data-types/` - Sequelize DataTypes
- `https://www.w3schools.com/jsref/jsref_tofixed.asp` - toFixed() method
- `https://www.w3schools.com/jsref/jsref_object_keys.asp` - Object keys
- `https://axios-http.com/docs/api_intro` - Axios API
- `https://getbootstrap.com/docs/5.3/components/card/` - Card layout
- `https://getbootstrap.com/docs/5.3/components/modal/` - Modal