import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost/demo_toko';

export const options = {
  stages: [
    { duration: '20s', target: 5 },
    { duration: '30s', target: 10 },
    { duration: '20s', target: 15 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.95'],
  },
};

export default function () {
  const home = http.get(`${BASE_URL}/`);
  check(home, {
    'beranda HTTP 200': (r) => r.status === 200,
    'beranda memiliki judul': (r) => r.body.includes('DEMO TOKO'),
  });
  sleep(1);

  const health = http.get(`${BASE_URL}/api/health.php`);
  check(health, {
    'health API HTTP 200': (r) => r.status === 200,
  });
  sleep(2);
}