// userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

// Ruta para obtener todos los usuarios (solo datos principales)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, { name: 1, email: 1, role: 1 });
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para eliminar usuarios inactivos
router.delete('/', async (req, res) => {
    try {
        const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // Últimos 30 minutos (para propósitos de prueba)
        const deletedUsers = await User.deleteMany({ last_connection: { $lt: cutoffTime } });
        
        // Enviar correo electrónico a los usuarios eliminados por inactividad
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tu_correo@gmail.com',
                pass: 'tu_contraseña'
            }
        });

        const emails = deletedUsers.map(user => user.email);
        const mailOptions = {
            from: 'tu_correo@gmail.com',
            to: emails,
            subject: 'Cuenta eliminada por inactividad',
            text: 'Tu cuenta ha sido eliminada debido a la inactividad. Por favor, contáctanos si tienes alguna pregunta.'
        };

        await transporter.sendMail(mailOptions);
        
        res.send(`Se eliminaron ${deletedUsers.deletedCount} usuarios inactivos`);
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para subir documentos a un usuario específico
router.post('/:uid/documents', async (req, res) => {
    const userId = req.params.uid;
    const documents = req.body.documents;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        user.documents = documents;
        await user.save();

        res.send('Documentos actualizados correctamente');
    } catch (error) {
        console.error('Error al subir documentos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
