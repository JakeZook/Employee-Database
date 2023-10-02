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
            db.query(`SELECT E.ID, E.First_Name, E.Last_Name, R.Salary, R.Job_Title, 
            D.Department, E.Manager_Name
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
                    err ? reject(err) : console.log("ADDED!"); resolve();
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
            ];

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
                    err ? reject(err) : console.log("ADDED!"); resolve();
                })
            });
        });
    };

    addEmployee() {
        return new Promise((resolve, reject) => {
            const rolesList = [];
            const managerList = ["None"];

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
            ];

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
            FROM EMPLOYEES WHERE Department_ID = 4`, (err, res) => {
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

                db.query(`INSERT INTO EMPLOYEES (First_Name, Last_Name, Role_ID, Department_ID, Manager_Name) 
                SELECT "${firstName}", "${lastName}", 
                (SELECT ID FROM ROLES WHERE Job_Title = "${roleName}"), 
                (SELECT ID FROM DEPARTMENTS WHERE ID = (SELECT Department_ID FROM ROLES WHERE Job_Title = "${roleName}")),
                "${managerName}"`,
                (err, res) => {
                    err ? reject(err) : console.log("ADDED!"); resolve();
                })
            });
        });
    };

    updateEmployeeRole() {
        return new Promise((resolve, reject) => {
            const rolesList = [];
            const employeeList = [];
    
            const updateRoleQuestions = [
                {
                    type: 'list',
                    message: 'Who is the employee you would like to update?',
                    name: 'employeeName',
                    choices: employeeList
                },
                {
                    type: 'list',
                    message: 'What is their new role?',
                    name: 'updatedRoleName',
                    choices: rolesList
                }
            ];
    
            // Use Promise.all to wait for both database queries to complete
            Promise.all([
                new Promise((resolve, reject) => {
                    db.query(`SELECT * FROM ROLES`, (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            for (let i = 0; i < res.length; i++) {
                                let role = res[i].Job_Title;
                                rolesList.push(role);
                            }
                            resolve();
                        }
                    });
                }),
                new Promise((resolve, reject) => {
                    db.query(`SELECT First_Name, Last_Name FROM EMPLOYEES`, (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            for (let i = 0; i < res.length; i++) {
                                let employee = `${res[i].First_Name} ${res[i].Last_Name}`;
                                employeeList.push(employee);
                            }
                            resolve();
                        }
                    });
                })
            ])
            .then(() => {
                inquirer.prompt(updateRoleQuestions)
                    .then((res) => {
                        const roleName = res.updatedRoleName;
                        let roleID = null;
                        let deptID = null;
                        const employeeName = res.employeeName.split(' ');
                        const employeeFirstName = employeeName[0];
                        const employeeLastName = employeeName[1];
    
                        db.query(`SELECT ID FROM ROLES WHERE Job_Title = "${roleName}"`, (err, res) => {
                            roleID = res[0].ID;

                            db.query(`SELECT Department_ID FROM ROLES WHERE ID = ${roleID}`, (err, res) => {
                                deptID = res[0].Department_ID;
                                
                                db.query(
                                    `UPDATE EMPLOYEES SET Role_ID = ${roleID}, Department_ID = ${deptID} 
                                    WHERE First_Name = "${employeeFirstName}" AND Last_Name = "${employeeLastName}"`,
                                    (err, updateResult) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            console.log("UPDATED!");
                                            resolve();
                                        }
                                    });
                                });
                            });
                        });
                    })
                .catch((err) => {
                reject(err);
            });
        });
    };

    deleteDepartment() {
        return new Promise((resolve, reject) => {
            const departmentList = [];
    
            const deleteQuestion = {
                type: 'list',
                message: 'Which department would you like to delete?',
                name: 'departmentName',
                choices: departmentList
            };
    
            db.query(`SELECT * FROM DEPARTMENTS`, (err, res) => {
                for (let i = 0; i < res.length; i++) 
                {
                    let department = res[i].Department;
                    departmentList.push(department);
                }
    
                inquirer.prompt(deleteQuestion)
                .then((answers) => {
                    const departmentName = answers.departmentName;

                    db.query(`DELETE FROM DEPARTMENTS WHERE Department = '${departmentName}'`, (err, result) => {
                        err ? reject(err) : console.log("DELETED!"); resolve();
                    });
                });     
            });
        });
    };                   
    
    deleteRole() {
        return new Promise((resolve, reject) => {
            const roleList = [];
    
            const deleteQuestion = {
                type: 'list',
                message: 'Which role would you like to delete?',
                name: 'roleName',
                choices: roleList
            };
    
            db.query(`SELECT * FROM ROLES`, (err, res) => {
                for (let i = 0; i < res.length; i++) 
                {
                    let role = res[i].Job_Title;
                    roleList.push(role);
                }
    
                inquirer.prompt(deleteQuestion)
                .then((answers) => {
                    const roleName = answers.roleName;

                    db.query(`DELETE FROM ROLES WHERE Job_Title = '${roleName}'`, (err, result) => {
                        err ? reject(err) : console.log("DELETED!"); resolve();
                    });
                });     
            });
        });
    };      
    
    deleteEmployee() {
        return new Promise((resolve, reject) => {
            const employeeList = [];
    
            const deleteQuestion = {
                type: 'list',
                message: 'Which employee would you like to delete?',
                name: 'employeeName',
                choices: employeeList
            };
    
            db.query(`SELECT First_Name, Last_Name FROM EMPLOYEES`, (err, res) => {
                for (let i = 0; i < res.length; i++) 
                {
                    let employee = `${res[i].First_Name} ${res[i].Last_Name}`;
                    employeeList.push(employee);
                }
    
                inquirer.prompt(deleteQuestion)
                .then((answers) => {
                    const employeeName = answers.employeeName.split(' ');
                    const employeeFirstName = employeeName[0];
                    const employeeLastName = employeeName[1];

                    db.query(`DELETE FROM EMPLOYEES
                    WHERE First_Name = "${employeeFirstName}" AND Last_Name = "${employeeLastName}"`, 
                    (err, result) => {
                        err ? reject(err) : console.log("DELETED!"); resolve();
                    });
                });     
            });
        });
    };      
    
    getBudget() {
        return new Promise((resolve, reject) => {
            let total = 0;
            const departmentList = ["All departments"];

            const budgetQuestion = {
                type: 'list',
                message: 'Which department budget would you like to view?',
                name: 'departmentName',
                choices: departmentList
            }

            db.query(`SELECT Department FROM DEPARTMENTS`, (err, res) => {
                for (let i = 0; i < res.length; i ++)
                {
                    let department = res[i].Department;
                    departmentList.push(department);
                }

                inquirer.prompt(budgetQuestion)
                .then((res) => {
                    const departmentName = res.departmentName;

                    if (departmentName == "All departments") {
                        db.query(`SELECT SUM(r.Salary) AS Total
                        FROM Roles r
                        JOIN Employees e ON r.ID = e.Role_ID`, (err, res) => {
                            console.log(`Total budget: $${res[0].Total}`);
                            resolve();
                        })
                    }

                    else {
                        db.query(`SELECT SUM(r.Salary) AS Total
                        FROM Departments d
                        JOIN Roles r ON d.ID = r.Department_ID
                        JOIN Employees e ON r.ID = e.Role_ID
                        WHERE d.Department = "${departmentName}"`, (err, res) => {
                            console.log(`Total budget: $${res[0].Total}`);
                            resolve();
                        });
                    }
                });
            });
        });
    };

    quit() {
        console.log("Goodbye!");
        db.end();
    };
}

module.exports = Query;