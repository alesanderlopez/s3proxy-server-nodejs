enum ENV {
  NODE_ENV = "NODE_ENV",
  HTTP_PORT = "HTTP_PORT",
  END_POINT = "END_POINT", // "http://localhost:4466"
  HOST = "HOST", // "http://192.168.1.159:4000"
  REDIS_URI_CACHE_FILES = "REDIS_URI_CACHE_FILES", // "redis://:PASSWORD@192.168.1.12:30637/0"
  REDIS_DEFAULT_CACHE_TIME = "REDIS_DEFAULT_CACHE_TIME", // "3600"
  ACCESS_KEY_ID = "ACCESS_KEY_ID",
  SECRET_ACCESS_KEY = "SECRET_ACCESS_KEY",
  BUCKET = "BUCKET",
  AWS_FULL_URL = "AWS_FULL_URL",
}

const Default_ENV = {
  NODE_ENV: "debug",
  HTTP_PORT: 4000,
  END_POINT: "http://localhost:4000",
  HOST: "http://localhost:4000",
  REDIS_URI_CACHE_FILES: "redis://localhost:6379/4",
  REDIS_DEFAULT_CACHE_TIME: 3600,
  ACCESS_KEY_ID: null,
  SECRET_ACCESS_KEY: null,
  BUCKET: null,
  AWS_FULL_URL: null,
}

const checkRequiredSettings = () => {
  const requiredValues = [ENV.AWS_FULL_URL, ENV.BUCKET, ENV.SECRET_ACCESS_KEY, ENV.ACCESS_KEY_ID];
  for (const field of requiredValues) {
    const selectedEnv = getEnv(field);
    if (selectedEnv === null) {
      console.error(`Required parameter ${field} don't configured.`);
      process.exit(1);
    }
  }
}

const formatEnv = (value, format) => {
  switch (format) {
    case 'string' && typeof value === 'string': return value;
    case 'string' && typeof value === 'number': return value.toString();
    case 'number' && typeof value === 'number': return value;
    case 'number' && typeof value === 'string': return parseInt(value);
    default: return value.toString();
  }
}

const getEnv = (key: ENV, defaultValue = null) => {
  if (process.env.hasOwnProperty(key)) {
    return process.env[key];
  }
  else if (Default_ENV.hasOwnProperty(key) && defaultValue == null) {
    return Default_ENV[key];
  }
  return defaultValue;
}

const getEnvFormated = (key, defaultValue = null, format = "string") => {
  const env = getEnv(key, defaultValue);
  return formatEnv(env, format);
}

const isProduction = () => (getEnv(ENV.NODE_ENV) === "production")
const isDebug = () => (getEnv(ENV.NODE_ENV) === "debug")

export {
  ENV,
  getEnv,
  getEnvFormated,
  isProduction,
  isDebug,
  checkRequiredSettings,
};
