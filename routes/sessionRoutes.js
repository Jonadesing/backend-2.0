const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Para cifrar contraseñas
const User = require('../models/userModel');

// Registro de usuario
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    // Cifrar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    res.redirect('/api/sessions/login'); // Redirigir al formulario de inicio de sesión
  } catch (error) {
    console.error('Error al registrar el usuario:', error.message);
    res.redirect('/error-page'); // Redirigir al usuario a la página de error en caso de fallo
  }
});

// Formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login-form');
});

// Autenticación de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por su correo electrónico en la base de datos
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Si el usuario existe y la contraseña es válida, iniciar sesión
      req.session.user = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
      };

      res.redirect('/profile'); // Redirigir al perfil del usuario
    } else {
      res.status(401).send('Credenciales incorrectas'); // 401 Unauthorized
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.redirect('/error-page'); // Redirigir al usuario a la página de error en caso de fallo
  }
});

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
