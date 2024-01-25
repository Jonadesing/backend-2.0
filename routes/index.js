const express = require('express');
const router = express.Router();

const productsRoutes = require('./productsRoutes');
const sessionsRoutes = require('./sessionsRoutes');
const profileRoutes = require('./profileRoutes');

router.use('/', productsRoutes);
router.use('/api/sessions', sessionsRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
