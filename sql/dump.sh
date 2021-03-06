
psql --username $1 -d sharepay2fdh_test -c "DROP INDEX activity_id_attendee_id_idx;"
psql --username $1 -d sharepay2fdh_test -c "DROP TABLE IF EXISTS users;"
psql --username $1 -d sharepay2fdh_test -c "DROP TABLE IF EXISTS activities_users;"
psql --username $1 -d sharepay2fdh_test -c "DROP TABLE IF EXISTS expenses;"
psql --username $1 -d sharepay2fdh_test -c "DROP TABLE IF EXISTS expenses_attendees;"
psql --username $1 -d sharepay2fdh_test -c "DROP TABLE IF EXISTS attendees;"
psql --username $1 -d sharepay2fdh_test -c "DROP TABLE IF EXISTS activities;"

psql --host 127.0.0.1 --port 5432 --username $1 -d sharepay2fdh_test -f ./newdbexport.pgsql

psql --username $1 -d sharepay2fdh_test -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sharepay2fdh_test;"
psql --username $1 -d sharepay2fdh_test -c "ALTER ROLE sharepay2fdh_test WITH LOGIN" 
