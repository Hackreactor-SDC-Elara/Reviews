const request = require('supertest');
const server = require('../server/index.js');
const app = server.app;

describe('Testing server', function() {
  it('respond with SDC TESTING', async() => {
    const result = await request(app).get('/test');
    const expected = 'SDC TESTING';
    expect(result.res.text).toEqual(expected);
    expect(result.res.statusCode).toEqual(200);
  });
})

describe('Testing CRUD Operations - GET', function() {
  it('GET Reviews should return status code 200 if the product_id is valid', async() => {
    const result = await request(app).get('/reviews').query({product_id: '1'})
    expect(result.res.statusCode).toEqual(200);
  })
  it('GET Reviews should return status code 400 if the product_id is not provided', async() => {
    const result = await request(app).get('/reviews')
    expect(result.res.statusCode).toEqual(400);
  })
  it('GET Reviews should return status code 500 if the product_id is invalid or not available', async() => {
    const result = await request(app).get('/reviews').query({product_id: 'one'})
    expect(result.res.statusCode).toEqual(500);
  })
  it('GET Reviews Meta Data should return status code 200 if the product_id is valid', async() => {
    const result = await request(app).get('/reviews/meta').query({product_id: '1'})
    expect(result.res.statusCode).toEqual(200);
  })
  it('GET Reviews Meta Data should return status code 400 if the product_id is not provided', async() => {
    const result = await request(app).get('/reviews/meta')
    expect(result.res.statusCode).toEqual(400);
  })
  it('GET Reviews Meta Data should return status code 500 if the product_id is invalid or not available', async() => {
    const result = await request(app).get('/reviews/meta').query({product_id: 'one'})
    expect(result.res.statusCode).toEqual(500);
  })
})

describe('Testing CRUD Operations - GET', function() {
  it('GET Reviews should return status code 200 if the product_id is valid', async() => {
    const result = await request(app).get('/reviews').query({product_id: '1'})
    expect(result.res.statusCode).toEqual(200);
  })
  it('GET Reviews should return status code 400 if the product_id is not provided', async() => {
    const result = await request(app).get('/reviews')
    expect(result.res.statusCode).toEqual(400);
  })
  it('GET Reviews should return status code 500 if the product_id is invalid or not available', async() => {
    const result = await request(app).get('/reviews').query({product_id: 'one'})
    expect(result.res.statusCode).toEqual(500);
  })
  it('GET Reviews Meta Data should return status code 200 if the product_id is valid', async() => {
    const result = await request(app).get('/reviews/meta').query({product_id: '1'})
    expect(result.res.statusCode).toEqual(200);
  })
  it('GET Reviews Meta Data should return status code 400 if the product_id is not provided', async() => {
    const result = await request(app).get('/reviews/meta')
    expect(result.res.statusCode).toEqual(400);
  })
  it('GET Reviews Meta Data should return status code 500 if the product_id is invalid or not available', async() => {
    const result = await request(app).get('/reviews/meta').query({product_id: 'one'})
    expect(result.res.statusCode).toEqual(500);
  })
})

describe('Testing CRUD Operations - POST', function() {
  it('POST Review should return status code 201 if the request body is valid', async() => {
    const incomingData = {
      "product_id": "3",
      "rating": 4,
      "summary": "Aspernatur harum sint odio.",
      "body": "Dolorem placeat laudantium consequuntur atque id sunt est numquam. Iste eaque quo veritatis sunt. Libero laboriosam nostrum ea autem illum dolor consequatur. Sed dolores in ipsa molestiae omnis.",
      "recommend": true,
      "name": "Christiana.Reilly9",
      "email": "Kelley_Oberbrunner44@gmail.com",
      "response": "null",
      "photos": [
        {
          "id": "9254",
          "review_id": "19667",
          "url": "https://images.unsplash.com/photo-1510867759970-3d2ca293be77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
        }
      ],
      "characteristics": {
          "4":4,
          "2":2,
          "3":3,
          "1":1
        }
      };
    const result = await request(app).post('/reviews').send(incomingData);
    expect(result.res.statusCode).toEqual(201);
  })
  it('POST Review should return status code 400 if the required field of request body is empty', async() => {
    const incomingData = {
      "rating": 4,
      "summary": "Aspernatur harum sint odio.",
      "body": "Dolorem placeat laudantium consequuntur atque id sunt est numquam. Iste eaque quo veritatis sunt. Libero laboriosam nostrum ea autem illum dolor consequatur. Sed dolores in ipsa molestiae omnis.",
      "recommend": true,
      "name": "Christiana.Reilly9",
      "email": "Kelley_Oberbrunner44@gmail.com",
      "response": "null",
      "photos": [
        {
          "id": "9254",
          "review_id": "19667",
          "url": "https://images.unsplash.com/photo-1510867759970-3d2ca293be77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
        }
      ],
      "characteristics": {
          "4":4,
          "2":2,
          "3":3,
          "1":1
        }
      };
    const result = await request(app).post('/reviews').send(incomingData);
    expect(result.res.statusCode).toEqual(400);
  })
  it('POST Review should return status code 500 if the required field of request body is invalid', async() => {
    const incomingData = {
      "product_id": "three",
      "rating": 4,
      "summary": "Aspernatur harum sint odio.",
      "body": "Dolorem placeat laudantium consequuntur atque id sunt est numquam. Iste eaque quo veritatis sunt. Libero laboriosam nostrum ea autem illum dolor consequatur. Sed dolores in ipsa molestiae omnis.",
      "recommend": true,
      "name": "Christiana.Reilly9",
      "email": "Kelley_Oberbrunner44@gmail.com",
      "response": "null",
      "photos": [
        {
          "id": "9254",
          "review_id": "19667",
          "url": "https://images.unsplash.com/photo-1510867759970-3d2ca293be77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
        }
      ],
      "characteristics": {
          "4":4,
          "2":2,
          "3":3,
          "1":1
        }
      };
    const result = await request(app).post('/reviews').send(incomingData);
    expect(result.res.statusCode).toEqual(500);
  })
})

describe('Testing CRUD Operations - PUT', function() {
  it('PUT Helpfulness count should return status code 204 if the review id is valid', async() => {
    const review_id = 4;
    const result = await request(app).put(`/reviews/${review_id}/helpful`);
    expect(result.res.statusCode).toEqual(204);
  })
  // it('PUT Helpfulness count should return status code 400 if the review id is empty', async() => {
  //   const review_id = null;
  //   const result = await request(app).put(`/reviews/${review_id}/helpful`);
  //   expect(result.res.statusCode).toEqual(400);
  // })
  it('PUT Helpfulness count should return status code 500 if the review id is invalid', async() => {
    const review_id = 'Four';
    const result = await request(app).put(`/reviews/${review_id}/helpful`);
    expect(result.res.statusCode).toEqual(500);
  })
  it('PUT Report review should return status code 204 if the review id is valid', async() => {
    const review_id = 4;
    const result = await request(app).put(`/reviews/${review_id}/report`);
    expect(result.res.statusCode).toEqual(204);
  })
  // it('PUT Report review  should return status code 400 if the review id is empty', async() => {
  //   const review_id = null;
  //   const result = await request(app).put(`/reviews/${review_id}/report`);
  //   expect(result.res.statusCode).toEqual(400);
  // })
  it('PUT Report review  should return status code 500 if the review id is invalid', async() => {
    const review_id = 'Four';
    const result = await request(app).put(`/reviews/${review_id}/report`);
    expect(result.res.statusCode).toEqual(500);
  })
})