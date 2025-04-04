-- Pour l'environnement de développement
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'bdd_user') THEN
      CREATE USER bdd_user WITH PASSWORD 'bdd_pass';
   END IF;
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = 'mydatabase_dev') THEN
      CREATE DATABASE mydatabase_dev;
   END IF;
END
$$;

-- Pour l'environnement de production
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'backend') THEN
      CREATE USER backend WITH PASSWORD 'backendpass';
   END IF;
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = 'backenddb') THEN
      CREATE DATABASE backenddb;
   END IF;
END
$$;
