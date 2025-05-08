import { Pool } from 'pg';

const pool = new Pool({
  user: 'offic',
  host: 'localhost',
  database: 'hackosquad',
  password: 'minhaz123',
  port: 5432,
});

export default pool;