FROM quay.io/minio/minio:latest
USER root
RUN mkdir -p /data && chmod 777 /data
EXPOSE 9000
ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["server", "/data", "--address", "0.0.0.0:9000"]
