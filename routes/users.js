const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');

// Configuración de Multer para guardar archivos en carpetas específicas
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder;
        if (file.fieldname === 'profileImage') {
            folder = 'profiles';
        } else if (file.fieldname === 'productImage') {
            folder = 'products';
        } else {
            folder = 'documents';
        }
        cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Endpoint POST para subir documentos
router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
    const { uid } = req.params;
    const uploadedFiles = req.files;

    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        uploadedFiles.forEach(file => {
            user.documents.push({
                name: file.originalname,
                reference: `/uploads/documents/${file.filename}`,
                type: file.fieldname
            });
        });

        await user.save();
        res.status(200).send('Documentos subidos correctamente');
    } catch (error) {
        console.error('Error al subir documentos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Endpoint para actualizar a usuario premium
router.put('/premium/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Verificar si el usuario ha cargado los documentos requeridos
        const requiredDocuments = ['ID', 'ProofOfAddress', 'BankStatement'];
        const uploadedDocuments = user.documents.map(doc => doc.type);

        const hasAllRequiredDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

        if (hasAllRequiredDocuments) {
            user.role = 'premium';
            await user.save();
            res.status(200).send('Usuario actualizado a premium');
        } else {
            res.status(400).send('El usuario debe cargar todos los documentos requeridos');
        }
    } catch (error) {
        console.error('Error al actualizar el usuario a premium:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
