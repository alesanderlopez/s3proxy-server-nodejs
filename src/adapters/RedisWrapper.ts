import * as Redis from "ioredis";
import { ENV, getEnv } from "../tools/Config";

interface CacheInterface {
    flushKeys(keys): any,
    flushKey(key): any,
    check(): boolean,
    get(key): any,
    getMany(keys): any,
    set({ key, data, EX }): any,
    getRawInstance(): any,
}

export default class RedisWrapper implements CacheInterface {

    private redis;

    constructor({ uri }) {
      this.redis = new Redis(uri);
    }

    getRawInstance = () => this.redis;

    flushKeys = (keys = []) => {
      if (keys.length != 0) {
        const pipelineActions = keys.map(key => ['del', key]);
        return this.redis.pipeline(pipelineActions).exec();
      }
      return null;
    }

    flushKey = (key) => {
      return this.redis.del(key);
    }

    check = () => this.redis && this.redis.options.enableReadyCheck ? true : false

    get = key => {
        return this.redis.get(key);
    }

    getMany = keys => {
        if (keys.length != 0) {
            const pipelineActions = keys.map(key => ['get', key]);
            return this.redis.pipeline(pipelineActions).exec();
        }
        return [];
    }

    set = ({ key, data = "", EX = getEnv(ENV.REDIS_DEFAULT_CACHE_TIME) }) => {
        return this.redis.set(key, data, 'EX', EX);
    }

}


export {
  CacheInterface,
  RedisWrapper,
};
