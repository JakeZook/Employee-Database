const inquirer = require('inquirer');
const queries = require("./queries");

const openingQuestion = [
    {
    type: 'list',
    message: 'What would you like to do?',
    name: 'openingChoice',
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", 
    "Add a role", "Add an employee", "Update an employee role"]
    }
]

const closingQuestion = [
    {
        type: 'confirm',
        message: 'Go back to menu?',
        name: "close"
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
            case "View all departments":
            {
                const query = new queries.Query("Departments");
                query.view(askClosingQuestion);
                break;
            }

            case "View all roles": 
            {
                const query = new queries.Query("Roles");
                query.view(askClosingQuestion);
                break;
            }

            case "View all employees": 
            {
                const query = new queries.Query("Employees");
                query.view(askClosingQuestion);
                break;
            }

            case "Add a department": 
            {
                const query = new queries.Query("Departments");
                query.add();
                break;
            }

            case "Add a role": 
            {
                const query = new queries.Query("Roles");
                query.add();
                break;
            }

            case "Add an employee": 
            {
                const query = new queries.Query("Employees");
                query.add();
                break;
            }

            case "Update an employee role":
            {
                const query = new queries.Query("Employees");
                query.update();
                break;
            }    
    }})
    .catch(function (err) {
    if (err) throw err;
})}

const askClosingQuestion = () => {
    inquirer.prompt(closingQuestion).then((res) => {
        res.close === true ? init() : process.exit();
    })
}

init();