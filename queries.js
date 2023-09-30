const mySQL = require('mysql2');
const inquirer = require('inquirer');

const db = mySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'jz_employee_db'
    },
)

class Query {
    constructor () {}

    viewDepartments() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM DEPARTMENTS`, (err, res) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    console.table(res);
                    resolve(); // Resolve the promise if the query is successful
                }
            });
        });
    };

    viewRoles() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT Department_ID, Job_Title, Salary, Department FROM ROLES JOIN DEPARTMENTS ON Roles.Department_ID = Departments.ID`, 
            (err, res) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    console.table(res);
                    resolve(); // Resolve the promise if the query is successful
                }
            });
        });
    };
    
    viewEmployees() {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM EMPLOYEES", (err, res) => {
                err ? reject(err) : resolve();
            });
        });
    };

    addDepartment() {
        return new Promise((resolve, reject) => {
            inquirer.prompt(
                {
                    type: 'input',
                    message: 'What is the name of the Department?',
                    name: "departmentName"
                }
            )
            .then((res) => {
                console.log(res.departmentName);
                const name = res.departmentName;
                db.query(`INSERT INTO DEPARTMENTS (Department) VALUES ("${name}")`,
                (err, res) => {
                    err ? reject(err) : resolve();
                })
            });
        });
    };

    addRole() {

    };

    addEmployee() {

    };

    updateEmployeeRole() {

    };

    quit() {
        console.log("Goodbye!");
        db.end();
    };
}

module.exports = Query;