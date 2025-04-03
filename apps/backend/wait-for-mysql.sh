#!/bin/bash
# Attendre que MySQL soit prêt
until mysql -h mysql -u ${MYSQL_USER_dev} -p${MYSQL_PASSWORD_dev} -e 'select 1'; do
    echo "Attente que MySQL soit prêt..."
    sleep 2
done

echo "MySQL est prêt, exécution suivante..."