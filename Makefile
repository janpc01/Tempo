all:
	clear
	node app.js

tables:
	sqlite3 database.db < db-ops/users.sql
	sqlite3 database.db < db-ops/habits.sql
	sqlite3 database.db < db-ops/days.sql
	sqlite3 database.db < db-ops/dashboard-habits.sql