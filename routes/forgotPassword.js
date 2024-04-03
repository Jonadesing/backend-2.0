const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Ruta para solicitar restablecimiento de contraseña
router.post('/forgot-password', (req, res) => {
    const nodemailer = require('nodemailer');

    // Configurar el transporte del correo electrónico
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tucorreo@gmail.com', // Tu correo electrónico
            pass: 'tucontraseña' // Tu contraseña
        }
    });
    
    // Función para enviar el correo electrónico de restablecimiento de contraseña
    const sendResetPasswordEmail = async (email, token) => {
        // Crear el enlace de restablecimiento de contraseña
        const resetLink = `http://tudominio.com/reset-password?token=${token}`;
    
        // Configurar el correo electrónico
        const mailOptions = {
            from: 'tucorreo@gmail.com', // Tu correo electrónico
            to: email,
            subject: 'Restablecimiento de contraseña',
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${resetLink}">${resetLink}</a></p>`
        };
    
        // Enviar el correo electrónico
        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo electrónico de restablecimiento de contraseña enviado con éxito.');
        } catch (error) {
            console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
        }
    };
    
    module.exports = sendResetPasswordEmail;
    
});

module.exports = router;
