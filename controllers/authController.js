// authController.js

const User = require('../models/userModel');

// Mostrar el formulario de registro
exports.showRegisterForm = (req, res) => {
    res.render('register');
};

// Procesar el formulario de registro
exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Validar que se proporcionen todos los datos necesarios
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Ya existe un usuario con este correo electrónico');
        }

        // Crear un nuevo usuario
        const newUser = new User({ first_name, last_name, email, age, password });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        // Redirigir al usuario a la página de éxito o a otra vista
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

// Mostrar el formulario de inicio de sesión
exports.showLoginForm = (req, res) => {
    res.render('login');
};

// Procesar el formulario de inicio de sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se proporcionen todos los datos necesarios
        if (!email || !password) {
            return res.status(400).send('Correo electrónico y contraseña son obligatorios');
        }

        // Verificar si el usuario existe en la base de datos
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).send('Correo electrónico o contraseña incorrectos');
        }

        // Crear un objeto user en req.session
        req.session.user = user;

        // Redirigir al usuario a la página de éxito o a otra vista
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

// Cerrar sesión
exports.logout = (req, res) => {
    // Destruir la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err.message);
            res.status(500).send('Error interno del servidor');
        } else {
            res.redirect('/');
        }
    });
};
