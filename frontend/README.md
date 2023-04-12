# Coupon System Part 3

> This is my final project at John Bryce fullstack Java course, the project is a comprehensive e-commerce Coupon-System.
> Live demo [_here_](https://www.todo.com).

## Table of Contents

- [Project summary](#summary)
- [Technologies used](#technologies-used)
- [Features](#features)
- [Screenshots](#screenshots)
- [Setup](#setup)
- [Installation](#installation)
- [Credentials](#credentials)
- [Room for improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)

## Project Summary

This e-commerce Coupon System project features three client types: Admin, Company, and Customer. Each type has a unique menu, dashboard view, and methods specific to their role. Users can log in as an administrator, company, or customer to access their respective features.
The admin can perform CRUD operations on coupons, customers, and companies.
The company can manage their own coupons by adding, updating, and deleting them.
These coupons are then listed for customers to view and purchase.
The customer can view and purchase coupons from all companies, as well as manage their own coupons.
Each coupon has a title, description, start and expiration dates, price, amount, and image.
The project features a smart list that allows users to view, search, edit, add, and delete entities in a single control panel.

## Technologies Used

- Java
- Maven
- JWT for authentication
- MySql as the database
- Node.js
- React
- Redux
- MUI Library

## Features

- Admin Dashboard
- Company Dashboard
- Customer control panel.
- Fully responsive.
- CRUD
- Every 12h Job to delete expired coupons.
- Single page control: using modal/in line action.
- Coupons carousals + flipped coupon. (2 sides)
- Purchase Coupons.
- Search and sort list using 'MaterialReactTable'.

## Screenshots

## Setup

To run the project, you need to have the following installed on your system:

- Node.js
- NPM (Node Package Manager)
- Java 8 or higher
- MySQL
- Maven (Optional)

## Installation

1. Clone the repository:

2. Install the dependencies:

- `cd front-end`
- `npm install`

3. Start the front-end:

- `npm start`

4. Start the back-end [Run with Maven or from supported IDEA (Eclipse, IntelliJ etc..)]

- `mvn spring-boot:run`

## Credentials

Login Credentials for Admin:

' Email: admin@admin.com
Password: admin '

Company:
' Email: company@company.com
Password: company '

Customer:
' Email: Customer@customer.com
Password: customer '

## Room for Improvement

Room for improvement:

- Smooth carousel and card flip.
- Data security / encryption.
- User popover card.

To do:

- Add more Customer features.
- Upload & store images.
- Add more colors to the project.

## Acknowledgements

- This project is based on John Bryce project instructions.
