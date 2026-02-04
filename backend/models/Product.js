import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    images: [
      {
        url: String,
        publicId: String,
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    videos: [
      {
        url: String,
        publicId: String,
        thumbnail: String,
        title: String,
      },
    ],
    // Arduino-specific fields
    specifications: {
      voltage: String,
      current: String,
      dimensions: String,
      weight: String,
      interface: String,
      chipset: String,
      compatibility: [String],
      pinout: String,
      operatingTemperature: String,
      custom: [
        {
          key: String,
          value: String,
        },
      ],
    },
    datasheets: [
      {
        name: String,
        url: String,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // SEO fields
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    // Reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: String,
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Update rating when reviews change
productSchema.methods.updateRating = function () {
  if (this.reviews.length > 0) {
    const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = (total / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  } else {
    this.rating = 0;
    this.numReviews = 0;
  }
};

const Product = mongoose.model('Product', productSchema);

export default Product;
