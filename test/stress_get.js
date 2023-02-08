import http from 'k6/http';
import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
const port = 3000;
const url = `http://localhost:${port}`;

export const options = {
  // scenarios: {
  //   my_scenario1: {
  //     executor: 'constant-arrival-rate',
  //     duration: '30s', // total duration
  //     preAllocatedVUs: 100, // to allocate runtime resources     preAll

  //     rate: 1, // number of constant iterations given `timeUnit`
  //     timeUnit: '1s',
  //   },
  // }
  vus: 1,
  duration: '30s'
};

export default function () {
  const getUrl = new URL(`http://localhost:${port}/reviews`);
  // getUrl.searchParams.append('product_id', '853423');
  getUrl.searchParams.append('product_id', '783323');
  // getUrl.searchParams.append('product_id', '932857');

  const params = {
    headers : { 'Content-Type': 'application/json' }
  }

  http.get(getUrl.toString(), params);
}