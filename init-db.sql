-- Pour l'environnement de développement
SELECT 1 FROM mysql.user WHERE user = '${MYSQL_USER_dev}' LIMIT 1;
CREATE USER IF NOT EXISTS '${MYSQL_USER_dev}'@'%' IDENTIFIED WITH caching_sha2_password BY '${MYSQL_PASSWORD_dev}';
GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE_dev}.* TO '${MYSQL_USER_dev}'@'%';
FLUSH PRIVILEGES;

-- Pour l'environnement de préproduction
SELECT 1 FROM mysql.user WHERE user = '${MYSQL_USER_preprod}' LIMIT 1;
CREATE USER IF NOT EXISTS '${MYSQL_USER_preprod}'@'%' IDENTIFIED WITH caching_sha2_password BY '${MYSQL_PASSWORD_preprod}';
GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE_preprod}.* TO '${MYSQL_USER_preprod}'@'%';
FLUSH PRIVILEGES;

-- Pour l'environnement de production
SELECT 1 FROM mysql.user WHERE user = '${MYSQL_USER_prod}' LIMIT 1;
CREATE USER IF NOT EXISTS '${MYSQL_USER_prod}'@'%' IDENTIFIED WITH caching_sha2_password BY '${MYSQL_PASSWORD_prod}';
GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE_prod}.* TO '${MYSQL_USER_prod}'@'%';
FLUSH PRIVILEGES;
