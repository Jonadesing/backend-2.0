const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Session Routes', () => {
    it('should register a new session', (done) => {
        chai.request(app)
            .post('/api/sessions/register')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Otros tests para inicio de sesión, cierre de sesión, etc.
});
