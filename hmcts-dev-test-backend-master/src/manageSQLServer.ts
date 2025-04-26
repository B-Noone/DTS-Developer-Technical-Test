import { Connection, Request, ConnectionConfiguration, TYPES } from 'tedious';
import { Task, UnitTask } from './tasks/task.interface';

require('dotenv').config();

const config: ConnectionConfiguration = {
  server: `${process.env.DB_HOST}`,
  options: {
    trustServerCertificate: true,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
  },
  authentication: {
    type: 'default',
    options: {
      userName: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
    }
  }
};

export function establishConnections() {
  const connection = new Connection(config);

  const tableSchema = 'dbo';
  const tableName = 'task';

  const checkTalbeSql = `IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' AND TABLE_NAME='${tableName}') SELECT 1 AS res ELSE SELECT 0 AS res`;
  const createTalbeSql = `CREATE TABLE [${tableSchema}].[${tableName}] (id nvarchar(255) not null, title nvarchar(255) not null, description nvarchar(255), status nvarchar(50) not null, due_date datetime not null)`;

  connection.on('connect', function (err: any) {
    if (err) {
      console.log('Error: ', err)
      throw err;
    }
    // If no error, then good to go...
    createTaskTable().catch(console.error).finally(() => console.log("Table Initialization Complete!"));
  });

  connection.connect();

  async function createTaskTable() {
    const conn = await connectAsync(config);

    const existsRows = await execSqlAsync<{ res: number }>(conn, checkTalbeSql);
    if (existsRows[0].res > 0) {
      console.log('Table already exists!');
      conn.close();
      return;
    }

    await execSqlAsync(conn, createTalbeSql);
    console.log('Table created!');
    conn.close();
  }
}

export function connectAsync(config: any): Promise<Connection> {
  return new Promise((resolve, reject) => {
    const conn = new Connection(config);
    conn.on('connect', err => err ? reject(err) : resolve(conn));
    conn.connect();
  });
}

export function execSqlAsync<UnitTask>(conn: Connection, sql: string): Promise<UnitTask[]> {
  return new Promise((resolve, reject) => {
    const rows: UnitTask[] = [];
    const req = new Request(sql, (err) => {
      if (err){
        reject(err);
      }
      else {
        resolve(rows);
      }
    });
    req.on('row', cols => {
      const obj: any = {};
      cols.forEach((c: { metadata: { colName: string | number; }; value: any; }) => (obj[c.metadata.colName] = c.value));
      rows.push(obj as UnitTask);
    });
    conn.execSql(req);
  });
}

export async function runSQLGetAsync(sql: string): Promise<UnitTask[]> {
  const conn = await connectAsync(config);

  const SqlReq = await execSqlAsync(conn, sql);
  if (SqlReq.length === 0) {
    console.log('No rows returned!');
    conn.close();
    return []
  }
  conn.close();
  return SqlReq as UnitTask[];
}

export async function runSQLPostAsync(sql: string){
  const conn = await connectAsync(config);

  const SqlReq = await execSqlAsync(conn, sql);
  conn.close();
}