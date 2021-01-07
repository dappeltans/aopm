const util = require( 'util' );
const mysql = require( 'mysql' );

function mysqlFunction( pool ) {
    const connection = pool.createConnection();  
    console.log("ANNEGREET PEETERS");
    return {
        query( sql, args ) {
            return util.promisify( connection.query ).call( connection, sql, args );
        },
        close() {
            return util.promisify( connection.end ).call( connection );
        },
        release() {
            return util.promisify( connection.release ).call( connection );
        },
        beginTransaction() {
            return util.promisify( connection.beginTransaction ).call( connection );
        },
        commit() {
            return util.promisify( connection.commit ).call( connection );
        },
        rollback() {
            return util.promisify( connection.rollback ).call( connection );
        }
    };
}
