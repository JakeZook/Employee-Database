DROP DATABASE IF EXISTS jz_employee_db;
CREATE DATABASE jz_employee_db;

use jz_employee_db;

CREATE TABLE `Departments` (
    `ID` Int AUTO_INCREMENT NOT NULL ,
    `Name` varchar(30)  NOT NULL 
);

CREATE TABLE `Roles` (
    `ID` int AUTO_INCREMENT NOT NULL ,
    `Job_Title` varchar(30)  NOT NULL ,
    `Department` Int  NOT NULL ,
    `Salary` Decimal  NOT NULL 
);

CREATE TABLE `Employees` (
    `ID` Int AUTO_INCREMENT NOT NULL ,
    `First_Name` varchar(30)  NOT NULL ,
    `Last_Name` varchar(30)  NOT NULL ,
    `Job_Title` Int  NOT NULL ,
    `Department` Int  NOT NULL ,
    `Salary` Int  NOT NULL ,
    `Manager` varchar(30)  NOT NULL 
);
