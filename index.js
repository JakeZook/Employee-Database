const inquirer = require('inquirer');
const Query = require('./queries');

//Renders menu text and prompts user for input
const init = () => {
    console.log(`
    -----------------------------------------------------
    --                                                 --
    --                 Welcome to the                  --
    --           Employee Management System            --
    --                                                 --
    -----------------------------------------------------
    
    `);
    

    inquirer.prompt(menuOptions)
    .then((response) => {
        handleResponse(response.options);
    })
    .catch((err) => {
        if (err) throw err;
    })
}

//Options to select in menu
const menuOptions = [
    {
    type: 'list',
    message: 'What would you like to do?',
    name: 'options',
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", 
    "Add a role", "Add an employee", "Update an employee role", "Delete department", "Delete role",
    "Delete employee", "View department budget", "Exit"]
    }
];

//Inquirer prompt to go back to menu
const continueOptions = [
    {
        type: 'confirm',
        message: 'Go back to menu?',
        name: 'menu'
    }
];

//Calls corresponding function relative to user input
async function handleResponse(res) {
    //Creates a new query object
    const query = new Query();
    //Clears console to avoid clutter
    console.clear();
    
    //Finds and calls corresponding function
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
            try {
                await query.updateEmployeeRole(); // Wait for updateEmployeeRole to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }

        case "Delete department":
        {
            try {
                await query.deleteDepartment(); // Wait for deleteDepartment to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }
        
        case "Delete role":
        {
            try {
                await query.deleteRole(); // Wait for deleteRole to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }
        
        case "Delete employee":
        {
            try {
                await query.deleteEmployee(); // Wait for deleteEmployee to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }
        
        case "View department budget":
        {
            try {
                await query.getBudget(); // Wait for getBudget to finish
                openMenu(); // Then call openMenu
            } catch (err) {
                console.error(err);
            }
            break;
        }

        case "Exit": //Exits program
        {
            query.quit();
            break;
        }
    }
}

//Prompts user to go back to menu or exit program
async function openMenu() {
    try {
        //Creates new query object
        const quit = new Query();
        const response = await inquirer.prompt(continueOptions);

        //Clears console to avoid clutter
        console.clear();
        //If true, return to menu. If false, exit
        response.menu ? init() : quit.quit();
    } catch (err) {
        console.error(err);
    }
}

//Initial function call
init();