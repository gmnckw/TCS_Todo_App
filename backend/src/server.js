import 'dotenv/config';
import { createApp } from './app.js';
import { loadConfig } from './config/env.js';

const config = loadConfig();
const { app } = await createApp({ config });

app.listen(config.port, () => {
  console.log(`Todo API listening on port ${config.port}`);
});
