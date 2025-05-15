const Cart = require("../models/Cart");

exports.addtoCards = async (req, res) => {
  try {
    const { productID } = req.body;
    const userID = req.user.id;

    if (!productID) {
      return res.status(400).json({
        status: 400,
        msg: "Product ID is required",
        data: null,
      });
    }

    let existingItem = await Cart.findOne({ userID, productID });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      return res.status(200).json({
        status: 200,
        msg: "Product quantity updated",
        data: existingItem,
      });
    }

    const cartItem = new Cart({
      productID,
      userID,
      quantity: 1,
    });

    await cartItem.save();
    res.status(200).json({
      status: 200,
      msg: "Product added to cart",
      data: cartItem,
    });
  } catch (err) {
    console.error("Add to Cart Error:", err);
    res
      .status(500)
      .json({ status: 500, message: "Internal server error", data: null });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userID = req.user.id;

    const cartItems = await this.addtoCards
      .find({ userID })
      .populate("productID");

    res.status(200).json({
      status: 200,
      msg: "Successfully get cart data",
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      msg: "Something went wrong",
      data: null,
    });
  }
};
