import { app } from './app.js';
import { env } from './config/index.js';

const server = app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

export default server;