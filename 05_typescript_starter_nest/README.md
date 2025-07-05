DOCKER BUILD
docker build -t tea-tracker . 

DOCKER START
docker run -p 3000:3000 tea-tracker