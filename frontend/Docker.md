docker run -d \
  --name edge-nginx \
  --network practicalinfosec \
  --restart unless-stopped \
  -p 80:80 \
  -v /opt/pi-nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:1.27-alpine




