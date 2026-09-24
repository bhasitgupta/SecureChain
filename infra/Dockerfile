FROM postgres:16-alpine

ENV POSTGRES_DB=securechain
ENV POSTGRES_USER=securechain
ENV POSTGRES_PASSWORD=securechain

# Copy database schema into init script directory for automatic initialization
COPY init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432
