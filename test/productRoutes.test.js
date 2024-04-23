const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Product Routes', () => {
    it('should get all products', (done) => {
        chai.request(app)
            .get('/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should create a new product', (done) => {
        chai.request(app)
            .post('/products')
            .send({ name: 'New Product', price: 10, category: 'Electronics' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body.name).to.equal('New Product');
                done();
            });
    });

    // Otros tests para actualizar y eliminar productos
});
