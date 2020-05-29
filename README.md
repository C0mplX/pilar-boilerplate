# README

## Run dartabase in docker
$ docker run --name pilar_db -p 4307:3306 -v pilar_db:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=db_root_password -e MYSQL_USER=auth_gate_db_user -e MYSQL_PASSWORD=auth_gate_db_password -d mysql --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

### create a empty migration file
yarn sequelize-cli migration:generate --name migration-skeleton

### manuel migration
yarn sequelize-cli db:migrate
