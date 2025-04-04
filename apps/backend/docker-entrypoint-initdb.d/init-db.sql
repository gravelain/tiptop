-- Pour l'environnement de développement
DO
$$
BEGIN
   -- Vérifie si l'utilisateur bdd_user existe, sinon crée-le
   IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'bdd_user') THEN
      CREATE USER bdd_user WITH PASSWORD 'bdd_pass';
   END IF;

   -- Vérifie si la base de données mydatabase_dev existe, sinon crée-la
   IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'mydatabase_dev') THEN
      CREATE DATABASE mydatabase_dev WITH OWNER bdd_user;
   END IF;
END
$$;

-- Pour l'environnement de production
DO
$$
BEGIN
   -- Vérifie si l'utilisateur backend existe, sinon crée-le
   IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'backend') THEN
      CREATE USER backend WITH PASSWORD 'backendpass';
   END IF;

   -- Vérifie si la base de données backenddb existe, sinon crée-la
   IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'backenddb') THEN
      CREATE DATABASE backenddb WITH OWNER backend;
   END IF;
END
$$;
