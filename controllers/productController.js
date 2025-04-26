// controllers/productController.js
const Product = require("../models/Product");
const { createClient } = require("@supabase/supabase-js");
const supabase = require("../Supabase/supabase");
const multer = require("multer");
require("dotenv").config();

const uploadProduct = async (req, res) => {
  let imageUrls = [];

  try {
    console.log("Uploading product:", req.body);

    // 🔹 Trim inputs and parse JSON fields
    const {
      title,
      sku,
      price,
      originalPrice,
      discount,
      sizes,
      description,
      extraDetails,
      storeInfo,
      additionalInfo,
      shippingInfo,
      specifications,
    } = req.body;

    const images = req.files; // Get uploaded images

    // 🔹 Fix JSON fields
    const productData = {
      title: title?.trim(),
      sku: sku?.trim(),
      price: parseFloat(price?.trim()), // Convert to number
      originalPrice: parseFloat(originalPrice?.trim()), // Convert to number
      discount: discount?.trim(),
      sizes: sizes ? JSON.parse(sizes) : [], // Convert JSON string to array
      description: description?.trim(),
      extraDetails: extraDetails?.trim(),
      storeInfo: storeInfo?.trim(),
      additionalInfo: additionalInfo ? JSON.parse(additionalInfo) : {}, // Convert JSON string to object
      shippingInfo: shippingInfo ? JSON.parse(shippingInfo) : {},
      specifications: specifications ? JSON.parse(specifications) : {},
    };

    if (!productData.title || !productData.sku || !productData.price) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    if (images && images.length > 0) {
      for (const image of images) {
        // 🔹 Generate a unique file name
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}.jpg`;
        const folderName = "desinaar/productImage";
        const filePath = `${folderName}/${fileName}`;

        console.log("filename:", fileName);
        console.log("originalname:", image.originalname);

        try {
          // 🔹 Upload file to Supabase storage
          const { data, error: uploadError } = await supabase.storage
            .from("3gContent") // Replace with your Supabase bucket name
            .upload(filePath, image.buffer, {
              contentType: image.mimetype,
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error("Supabase upload error:", uploadError.message);
            throw new Error(`Supabase upload error: ${uploadError.message}`);
          }

          if (!data || !data.path) {
            throw new Error(
              "Supabase upload response data is invalid or path is missing."
            );
          }

          const SUPABASE_URL =
            "https://ewppyeqhqylgauppwvjd.supabase.co/storage/v1/object/public";
          const bucketName = "3gContent";

          // 🔹 Generate the public URL dynamically
          const publicUrl = `${SUPABASE_URL}/${bucketName}/${data.path}`;
          imageUrls.push(publicUrl); // Add image URL to array
          console.log("Image uploaded successfully:", publicUrl);
        } catch (uploadException) {
          console.error("Upload process failed:", uploadException.message);
          throw new Error(`Upload process failed: ${uploadException.message}`);
        }
      }
    }

    // 🔹 Save product details in the database
    const product = new Product({
      ...productData,
      imageUrls, // Store uploaded image URLs
    });

    await product.save();

    return res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Product uploaded successfully!",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Error uploading product",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Server error while retrieving products",
      error: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        statusCode: 404,
        message: "Product not found",
        data: null,
      });
    }
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Server error while retrieving product",
      error: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let imageUrls = [];

    const images = req.files;

    // If new images are uploaded
    if (images && images.length > 0) {
      for (const image of images) {
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
        const folderName = "desinaar/productImage";
        const filePath = `${folderName}/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from("3gContent")
          .upload(filePath, image.buffer, {
            contentType: image.mimetype,
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Supabase upload error: ${uploadError.message}`);
        }

        const SUPABASE_URL = "https://ewppyeqhqylgauppwvjd.supabase.co/storage/v1/object/public";
        const bucketName = "3gContent";
        const publicUrl = `${SUPABASE_URL}/${bucketName}/${data.path}`;
        imageUrls.push(publicUrl);
      }

      updates.imageUrls = imageUrls; // ✅ Add new imageUrls to the update
    }

    // Optional: Parse any fields like sizes, additionalInfo etc.
    if (updates.sizes) updates.sizes = JSON.parse(updates.sizes);
    if (updates.additionalInfo) updates.additionalInfo = JSON.parse(updates.additionalInfo);
    if (updates.shippingInfo) updates.shippingInfo = JSON.parse(updates.shippingInfo);
    if (updates.specifications) updates.specifications = JSON.parse(updates.specifications);

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        statusCode: 404,
        message: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Server error while updating product",
      error: err.message,
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        statusCode: 404,
        message: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Product deleted successfully",
      data: null,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Server error while deleting product",
      error: err.message,
    });
  }
};

module.exports = {
  uploadProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
