/usr/local/nginx/sbin/nginx -s reload 重启

netstat -anp | grep :80 //Nginx监听的是80端口，那么就可以查看80端口运行的程序来判断Nginx是否运行
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
/usr/local/nginx/sbin/nginx -s reload
./nginx -s reload // nginx 重启

