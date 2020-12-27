import { test } from '../../src/server';
var app = test('/api/v1', './src/routes');
import { config } from 'dotenv';
config({ path: `${__dirname}/../.env` });
export default app;
