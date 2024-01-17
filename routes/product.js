const express = require("express");
const productController = require("../controllers/product");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

// Create a product (POST)
router.post("/", verify, verifyAdmin, productController.addProduct);

// Retrieve all products
router.get("/all", productController.getAllProducts);

// Retrieve all active products
router.get("/", productController.getAllActiveProducts);

// Search products by name
router.get("/search", productController.searchProductByName);

// Search products by price range
router.get("/searchByPrice", productController.searchProductsByPriceRange);

// Retrieve a specific product
router.get("/:productId", productController.getProduct);

// Update a product (Admin)
router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

// Archive a product (Admin)
router.put(
  "/:productId/archive",
  verify,
  verifyAdmin,
  productController.archiveProduct
);

// Activate a product (Admin)
router.put(
  "/:productId/activate",
  verify,
  verifyAdmin,
  productController.activateProduct
);

module.exports = router;