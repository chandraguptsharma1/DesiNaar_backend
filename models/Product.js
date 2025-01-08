// models/Product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  category: {
    type: String
  },
  image: {
    type: String  // Could store an image URL or path to an uploaded file
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
