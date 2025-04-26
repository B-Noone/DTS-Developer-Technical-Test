import TediousConnection from 'tedious/lib/connection';
const { Connection, Request, TYPES } = require('tedious');

require('dotenv').config();

export function establishConnections() {
  const config: any = {
    server: `${process.env.DB_HOST}`,
    options: {
      trustServerCertificate: true,
    },
    authentication: {
      type: 'default',
      options: {
        userName: `${process.env.DB_USER}`,
        password: `${process.env.DB_PASSWORD}`,
      }
    }
  };

  const connection = new Connection(config);

  const table = '[dbo].[task]';

  connection.on('connect', function (err: any) {
    if (err) {
      console.log('Error: ', err)
      throw err;
    }
    // If no error, then good to go...
    createTable();
  });

  connection.connect();

  async function createTable() {
    const checkTalbeSql = `IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' AND TABLE_NAME='${table}') SELECT 1 AS res ELSE SELECT 0 AS res`;
    const checkExists = new Request(checkTalbeSql, (err: any) => {
      if (err) {
        throw err;
      }
    });

    const result = await connection.execSql(checkExists);
    if (result === 1) {
      console.log(`'${table}' already exists!`);
      return;
    }

    const sql = `CREATE TABLE ${table} (id uniqueidentifier not null, title nvarchar(255) not null, description nvarchar(255), status nvarchar(50) not null, due_date datetime not null)`;
    const request = new Request(sql, (err: any) => {
      if (err) {
        throw err;
      }

      console.log(`'${table}' created!`);
    });
    connection.execSql(request);
  }
}

