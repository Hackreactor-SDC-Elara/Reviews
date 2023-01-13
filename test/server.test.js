const request = require('supertest');
const server = require('../server/index.js');

describe('Testing server', function() {
  it('respond with SDC TESTING', async() => {
    const app = server.app;
    const res = await request(app).get('/');
  })
});