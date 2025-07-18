### Front‑end README (front-end/readme.md)

# E-Commerce Front-end

This front‑end application is built using Node.js/Express, EJS, Bootstrap. It serves as the client side of the e-commerce platform, communicating exclusively with the back‑end API(running on port 3000).

# Features

- **Admin Dashboard:**
   - Secure login requiring admin role.
   - Admin interface for managing products, categories, brands, users, roles, memberships and orders.
- **API Integration:**
  - Axios calls to back‑end endpoints for user authentication, product retrieval, and more.
- **Responsive Design:**
  - Built with Bootstrap for responsiveness and improved UI/UX.

# Libraries/Packages Used

- **express**: Web framework for Node.js
- **express-session:** Session management.
- **connect-sqlite3:** SQLite session store.
- **ejs:** Template engine for the dynamic HTML.
- **axios:** Handle API requests.

# CDN Used
- **bootstrap 5.3 CSS:**
```bash
  https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css
```
- **bootstrap 5.3 JS:**
```bash
  https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
```
- **bootstrap 1.11 Icons:**
```bash
  https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css
```

# Installation

1. **Clone the repository** and navigate to the frontend directory:
   ```bash
   cd front-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

# Running the Front‑end Server

Start the server using:
```bash
npm start
```
The front‑end application will run on [http://localhost:3001](http://localhost:3001).

# API Integration

- All API calls are made to the back‑end API at `http://localhost:3000`.
- The application uses axios to communicate with endpoints.

