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
        preAllocatedVUs: 100, // to allocate runtime resources
        rate: 100, // number of constant iterations given `timeUnit`
        timeUnit: '1s',
      }
    }
  };
export default function() {
  const payload = JSON.stringify({
    "product_id": "932857",
    "rating": 4,
    "summary": "Aspernatur harum sint odio.",
    "body": "Dolorem placeat laudantium consequuntur atque id sunt est numquam. Iste eaque quo veritatis sunt. Libero laboriosam nostrum ea autem illum dolor consequatur. Sed dolores in ipsa molestiae omnis.",
    "recommend": true,
    "name": "Christiana.Reilly9",
    "email": "Kelley_Oberbrunner44@gmail.com",
    "response": "null",
    "photos": [],
    "characteristics": {
        "3122812":4,
        "3122813":2,
        "3122814":3,
        "3122815":1
    }});
  const url = new URL('http://localhost:3000/reviews');
  //url.searchParams.append('product_id', '783323');
  //url.searchParams.append('product_id', '853423');
  url.searchParams.append('product_id', '932857');
  const headers = { 'Content-Type': 'application/json' };
  http.post(url.toString(), payload, { headers });

}