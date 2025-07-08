# MERN E‑commerce Website 🛍️

A fully functional MERN Stack E‑commerce Website. Offers complete product and order management, secure user authentication, payment integration, and an admin panel for seamless control and data management.

---

## 🛠 Features

- **User Authentication:** Register, log in, and log out with JWT-based security.
- **Product Catalog:** Browse products with categories, search, product detail pages, and image galleries.
- **Cart & Checkout:** Add/remove items, update quantities, view totals, and proceed through checkout.
- **Payment Integration:** Secure payment processing (e.g., Stripe, Razorpay).
- **Order Management:**
  - Users: View past orders, order status, and details.
  - Admin: Access a dashboard to manage products, users, and orders.
- **Admin Panel:** Create, edit, and delete products; view and update orders, recommended to use client/admin route.
- **Responsive Design:** Mobile-first UI using React.

---

## 📚 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| **Database** | MongoDB + Mongoose                  |
| **Backend**  | Node.js + Express.js                |
| **Frontend** | React (Vite), Redux/Context, React Router |
| **Payments** | Stripe / PayPal                     |
| **Auth**     | JWT tokens                          |
| **Deployment**| Heroku / Render / Vercel (not deployed)  |

---

## 🧩 Setup & Installation

### Clone & move into the project
```bash
git clone https://github.com/dhruv-kapadia03/ecommerce-website-mern.git
cd ecommerce-website-mern
```

### 🛒 Backend (server)
```bash
cd server
npm install
```
Create a `.env` file:
```
PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret>
PAYMENT_CLIENT_ID=<Stripe/PayPal client id>
```
Run the backend:
```bash
npm run dev       # uses nodemon
# or
npm start
```

### 🧑‍💻 Frontend (client)
```bash
cd client
npm install
```
Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm start
```

Visit `http://localhost:3000/` for the storefront.

---

## 📝 Project Structure

```
/
├── client/             # React frontend
│   ├── src/
│   ├── public/
├── server/             # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
├── .gitignore
├── README.md
└── package.json         # root (if monorepo)
```

---

## 🎯 Usage

1. Register and log in as a user.
2. Browse items, add to cart, checkout via payment gateway.
3. User can update its profile (e.g. image, name, email).
4. Log in as **admin**, then access Admin Dashboard route.
5. Add new products, edit or remove existing ones, and manage orders.

---

## 🚀 Production Build & Deployment

### 1. Backend
- Add `Procfile` (Heroku/Render):
  ```
  web: node index.js
  ```
- Commit changes and push to your Git deployment platform.

### 2. Frontend
- Set API environment variable appropriately.
- Add build script and `Procfile`:
  ```
  web: serve -s build
  ```
- Deploy on static site platforms.

### 3. Environment Variables
Ensure these are configured on deploy environment:

- `MONGO_URI`
- `JWT_SECRET`
- `PAYMENT_CLIENT_ID`
- `PAYMENT_CLIENT_SECRET` (if needed)

---

## 🔜 Future Enhancements

- Implement product reviews and ratings.
- Add email notifications for order confirmation/status.
- Enable product filtering and sorting.
- Enhance security (rate limiting, helmet, CORS configuration).
- Add tests (Jest/Supertest for server, React Testing Library for client).
- Deploy CI/CD pipeline (GitHub Actions, Travis CI, etc.).
