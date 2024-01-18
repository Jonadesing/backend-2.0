const Product = require('../models/productModel');

class ProductManager {
    async getAllProducts() {
        return await Product.find();
    }

    async getProductById(productId) {
        return await Product.findById(productId);
    }

    async addProduct(productData) {
        const newProduct = new Product(productData);
        return await newProduct.save();
    }

    async updateProduct(productId, updatedProductData) {
        return await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });
    }

    async deleteProduct(productId) {
        return await Product.findByIdAndDelete(productId);
    }
}

module.exports = new ProductManager();
