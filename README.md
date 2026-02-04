# Arduino E-commerce Platform

A full-stack e-commerce platform specialized for selling Arduino components and electronic parts, featuring React frontend with maximum optimization, Express/MongoDB backend, Cloudinary media management, and tracking pixel integrations.

## Features

### Frontend
- ⚡ **Optimized React with Vite** - Code splitting, lazy loading, compression
- 🎨 **Modern Arduino-themed Design** - Premium UI with glassmorphism and animations
- 📱 **Fully Responsive** - Mobile-first design
- 🛒 **Shopping Cart** - LocalStorage persistence
- 📦 **Product Management** - Browse, search, filter by category
- 🎥 **Video Learning Center** - Educational Arduino tutorials
- 📊 **React Query** - Data caching and optimization
- 📈 **Tracking Pixels** - Facebook Pixel + TikTok Pixel integration

### Backend
- 🚀 **Express.js API** - RESTful endpoints
- 🗄️ **MongoDB Atlas** - Cloud database
- 🖼️ **Cloudinary Integration** - Automatic image/video optimization
- 🔐 **JWT Authentication** - Secure user sessions
- 💰 **COD Payment** - Cash on Delivery support
- 🛡️ **Security** - Helmet, rate limiting, CORS

## Tech Stack

### Frontend
- React 18
- Vite (Build tool)
- React Router DOM
- React Query (TanStack Query)
- Axios
- Zustand (State management)
- Facebook Pixel
- TikTok Pixel

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary SDK
- JWT (jsonwebtoken)
- Bcrypt.js
- Multer (File uploads)

## Project Structure

```
salahshop/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── videoController.js
│   ├── middleware/
│   │   ├── asyncHandler.js
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Video.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── videoRoutes.js
│   ├── utils/
│   │   └── cloudinaryUpload.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── Header.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── VideoCard.jsx
    │   ├── context/
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── ProductDetailsPage.jsx
    │   │   └── VideoLearnerPage.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── productService.js
    │   ├── utils/
    │   │   ├── facebookPixel.js
    │   │   └── tiktokPixel.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Facebook Pixel ID (optional)
- TikTok Pixel ID (optional)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas - Replace with your connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arduino-shop?retryWrites=true&w=majority

# JWT Secret - Change this to a strong secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Cloudinary - Get from cloudinary.com dashboard
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Optional: Admin default credentials
ADMIN_EMAIL=admin@arduinoshop.com
ADMIN_PASSWORD=admin123
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
VITE_TIKTOK_PIXEL_ID=your_tiktok_pixel_id
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add review (Auth)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `POST /api/orders` - Create order (Public/Guest)
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/my-orders` - Get user orders (Auth)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Videos
- `GET /api/videos` - Get all videos (with filters)
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Create video (Admin)
- `PUT /api/videos/:id` - Update video (Admin)
- `DELETE /api/videos/:id` - Delete video (Admin)
- `POST /api/videos/:id/like` - Like video (Public)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Auth)
- `PUT /api/auth/profile` - Update profile (Auth)

## Features in Detail

### Frontend Optimizations
- **Code Splitting**: Lazy loading of pages
- **Compression**: Gzip and Brotli compression
- **Image Optimization**: Cloudinary automatic transformations
- **Caching**: React Query with smart cache strategies
- **Bundle Size**: Optimized chunk splitting

### Tracking Pixels
- **Facebook Pixel**: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase
- **TikTok Pixel**: Same events with TikTok format

### Payment
- **COD (Cash on Delivery)**: Primary payment method
- Automatic stock management
- Order tracking with unique order numbers

## License

MIT

## Support

For support, email contact@arduinoshop.com
