# MaleFashion Project

## Overview
The MaleFashion project is a web application designed to showcase and manage a fashion store. The project includes functionalities for product management and user interactions, such as viewing products and adding new items.

## Features
- View a list of fashion products.
- Add, edit, and delete products.
- Search products by categories.

## Technology Stack
- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript Templates), Tailwind CSS
- **Database**: MongoDB

## Prerequisites
Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or above)
- [MongoDB](https://www.mongodb.com/)

## Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd malefashion
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   PORT=3000
   ```

4. **Start MongoDB**:
   Ensure your MongoDB service is running locally or provide a valid remote connection string.

## Running the Application
1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Directory Structure
```plaintext
malefashion/
├── controllers/
│   ├── admin.js        # Handles admin-related logic
│   └── shop.js         # Handles shop-related logic
├── models/
│   └── product.js      # Product model for MongoDB
├── public/             # Static files (CSS, JS, images)
├── routes/
│   ├── admin.js        # Admin routes
│   └── shop.js         # Shop routes
├── views/
│   ├── admin/          # EJS templates for admin pages
│   └── shop/           # EJS templates for shop pages
├── .env                # Environment configuration
├── app.js              # Main application file
└── package.json        # Project metadata and dependencies
```

## Key Routes
- `/` - Home page
- `/products` - List of products
- `/admin/add-product` - Add a new product (Admin only)
- `/admin/edit-product/:productId` - Edit a product (Admin only)

## Deployment
1. **Build for production**:
   If necessary, prepare the project for deployment by configuring the `NODE_ENV` to `production`.

2. **Deploy to a hosting provider**:
   You can deploy this project to any Node.js-supported hosting provider such as [Heroku](https://heroku.com), [Render](https://render.com), or [Vercel](https://vercel.com).

## Contributing
Contributions are welcome! Feel free to fork this repository and submit pull requests.


