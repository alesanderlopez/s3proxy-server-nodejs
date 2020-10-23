dir_path=$(dirname "$0")
docker build --no-cache -t alesanderlopez/s3-cache-proxy-nodejs $dir_path
docker push alesanderlopez/s3-cache-proxy-nodejs
docker rmi $(docker images -q alesanderlopez/s3-cache-proxy-nodejs) -f