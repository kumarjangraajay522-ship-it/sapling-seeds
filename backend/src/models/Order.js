import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity cannot be less than 1.']
        },
        image: String
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      default: 'COD' // Cash on Delivery default
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    isShipped: {
      type: Boolean,
      default: false
    },
    shippedAt: Date,
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Order', orderSchema);
