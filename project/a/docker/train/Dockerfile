FROM nginx

MAINTAINER bmd <https://github.com/bmd080>

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx/train.conf /etc/nginx/conf.d/default.conf

COPY public/ /usr/share/nginx/html/

#COPY web/ /usr/share/nginx/html/web/

#COPY wrap/ /usr/share/nginx/html/wrap/

EXPOSE 80
