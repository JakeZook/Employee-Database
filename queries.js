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
            db.query(`SELECT R.ID, R.Job_Title, R.Salary, D.Department
            FROM Roles AS R
            JOIN Departments AS D ON R.Department_ID = D.ID
            ORDER BY R.ID;`, 
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
            db.query(`SELECT E.ID, E.First_Name, E.Last_Name, R.Job_Title, D.Department, E.Manager_Name
            FROM Employees AS E
            JOIN Roles AS R ON E.Role_ID = R.ID
            JOIN Departments AS D ON E.Department_ID = D.ID
            ORDER BY E.ID;`, 
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
                const name = res.departmentName;
                db.query(`INSERT INTO DEPARTMENTS (Department) 
                VALUES ("${name}")`,
                (err, res) => {
                    err ? reject(err) : resolve();
                })
            });
        });
    };

    addRole() {
        return new Promise((resolve, reject) => {
            const departmentList = [];

            const roleQuestions = [
                {
                    type: 'input',
                    message: 'What is the name of the role?',
                    name: "roleName"
                },
                {
                    type: 'list',
                    message: 'Which department does this role belong to?',
                    name: 'departmentName',
                    choices: departmentList
                },
                {
                    type: "input",
                    message: "What is the salary for this role?",
                    name: "salaryAmount"
                }
            ]

            db.query(`SELECT * FROM DEPARTMENTS`, (err, res) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    for (let i = 0; i < res.length; i++)
                    {
                        let department = res[i].Department;
                        departmentList.push(department);
                    }
                }
            });

            inquirer.prompt(roleQuestions)
            .then((res) => {
                const roleName = res.roleName;
                const departmentName = res.departmentName;
                const salaryAmount = res.salaryAmount;

                db.query(`INSERT INTO ROLES (Job_Title, Department_ID, Salary) 
                VALUES ("${roleName}", 
                (SELECT ID FROM DEPARTMENTS WHERE Department = "${departmentName}"), ${salaryAmount})`,
                (err, res) => {
                    err ? reject(err) : resolve();
                })
            });
        });
    };

    addEmployee() {
        return new Promise((resolve, reject) => {
            const rolesList = [];
            const managerList = [];

            const employeeQuestions = [
                {
                    type: 'input',
                    message: 'What is the first name of the employee?',
                    name: "firstName"
                },
                {
                    type: 'input',
                    message: 'What is the last name of the employee?',
                    name: "lastName"
                },
                {
                    type: 'list',
                    message: 'Which role does this employee have?',
                    name: 'roleName',
                    choices: rolesList
                },
                {
                    type: 'list',
                    message: 'Who is the manager for this employee?',
                    name: 'managerName',
                    choices: managerList
                }
            ]

            db.query(`SELECT * FROM ROLES`, (err, res) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    for (let i = 0; i < res.length; i++)
                    {
                        let role = res[i].Job_Title;
                        rolesList.push(role);
                    }
                }
            });

            
            db.query(`SELECT First_Name, Last_Name 
            FROM EMPLOYEES WHERE ROLE_ID = 4 || ROLE_ID = 6`, (err, res) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    for (let i = 0; i < res.length; i++)
                    {
                        let manager = `${res[i].First_Name} ${res[i].Last_Name}`;
                        managerList.push(manager);
                    }
                }
            });

            inquirer.prompt(employeeQuestions)
            .then((res) => {
                const firstName = res.firstName;
                const lastName = res.lastName;
                const roleName = res.roleName;
                const managerName = res.managerName;

                // const managerName = res.managerName.split(' ');
                // const managerFirstName = managerName[0];
                // const managerLastName = managerName[1];

                db.query(`INSERT INTO EMPLOYEES (First_Name, Last_Name, Role_ID, Department_ID, Manager_Name) 
                SELECT "${firstName}", "${lastName}", 
                (SELECT ID FROM ROLES WHERE Job_Title = "${roleName}"), 
                (SELECT ID FROM DEPARTMENTS WHERE ID = (SELECT Department_ID FROM ROLES WHERE Job_Title = "${roleName}")),
                "${managerName}"`,
                (err, res) => {
                    err ? reject(err) : resolve();
                })
            });
        });
    };

    updateEmployeeRole() {

    };

    quit() {
        console.log("Goodbye!");
        db.end();
    };
}

module.exports = Query;