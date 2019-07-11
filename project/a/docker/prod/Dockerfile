FROM nginx

MAINTAINER bmd <https://github.com/bmd080>

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx/prod.conf /etc/nginx/conf.d/default.conf

COPY web/ /usr/share/nginx/html/

#COPY wrap/ /usr/share/nginx/html/wrap/
#
#COPY ./cert /usr/share/nginx/cert

EXPOSE 443
