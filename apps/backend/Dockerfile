# Dockerfile principal

# Utiliser une image PHP avec FPM pour la construction
FROM php:8.2-fpm AS base

# Définir le répertoire de travail
WORKDIR /var/www/html

# Installer les dépendances système et les extensions PHP requises par Symfony
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    curl \
    libcurl4-openssl-dev \
    && docker-php-ext-install \
    pdo_mysql \
    zip \
    intl \
    opcache \
    mbstring \
    xml \
    curl

# Copier Composer (en utilisant l'image officielle Composer)
FROM base AS dev
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Étape de développement : Installer les dépendances
WORKDIR /var/www/html
COPY apps/backend/composer.json /var/www/html/composer.json
COPY apps/backend/composer.lock /var/www/html/composer.lock
COPY . /var/www/html/
RUN composer install --prefer-dist --no-progress --no-interaction

EXPOSE 5000
CMD ["php-fpm"]

# Étape de préproduction : Dépendances optimisées pour staging
FROM base AS preprod
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Copier le projet
WORKDIR /var/www/html
COPY . /var/www/html/

RUN composer install --no-dev --optimize-autoloader --no-progress --no-interaction

EXPOSE 5000
CMD ["php-fpm"]

# Étape de production : Image finale optimisée pour production
FROM base AS prod
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Copier le projet
WORKDIR /var/www/html
COPY . /var/www/html/

RUN composer install --no-dev --optimize-autoloader --no-progress --no-interaction

EXPOSE 5000
ENV SYMFONY_ENV=prod
CMD ["php-fpm"]
