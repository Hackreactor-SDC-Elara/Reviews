import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import http from 'k6/http';

export const options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  thresholds: {
    http_req_failed: ['rate<0.05'], // http errors should be less than 5%
    // http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },
  scenarios: {
    my_scenario1: {
      executor: 'constant-arrival-rate',
      duration: '30s', // total duration
      preAllocatedVUs: 1000, // to allocate runtime resources
      rate: 1000, // number of constant iterations given `timeUnit`
      timeUnit: '1s',
    }
  }
};

export default function () {
  const url = new URL('http://localhost:3000/reviews');
  // var ranID = Math.floor(Math.random() * (950072 - 2) + 1);
  url.searchParams.append('product_id', '932867');
  const headers = { 'Content-Type': 'application/json' };
  http.get(url.toString(), { headers });
}