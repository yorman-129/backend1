const mysql = require('mysql');
const config = require('../config');

const dbConf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};
let connection;

function handleCon() {
    connection = mysql.createConnection(dbConf);

    connection.connect((err) => {
        if (err) {
            console.error('db[error]', err);
            setTimeout(handleCon, 2000);
        } else {
            console.log('DB connected');
        }
    });

    connection.on('error', e => {
        if (e.code === 'PROTOCOL_CONNECTION_LOST') {
            handleCon();
        } else {
            throw e;
        }
    })
}
handleCon();

function list(table) {
    return new Promise((res, rej) => {
        connection.query(`select * from ${table}`, (err, data) => {
            if (err) {
                return rej(err);
            }
            res(data);
        });
    });
}

function get(table, id) {
    return new Promise((res, rej) => {
        connection.query(`select * from ${table} where id=${id}`, (err, data) => {
            if (err) {
                return rej(err);
            }
            res(data);
        });
    });
}

function insert(table, id) {
    return new Promise((res, rej) => {
        connection.query(`insert into ${table} set ?`, id, (err, result) => {
            if (err) {
                return rej(err);
            }
            res(result);
        });
    });
}


function update(table, data) {
    return new Promise((res, rej) => {
        connection.query(`update ${table} set ? where id=?`, [data, data.id], (err, result) => {
            if (err) {
                return rej(err);
            }
            res(result);
        });
    });
}

async function upsert(table, data) {
    let lista = await list(table);
    
    let data_id = [];
    for (let key in lista) {
        if (data.id === lista[key].id) {
            data_id.push(lista[key].id)
            console.log(lista[key].id)
        }
    }
    console.log(data_id.length)
    if (data_id.length > 0) {
        return update(table, data);
    } else {
        return insert(table, data);
    }
}

function query(table, query) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE ?`, query, (err, res) => {
            if (err) return reject(err);
            resolve(res[0] || null);
        })
    })
}

module.exports = {
    list, get, upsert, query,
}