
const chaiHttp = require('chai-http');
const app = require('../server.js'); // Importa tu aplicación Express
const expect = chai.expect;

chai.use(chaiHttp);
import('chai').then(chai => {
    const expect = chai.expect;
    // Resto del código de las pruebas utilizando chai


describe('Rutas de Autenticación', () => {
    it('debería renderizar el formulario de login', (done) => {
        chai.request(app)
            .get('/login')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.include('Formulario de Login');
                done();
            });
    });

    it('debería autenticar al usuario', (done) => {
        chai.request(app)
            .post('/login')
            .send({ username: 'testuser', password: 'password' })
            .end((err, res) => {
                expect(res).to.redirect; // Suponiendo que la autenticación exitosa redirige a /dashboard
                done();
            });
    });

    it('debería renderizar el formulario de perfil', (done) => {
        chai.request(app)
            .get('/profile')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.include('Formulario de Perfil');
                done();
            });
    });

    it('debería registrar un nuevo usuario', (done) => {
        chai.request(app)
            .post('/register')
            .send({ username: 'newuser', password: 'password', email: 'newuser@example.com' })
            .end((err, res) => {
                expect(res).to.redirect; // Suponiendo que el registro exitoso redirige a /login
                done();
            });
    });

    it('debería cerrar la sesión del usuario', (done) => {
        chai.request(app)
            .get('/logout')
            .end((err, res) => {
                expect(res).to.redirect; // Suponiendo que el cierre de sesión exitoso redirige a /
                done();
            });
        });
    }).catch(err => {
        console.error('Error al importar chai:', err);
    });

});
