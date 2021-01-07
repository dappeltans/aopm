require("dotenv").config();

const connection = (pool, utils) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);
            utils.log("debug", "mysql connection create", "MySQL pool connected: threadId " + connection.threadId);
            const query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    connection.query(sql, binding, (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
            };
            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    utils.log("debug", "mysql connection release", "MySQL pool released: threadId " + connection.threadId);
                    resolve(connection.release());
                });
            };
            resolve({ query, release });
        });
    });
};
const query = (sql, binding) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, binding, (err, result, fields) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};
module.exports = { connection, query };