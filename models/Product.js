const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  sku: String,
  price: Number,
  originalPrice: Number,
  discount: String,
  sizes: [String],
  description: String,
  extraDetails: String,
  storeInfo: String,
  additionalInfo: {
    brand: String,
    manufacturer: String,
    address: String,
    customerSupport: String,
    productWeight: String,
    packageDimensions: String,
    countryOfOrigin: String,
  },
  shippingInfo: {
    freeShipping: Boolean,
    estimatedDelivery: String,
  },
  specifications: {
    color: String,
    fabric: String,
    embroidery: String,
    packContents: String,
  },
  imageUrls: [String], // Array to store up to 6 image URLs
});

module.exports = mongoose.model("Product", ProductSchema);
