#!/bin/bash
/opt/mssql/bin/sqlservr &

# Esperar a que SQL Server arranque
sleep 20s

# Ejecutar script
/opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P $MSSQL_SA_PASSWORD -i /init.sql

wait
