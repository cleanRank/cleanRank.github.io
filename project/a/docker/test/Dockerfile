FROM nginx

MAINTAINER bmd <https://github.com/bmd080>

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx/test.conf /etc/nginx/conf.d/default.conf

COPY public/ /usr/share/nginx/html/

#COPY web/ /usr/share/nginx/html/web/

#COPY wrap/ /usr/share/nginx/html/wrap/

EXPOSE 18093
