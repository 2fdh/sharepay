psql --username $1 -d sharepay2dfh_test -c "DROP TABLE IF EXISTS users;"
psql --username $1 -d sharepay2dfh_test -c "DROP TABLE IF EXISTS activities_users;"
psql --username $1 -d sharepay2dfh_test -c "DROP TABLE IF EXISTS expenses_users;"
psql --username $1 -d sharepay2dfh_test -c "DROP TABLE IF EXISTS expenses;"
psql --username $1 -d sharepay2dfh_test -c "DROP TABLE IF EXISTS activities;"

psql --host 127.0.0.1 --port 5432 --username $1 -d sharepay2dfh_test -f ./dump.sql

psql --username $1 -d sharepay2dfh_test -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sharepay2dfh_test;"
