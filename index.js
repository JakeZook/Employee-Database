const inquirer = require('inquirer');
const queries = require("./queries");

const openingQuestion = [
    {
    type: 'list',
    message: 'What would you like to do?',
    name: 'openingChoice',
    choices: ["View all departments", "view all roles", "View all employees", "Add a department", 
    "Add a role", "Add an employee", "Update an employee role"]
    }
]

const init = () => {
    console.log
    (`-----------------------------------------------------
--                                                 --
--                 Welcome to the                  --
--           Employee Management System            --
--                                                 --
-----------------------------------------------------`);

    askOpeningQuestion();
}

const askOpeningQuestion = () => {
    inquirer.prompt(openingQuestion).then((res) => {
        switch (res.openingChoice)
        {
            case "View all departments": queries.viewDepartments();
            break;

            case "View all roles": queries.viewRoles();
            break;

            case "View all employees": queries.viewEmployees();
            break;

            case "Add a department": queries.addDepartment();
            break;

            case "Add a role": queries.addRole();
            break;

            case "Add an employee": queries.addEmployee();
            break;

            case "Update employee role": queries.updateRole();
            break;
        }
    }
)
}

init();

module.exports = askOpeningQuestion;