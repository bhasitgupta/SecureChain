FROM postgres:16-alpine

ENV POSTGRES_DB=sih26125
ENV POSTGRES_USER=sih
ENV POSTGRES_PASSWORD=sih26125

# Copy database schema into init script directory for automatic initialization
COPY init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432
