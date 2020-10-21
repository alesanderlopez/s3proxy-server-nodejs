
import * as AWS from 'aws-sdk';
import { getRedis } from "../providers/RedisProvider";
import { ENV, getEnv } from '../tools/Config';

class S3Proxy {

  private static instance: S3Proxy;

  s3 = null
  awsUri = null;

  private constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: getEnv(ENV.ACCESS_KEY_ID),
      secretAccessKey: getEnv(ENV.SECRET_ACCESS_KEY),
      params: {
        Bucket: getEnv(ENV.BUCKET),
      },
    });
    this.awsUri = getEnv(ENV.AWS_FULL_URL);
  }

  static getInstance = () => {
    if (!S3Proxy.instance) {
      S3Proxy.instance = new S3Proxy();
    }
    return S3Proxy.instance;
  }

  check = async (req, res) => {
    let services = {};
    services['redis'] = getRedis().check();
    res.json({ status: "OK", services: services });
  }

  requestFile = async (req, res) => {
    let {url} = req;

    if (url && url.length !== 0 && url[0] === "/") {
      url = url.substring(1);
    }
    
    const fileRedisCache = await getRedis().get(url);
    if(fileRedisCache && true) {
      return this.sendResponse(res, fileRedisCache);
    }

    try {
      const remoteFile = await this.s3.getObject({
        Key: url,
        Bucket: 'assets.imperionstudio.com',
      }).promise();

      if (remoteFile) {
        getRedis().set({ key: url, data: remoteFile });
        return this.sendResponse(res, remoteFile);
      }
    }
    catch(e) {}
    
    const remoteFileUrl = this.getBucketFile(url);
    res.status(302).redirect(remoteFileUrl);
  }

  private getBucketFile = url => `${this.awsUri}/${url}`;

  private sendResponse(res, file) {
    res.setHeader('ETag', file.ETag);
    res.setHeader('Content-Length', file.ContentLength);
    res.setHeader('Content-Type', file.ContentType);
    res.setHeader('Last-Modified', file.LastModified);

    return res.send(file.Body);
  }

}

const getS3Proxy = () => S3Proxy.getInstance();

export { getS3Proxy };
