const inquirer = require('inquirer');
const db = require('mysql2');
const openingQuestion = require('./index');

class Query {
    constructor(selection)
    {
        this.selection = selection;
    }

    view() {
        console.log(`Viewing ${this.selection}`);
    }

    add() {
        console.log(`Adding to ${this.selection}`);
    }

    update() {
        console.log(`Updating employee role`);
    }
}

const viewDepartments = () => {
    console.log("VD");
}

const viewRoles = () => {
    console.log("VR");
}

const viewEmployees = () => {
    console.log("VE");
}

const addDepartment = () => {
    console.log("AD");
}

const addRole = () => {
    console.log("AR");
}

const addEmployee = () => {
    console.log("AE");
}

const updateRole = () => {
    console.log("UR");
}

module.exports = {
    viewDepartments, viewRoles, viewEmployees,
    addDepartment, addRole, addEmployee, updateRole, Query
};
