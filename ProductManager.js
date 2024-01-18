const fs = require('fs');

class ProductManager {
    constructor(path, products = []) {
        this.path = path;
        this.products = products;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.log(`Error al cargar productos desde ${this.path}:`, error.message);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
            console.log('Productos guardados correctamente.');
        } catch (error) {
            console.log(`Error al guardar productos en ${this.path}:`, error.message);
        }
    }

    addProduct(product) {
        this.products.push(product);
        this.saveProducts();
        console.log(`Producto '${product.name}' agregado correctamente.`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const foundProduct = this.products.find(product => product.id === productId);
        return foundProduct || null;
    }

    updateProduct(productId, updatedProduct) {
        const index = this.products.findIndex(product => product.id === productId);

        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            this.saveProducts();
            console.log(`Producto con ID ${productId} actualizado correctamente.`);
            return true;
        } else {
            console.log(`No se encontró ningún producto con ID ${productId}. Actualización fallida.`);
            return false;
        }
    }

    deleteProduct(productId) {
        const index = this.products.findIndex(product => product.id === productId);

        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            console.log(`Producto con ID ${productId} eliminado correctamente.`);
            return true;
        } else {
            console.log(`No se encontró ningún producto con ID ${productId}. Eliminación fallida.`);
            return false;
        }
    }
}
module.exports = ProductManager;
// Ejemplo de uso
const productManager = new ProductManager('productos.json');

// Agregamos productos
productManager.addProduct({ id: 1, name: 'Producto A', price: 20.0 });
productManager.addProduct({ id: 2, name: 'Producto B', price: 30.0 });

// Obtener la lista de productos
const allProducts = productManager.getProducts();
console.log('Lista de productos:', allProducts);

// Actualizar un producto por ID
const productIdToUpdate = 1;
const updatedProductData = { name: 'Producto Actualizado', price: 25.0 };
productManager.updateProduct(productIdToUpdate, updatedProductData);

// Obtener la lista de productos actualizada
const updatedProducts = productManager.getProducts();
console.log('Lista de productos actualizada:', updatedProducts);

// Eliminar un producto por ID
const productIdToDelete = 2;
productManager.deleteProduct(productIdToDelete);

// Obtener la lista de productos después de la eliminación
const remainingProducts = productManager.getProducts();
console.log('Lista de productos después de la eliminación:', remainingProducts);
