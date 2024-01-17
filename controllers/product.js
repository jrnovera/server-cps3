const Product = require("../models/product");
const User = require("../models/user");

// [SECTION] Create a new product
exports.addProduct = (req, res) => {
  const { name, description, price } = req.body;
  const newProduct = new Product({
    name,
    description,
    price,
  });

  newProduct
    .save()
    .then((product) => {
      return res.send(true); // Assuming success means sending true
    })
    .catch((err) => res.send(false));
};

// [SECTION] Retrieve all products
exports.getAllProducts = (req, res) => {
  Product.find({})
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
};

// [SECTION] Retrieve all ACTIVE products
exports.getAllActiveProducts = (req, res) => {
  Product.find({ isActive: true })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
};

// [SECTION] Retrieving a specific product
exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
};

// [SECTION] Update a product
exports.updateProduct = (req, res) => {
  const { name, description, price } = req.body;
  const updatedProduct = {
    name,
    description,
    price,
  };

  Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(() => res.send(true))
    .catch((err) => res.send(false));
};

// [SECTION] Archive a product
exports.archiveProduct = (req, res) => {
  const updateActiveField = {
    isActive: false,
  };

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then(() => res.send(true))
    .catch((err) => res.send(false));
};

// [SECTION] Activate a product
exports.activateProduct = (req, res) => {
  const updateActiveField = {
    isActive: true,
  };

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then(() => res.send(true))
    .catch((err) => res.send(false));
};

// [SECTION] Search products by name
exports.searchProductByName = async (req, res) => {
  try {
    const { productName } = req.body;
    const products = await Product.find({
      name: { $regex: productName, $options: "i" },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [SECTION] Get emails of enrolled users in a product
exports.getEmailsOfEnrolledUsers = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const userIds = product.enrollments.map((enrollee) => enrollee.userId);
    const enrolledUsers = await User.find({ _id: { $in: userIds } });
    const emails = enrolledUsers.map((user) => user.email);

    res.status(200).json({ emails });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving enrolled users" });
  }
};

// [ACTIVITY] Search products by price range
exports.searchProductsByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    res.status(200).json({ products });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for products" });
  }
};