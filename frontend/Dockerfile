# Production environment
FROM nginx:stable-alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY gzip.conf /etc/nginx/conf.d/gzip.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Pulisce la vecchia directory
RUN rm -rf /usr/share/nginx/html/*

# ✅ Copia direttamente i file Angular già pronti (senza soko-fe)
COPY dist/soko-fe/* /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
