const inquirer = require('inquirer');
const db = require('mysql2');
const openingQuestion = require('./index');

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
    addDepartment, addRole, addEmployee, updateRole
};
