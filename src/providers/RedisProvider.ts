
import RedisWrapper, { CacheInterface } from "../adapters/RedisWrapper";
import { ENV, getEnv } from "../tools/Config";
import { maybeJSON, maybeToJSON } from "../tools/Parser";

enum RedisServerType {
    FILE_CACHE = "FILE_CACHE",
}

export default class RedisProvider {

    private static instance: RedisProvider;
    instances: CacheInterface[] = [];

    private constructor() {
      const fileCacheUri = getEnv(ENV.REDIS_URI_CACHE_FILES);

        if (fileCacheUri && fileCacheUri != "") {
            this.instances[RedisServerType.FILE_CACHE] = new RedisWrapper({ uri: fileCacheUri });
        }
    }

    static getInstance = () => {
      if (!RedisProvider.instance) {
        RedisProvider.instance = new RedisProvider();
      }
      return RedisProvider.instance;
    }

    check = (type: RedisServerType = RedisServerType.FILE_CACHE) => this.getRedisWrapper(type).check();

    checkMaster = () => {
        if (this.instances[RedisServerType.FILE_CACHE] && this.instances[RedisServerType.FILE_CACHE].check()) {
            return true;
        }
        return false;
    }

    getRedisWrapper = (type: RedisServerType = RedisServerType.FILE_CACHE): CacheInterface => {
        if (type == RedisServerType.FILE_CACHE && this.instances[RedisServerType.FILE_CACHE]) {
            return this.instances[RedisServerType.FILE_CACHE];
        }
        console.error("No hay ninguna instancia de Redis activa.");
        return null;
    }

    flushKey = (key) => {
        return this.getRedisWrapper(RedisServerType.FILE_CACHE).flushKey(key);
    }

    get = key => {
        if (key == "null" || key == null || key == "") {
            return null;
        }
      return this.getRedisWrapper(RedisServerType.FILE_CACHE).get(key).then(response => maybeJSON(response));
    }

    set = ({ key, data, EX = getEnv(ENV.REDIS_DEFAULT_CACHE_TIME) }) => {
        if (key == "null" || key == null || key == "") {
            return null;
        }
        data = maybeToJSON(data);
        return this.getRedisWrapper(RedisServerType.FILE_CACHE).set({ key, data, EX });
    }

    updateExpire = ({ key, EX = getEnv(ENV.REDIS_DEFAULT_CACHE_TIME) }) => {
      return this.getRedisWrapper(RedisServerType.FILE_CACHE).updateExpire({ key, EX });
    }

}

const getRedis = () => RedisProvider.getInstance();

export {
  RedisProvider,
  RedisServerType,
  getRedis,
};
