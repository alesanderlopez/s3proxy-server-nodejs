# s3proxy-server-nodejs

NodeJS server proxy for server S3 files

```
.env
REDIS_URI_CACHE_FILES="redis://:PASSWORD@SERVER-REDIS:30637/4"
REDIS_DEFAULT_CACHE_TIME="3600"
ACCESS_KEY_ID="---"
SECRET_ACCESS_KEY="---"
BUCKET="my.bucket.com"
AWS_FULL_URL="https://s3.eu-west-3.amazonaws.com/my.bucket.com" // Without "/" at the end
```