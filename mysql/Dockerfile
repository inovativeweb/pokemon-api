FROM mysql:5.7
COPY db_init.sql /docker-entrypoint-initdb.d/db_init.sql
# ROOT PASSWORD
ENV MYSQL_ROOT_PASSWORD=password

#ENV MYSQL_DATABASE=sampledb
ENV MYSQL_USER=testnode
ENV MYSQL_PASSWORD=123456


ENV MYSQL_DATA_DIR=/var/lib/mysql \
    MYSQL_RUN_DIR=/run/mysqld \
    MYSQL_LOG_DIR=/var/log/mysql

#RUN mysql -h localhost -u root -ppassword -P 3306   < /docker-entrypoint-initdb.d/db_init.sql

#PORT
#EXPOSE 3306