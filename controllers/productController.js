// controllers/productController.js
const Product = require('../models/productModel');

exports.getAllProducts = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const skip = (page - 1) * limit;

        const filter = query ? { category: query } : {};

        const products = await Product.find(filter)
            .sort({ price: sort === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        const prevLink = hasPrevPage ? `/products?limit=${limit}&page=${page - 1}` : null;
        const nextLink = hasNextPage ? `/products?limit=${limit}&page=${page + 1}` : null;

        res.status(200).json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page - 1,
            nextPage: page + 1,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};
