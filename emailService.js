// emailService.js

const nodemailer = require('nodemailer');

// Configurar el transportador para Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tucorreo@gmail.com',
        pass: 'tucontraseña'
    }
});

// Función para enviar un correo electrónico
const enviarCorreo = (destinatario, asunto, contenido) => {
    const mailOptions = {
        from: 'tucorreo@gmail.com',
        to: destinatario,
        subject: asunto,
        text: contenido
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
};

module.exports = enviarCorreo;
