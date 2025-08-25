docker run -d \
  --name license-app \
  --network practicalinfosec \
  --restart unless-stopped \
  -e DB_HOST=vuln-mysql \
  -e DB_PORT=3306 \
  -e DB_NAME=practicalinfosec_license \
  -e DB_USER=root \
  -e DB_PASSWORD= \
  -e SERVER_PORT=1626 \
  -e RESEND_API_KEY='re_X35Dj2W7_DfxNhTomNkQ7wBfUYQB2jo8z' \
  -e JWT_SECRET='SuperStrongkey$wasusedtoprocted@^*Thecode7jhsdkjnreferThis@!asCode546fghf%^$$$$' \
  -p 1626:1626 \
  tirumalakumar16/practicalinfosec-license-v3:latest