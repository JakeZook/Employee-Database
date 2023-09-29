const mySQL = require('mysql2');

const db = mySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'jz_employee_db'
    },
)

class Query {
    constructor(selection)
    {
        this.selection = selection;
    }

    view(cb) {
        db.query(`SELECT * FROM ${this.selection}`, function (err, results) {
            console.table(results);
            cb();
        });
    }

    add() {
        console.log(`Adding to ${this.selection}`);
    }

    update() {
        console.log(`Updating employee role`);
    }
}

module.exports = {Query};
