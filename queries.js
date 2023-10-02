const mySQL = require('mysql2');
const inquirer = require('inquirer');

//Create connection to database
const db = mySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'jz_employee_db'
    },
)

//Constructor to hold all query methods
class Query {
    constructor () {}

    //Renders all departments in the Departments table
    viewDepartments() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM DEPARTMENTS`, (err, res) => {
                //Reject if error, resolve is no error
                err ? reject(err) : console.table(res); resolve();
            });
        });
    };

    //Renders all roles in the Roles table
    viewRoles() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT R.ID, R.Job_Title, R.Salary, D.Department
            FROM Roles AS R
            JOIN Departments AS D ON R.Department_ID = D.ID
            ORDER BY R.ID;`, 
            (err, res) => {
                //Reject if error, resolve is no error
                err ? reject(err) : console.table(res); resolve();
            });
        });
    };
    
    //Renders all employees in the Employees table
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
                //Reject if error, resolve is no error
                    err ? reject(err) : console.table(res); resolve();
                }
            });
        });
    };

    //Adds a department to the Departments table
    addDepartment() {
        return new Promise((resolve, reject) => {
            //Gets user input for the name of the Department
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
                    //Reject if error, resolve is no error
                    err ? reject(err) : console.log("ADDED!"); resolve();
                })
            });
        });
    };

    //Adds a role to the Roles table
    addRole() {
        return new Promise((resolve, reject) => {
            //Empty array that will hold all the current departments in the Departments table
            const departmentList = [];

            //Gets user input for the name, department, and salary for the new role
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

            //Gets all current departments from the Departments table and pushes results into array
            //This allows user to select from a list of departments
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

                //Adds the role and sets the department of the role to the user input
                db.query(`INSERT INTO ROLES (Job_Title, Department_ID, Salary) 
                VALUES ("${roleName}", 
                (SELECT ID FROM DEPARTMENTS WHERE Department = "${departmentName}"), ${salaryAmount})`,
                (err, res) => {
                    //Reject if error, resolve is no error
                    err ? reject(err) : console.log("ADDED!"); resolve();
                })
            });
        });
    };

    //Adds and employee to the employees table
    addEmployee() {
        return new Promise((resolve, reject) => {
            //Empty arrays to hold all current roles in the Roles table 
            //and a list of employees in the manager department
            const rolesList = [];
            //The "None" value is in the array by default in case the employee does not have a manager
            const managerList = ["None"];

            //Prompts for user to get Employee's first and last name, their role, and who their manager is
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

            //Gets a list of current roles and pushes into the roles array
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

            //Gets a list of all employees in the Management department and pushes them into the array
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

            //Gets user input and runs the query based on results
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
                    //Reject if error, resolve is no error
                    err ? reject(err) : console.log("ADDED!"); resolve();
                })
            });
        });
    };

    //Changes the role of a specified employee
    updateEmployeeRole() {
        return new Promise((resolve, reject) => {
            //Empty array to hold all current Roles
            const rolesList = [];
            //Empty array to hold all current Employees
            const employeeList = [];
    
            //Prompts for updating employee's role
            //Gets the employee that needs to be updated and their new role
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
                    //Gets all current roles and pushes results into the array
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
                    //Gets the full name from every employee and pushes data to array
                    db.query(`SELECT First_Name, Last_Name FROM EMPLOYEES`, (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            for (let i = 0; i < res.length; i++) {
                                //Combines first and last name into full name
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
                        //Splits the full employee name back into two variables to query the Employees table
                        const employeeName = res.employeeName.split(' ');
                        const employeeFirstName = employeeName[0];
                        const employeeLastName = employeeName[1];
                        
                        //Gets role ID of the selected role and assigns it to a variable
                        db.query(`SELECT ID FROM ROLES WHERE Job_Title = "${roleName}"`, (err, res) => {
                            roleID = res[0].ID;

                            //Gets department ID of that role and assigns it to a variable
                            db.query(`SELECT Department_ID FROM ROLES WHERE ID = ${roleID}`, (err, res) => {
                                deptID = res[0].Department_ID;
                                
                                //Updates the role and department ID for the employee matching the provided name
                                db.query(
                                    `UPDATE EMPLOYEES SET Role_ID = ${roleID}, Department_ID = ${deptID} 
                                    WHERE First_Name = "${employeeFirstName}" AND Last_Name = "${employeeLastName}"`,
                                    (err, res) => {
                                        //Reject if error, resolve is no error
                                        err ? reject(err) : console.log("ADDED!"); resolve();
                                    });
                                });
                            });
                        });
                    })
                    //Catch any errors
                .catch((err) => {
                reject(err);
            });
        });
    };

    //Delete a department from the Departments table
    deleteDepartment() {
        return new Promise((resolve, reject) => {
            //Empty array to hold a list of all current departments
            const departmentList = [];
    
            //Prompts to get which department is going to be deleted
            const deleteQuestion = {
                type: 'list',
                message: 'Which department would you like to delete?',
                name: 'departmentName',
                choices: departmentList
            };
    
            //Gets all departments in the Departments table and pushed the results into the array
            db.query(`SELECT * FROM DEPARTMENTS`, (err, res) => {
                for (let i = 0; i < res.length; i++) 
                {
                    let department = res[i].Department;
                    departmentList.push(department);
                }
    
                //Gets user input
                inquirer.prompt(deleteQuestion)
                .then((answers) => {
                    const departmentName = answers.departmentName;

                    //Removes the chosen department from the Departments table
                    db.query(`DELETE FROM DEPARTMENTS WHERE Department = '${departmentName}'`, (err, result) => {
                        //Reject if error, resolve is no error
                        err ? reject(err) : console.log("DELETED!"); resolve();
                    });
                });     
            });
        });
    };                   
    
    //Deletes role from ROles table
    deleteRole() {
        return new Promise((resolve, reject) => {
            //Empty array to hold a list of all current roles
            const roleList = [];
    
            //Prompt to get the name of the role that will be deleted
            const deleteQuestion = {
                type: 'list',
                message: 'Which role would you like to delete?',
                name: 'roleName',
                choices: roleList
            };
    
            // Gets a list of all current roles and passes the data to the array
            db.query(`SELECT * FROM ROLES`, (err, res) => {
                for (let i = 0; i < res.length; i++) 
                {
                    let role = res[i].Job_Title;
                    roleList.push(role);
                }
    
                //Gets user input
                inquirer.prompt(deleteQuestion)
                .then((answers) => {
                    const roleName = answers.roleName;

                    //Delete selected role from Roles table
                    db.query(`DELETE FROM ROLES WHERE Job_Title = '${roleName}'`, (err, result) => {
                        //Reject if error, resolve is no error
                        err ? reject(err) : console.log("DELETED!"); resolve();
                    });
                });     
            });
        });
    };      
    
    //Deletes an employee from the Employees table
    deleteEmployee() {
        return new Promise((resolve, reject) => {
            //Empty array to store a list of all current employees
            const employeeList = [];
    
            //Prompt to get the name of the employee that will be deleted
            const deleteQuestion = {
                type: 'list',
                message: 'Which employee would you like to delete?',
                name: 'employeeName',
                choices: employeeList
            };
    
            //Gets the first and last name from every employee, converts it to a full name, and pushes to array
            db.query(`SELECT First_Name, Last_Name FROM EMPLOYEES`, (err, res) => {
                for (let i = 0; i < res.length; i++) 
                {
                    //Converts into full name
                    let employee = `${res[i].First_Name} ${res[i].Last_Name}`;
                    employeeList.push(employee);
                }
    
                //Gets user input
                inquirer.prompt(deleteQuestion)
                .then((answers) => {
                    //Converts full name back into two variables to query
                    const employeeName = answers.employeeName.split(' ');
                    const employeeFirstName = employeeName[0];
                    const employeeLastName = employeeName[1];

                    //Deletes the employee from the Employees table that matches the selected name
                    db.query(`DELETE FROM EMPLOYEES
                    WHERE First_Name = "${employeeFirstName}" AND Last_Name = "${employeeLastName}"`, 
                    (err, result) => {
                        //Reject if error, resolve is no error
                        err ? reject(err) : console.log("DELETED!"); resolve();
                    });
                });     
            });
        });
    };      
    
    //Gets the sum of all salaries in a specified department
    getBudget() {
        return new Promise((resolve, reject) => {
            //Total sum of salaries
            let total = 0;
            //List to hold all departments
            //"All departments" Will retrieve the sum from all employees across all departments
            const departmentList = ["All departments"];

            //Prompts to get the name of the department
            const budgetQuestion = {
                type: 'list',
                message: 'Which department budget would you like to view?',
                name: 'departmentName',
                choices: departmentList
            }

            //Gets a list of all department names and pushes data to the array
            db.query(`SELECT Department FROM DEPARTMENTS`, (err, res) => {
                for (let i = 0; i < res.length; i ++)
                {
                    let department = res[i].Department;
                    departmentList.push(department);
                }

                //Gets user input
                inquirer.prompt(budgetQuestion)
                .then((res) => {
                    const departmentName = res.departmentName;

                    //If viewing all departments
                    if (departmentName == "All departments") {
                        db.query(`SELECT SUM(r.Salary) AS Total
                        FROM Roles r
                        JOIN Employees e ON r.ID = e.Role_ID`, (err, res) => {
                            console.log(`Total budget: $${res[0].Total}`);
                            resolve();
                        })
                    }

                    //If looking at a specific department
                    else {
                        //Gets the salary from every employee and adds them up
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

    //Exits out of program and end connection to the database
    quit() {
        console.log("Goodbye!");
        db.end();
    };
}

module.exports = Query;