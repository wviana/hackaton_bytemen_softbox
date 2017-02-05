'use strict'

var _ = require('lodash')

module.exports = class PostgresDriver {
	constructor(host, user, password, database) {
		this.pg 	   = require('pg')

		this.conString = `postgres://${user}:${password}@${host}/${database}` // make sure to match your own database's credentials
	}

	getSchema(onSuccess) {
		this.pg.connect(this.conString, function (err, client, done) {
			if (err) {
				return console.error('error fetching client from pool', err)
			}

			var sql = 
				`WITH keys AS (
				    SELECT    
				    tc.table_name,
				    tc.constraint_name,
				    tc.constraint_type,
				    ccu.table_name AS fk_table,
				    ccu.column_name AS fk_column
				    FROM information_schema.table_constraints tc
				    LEFT JOIN information_schema.constraint_column_usage  ccu USING(constraint_name)
				    WHERE 1 = 1
				        AND tc.constraint_schema = 'public'
				        AND tc.constraint_type IN  ('FOREIGN KEY', 'PRIMARY KEY')
				)
				SELECT
				    c.table_name,
				    c.column_name,
				    c.data_type,
				    c.character_maximum_length,
				    c.is_nullable,
				    CASE
				        WHEN fks.constraint_type = 'PRIMARY KEY' THEN TRUE 
				        ELSE FALSE 
				    END AS pk,
				    CASE
				        WHEN fks.constraint_type = 'FOREIGN KEY' THEN TRUE 
				        ELSE FALSE 
				    END AS fk,
				    CASE c.table_name
				        WHEN fks.fk_table THEN NULL
				        ELSE fks.fk_table
				    END AS fk_table,
				    CASE c.table_name
				        WHEN fks.fk_table THEN NULL
				        ELSE fks.fk_column
				    END AS fk_column
				FROM  information_schema.columns AS c
				LEFT JOIN keys fks ON 1 = 1
				    AND fks.table_name = c.table_name
				    AND fks.fk_column = c.column_name
				WHERE 1 = 1
				    AND c.table_schema = 'public';
			`;

			client.query(sql, [], function (err, result) {
				done()

				if (err) {
				  	return console.error('error happened during query', err)
				}

				var schema = _.groupBy(result.rows, 'table_name')

				return onSuccess(schema)
			})
		})
	}
}