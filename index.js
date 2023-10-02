//TODO - Add update role, Delete functions

const inquirer = require('inquirer');
const Query = require('./queries');

const init = () => {
    console.log(`-----------------------------------------------------
    --                                                 --
    --                 Welcome to the                  --
    --           Employee Management System            --
    --                                                 --
    -----------------------------------------------------`);
    

    inquirer.prompt(menuOptions)
    .then((response) => {
        handleResponse(response.options);
    })
    .catch((err) => {
        if (err) throw err;
    })
}

const menuOptions = [
    {
    type: 'list',
    message: 'What would you like to do?',
    name: 'options',
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", 
    "Add a role", "Add an employee", "Update an employee role", "Exit"]
    }
]

const continueOptions = [
    {
        type: 'confirm',
        message: 'Go back to menu?',
        name: 'close'
    }
]

async function handleResponse(res) {
    const query = new Query();
    
    switch (res)
    {
        case "View all departments":
        {
            try {
                await query.viewDepartments(); // Wait for viewDepartments to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }
        
        case "View all roles": 
        {
            try {
                await query.viewRoles(); // Wait for viewRoles to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }

        case "View all employees": 
        {
            try {
                await query.viewEmployees(); // Wait for viewEmployees to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }

        case "Add a department": 
        {
            try {
                await query.addDepartment(); // Wait for addDepartment to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }

        case "Add a role": 
        {
            try {
                await query.addRole(); // Wait for addRole to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }

        case "Add an employee": 
        {
            try {
                await query.addEmployee(); // Wait for addEmployee to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }

        case "Update an employee role":
        {
            break;
        }

        case "Exit":
        {
            query.quit();
            break;
        }
    }
}

async function openMenu() {
    try {
        const quit = new Query();
        const response = await inquirer.prompt(continueOptions);
        response.close ? init() : quit.quit();
    } catch (err) {
        console.error(err);
    }
}

init();