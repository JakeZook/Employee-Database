DROP DATABASE IF EXISTS jz_employee_db;
CREATE DATABASE jz_employee_db;

use jz_employee_db;

CREATE TABLE `Departments` (
    `ID` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `Department` VARCHAR(30) NOT NULL 
);

CREATE TABLE `Roles` (
    `ID` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `Job_Title` VARCHAR(30) NOT NULL,
    `Salary` INT,
    `Department_ID` INT,
    FOREIGN KEY (Department_ID)
    REFERENCES Departments(ID)
);

CREATE TABLE `Employees` (
    `ID` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `First_Name` VARCHAR(30)  NOT NULL,
    `Last_Name` VARCHAR(30)  NOT NULL,
    `Role_ID` INT NOT NULL,
    `Department_ID` INT NOT NULL,
    `Manager_Name` VARCHAR(30), 
    FOREIGN KEY (Role_ID)
    REFERENCES Roles(ID),
    FOREIGN KEY (Department_ID)
    REFERENCES Departments(ID)
);
