const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/userModel');

// Configurar Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profile') {
            cb(null, 'uploads/profiles');
        } else if (file.fieldname === 'product') {
            cb(null, 'uploads/products');
        } else {
            cb(null, 'uploads/documents');
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        req.files.forEach(file => {
            user.documents.push({ name: file.originalname, link: file.path });
        });

        await user.save();
        res.status(200).json({ message: 'Documentos subidos exitosamente', documents: user.documents });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir documentos' });
    }
});

// Ruta para actualizar a usuario premium
router.put('/premium/:uid', async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const requiredDocs = ['identificación', 'comprobante de domicilio', 'comprobante de estado de cuenta'];
        const uploadedDocs = user.documents.map(doc => doc.name);

        const hasRequiredDocs = requiredDocs.every(doc => uploadedDocs.includes(doc));
        if (!hasRequiredDocs) {
            return res.status(400).json({ error: 'Faltan documentos requeridos' });
        }

        user.role = 'premium';
        await user.save();
        res.status(200).json({ message: 'Usuario actualizado a premium' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar a premium' });
    }
});

// Otras rutas de usuario (GET, DELETE, etc.)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

router.delete('/', async (req, res) => {
    try {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const users = await User.find({ last_connection: { $lt: twoDaysAgo } });

        const emailService = require('../services/emailService'); // Suponiendo que tienes un servicio de correo configurado

        await Promise.all(users.map(async (user) => {
            await emailService.sendEmail(user.email, 'Cuenta eliminada por inactividad', 'Tu cuenta ha sido eliminada por inactividad.');
            await user.remove();
        }));

        res.status(200).json({ message: 'Usuarios inactivos eliminados' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
});

module.exports = router;
