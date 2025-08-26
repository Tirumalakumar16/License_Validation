docker run -d \
  --name license-app \
  --network practicalinfoseclicense \
  --restart unless-stopped \
  -e DB_HOST=license-mysql \
  -e DB_PORT=3306 \
  -e DB_NAME=practicalinfosec_license \
  -e DB_USER=root \
  -e DB_PASSWORD=Gra#hd@idg \
  -e SERVER_PORT=1626 \
  -e RESEND_API_KEY='re_X35Dj2W7_DfxNhTomNkQ7wBfUYQB2jo8z' \
  -e JWT_SECRET='SuperStrongkey$wasusedtoprocted@^*Thecode7jhsdkjnreferThis@!asCode546fghf%^$$$$' \
  -p 1626:1626 \
  tirumalakumar16/practicalinfosec-license-v4:latest


# for root password
  docker run -d \
  --name license-mysql \
  --network practicalinfoseclicense \
  --restart unless-stopped \
  -e MYSQL_ROOT_PASSWORD=Gra#hd@idg \
  -e MYSQL_DATABASE=practicalinfosec_license \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin123 \
  -p 3308:3306 \
  -v mysql-data-license:/var/lib/mysql \
  mysql:8.4


# for empty password
   docker run -d \
  --name license-mysql \
  --network practicalinfoseclicense \
  --restart unless-stopped \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -e MYSQL_DATABASE=practicalinfosec_license \
  -e MYSQL_USER=admin \
  -p 3308:3306 \
  -v mysql-data-license:/var/lib/mysql \
  mysql:8.4