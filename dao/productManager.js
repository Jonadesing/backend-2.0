const Product = require('../models/productModel');

class ProductManager {
    async getAllProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async addProduct(name, price) {
        try {
            const newProduct = new Product({ name, price });
            const savedProduct = await newProduct.save();
            return savedProduct;
        } catch (error) {
            throw new Error(`Error al agregar un producto: ${error.message}`);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedProduct) {
                throw new Error('Producto no encontrado');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado');
            }
            return deletedProduct;
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

module.exports = ProductManager;
