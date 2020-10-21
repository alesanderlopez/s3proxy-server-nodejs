import { getS3Proxy } from "./resolvers/S3Proxy";
import { checkRequiredSettings, ENV, getEnv } from "./tools/Config";

const express = require('express');
const app = express();
const s3Proxy = getS3Proxy();

app.route('/check').get(s3Proxy.check);
app.route('/*').get(s3Proxy.requestFile);

let PORT = getEnv(ENV.HTTP_PORT, 4000);
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

checkRequiredSettings();
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})