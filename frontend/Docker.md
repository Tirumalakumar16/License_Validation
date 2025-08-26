

                                                                                                      nginx.conf
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location /api/ {
    proxy_pass http://license-app:1626;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri /index.html;
  }
}


docker build -t practical-web ./frontend

docker rm -f practical-web

docker run -d \
  --name practical-web \
  --network practicalinfoseclicense \
  --restart unless-stopped \
  -p 8080:80 \
  practical-web





