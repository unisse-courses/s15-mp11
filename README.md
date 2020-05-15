# CCAPDEV Project: Foorum (food forum)

This is a project submission for the course CCAPDEV. The application facilitates a food forum where users can
* Create an account
* Start a topic (post)
* Comment on topics
* Follow other accounts

The implementation of MVC is already used in order to make the application scalable and easier to modify.

## Requirements
* [NodeJS & npm](https://www.npmjs.com/get-npm)
* [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/) (Must be running in the background)
* Any text editor for JavaScript, HTML & CSS (VSCode, Atom, SublimeText, etc.)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [Heroku](https://dashboard.heroku.com/login)

## Link to Deployed Application
(https://ccapdev-foorum.herokuapp.com/)

## Pre-Setup
1. Clone **your copy** of the repository `https://github.com/unisse-courses/s15-mp11.git`

## Running Locally (Different Database)
1. Navigate to the directory: `cd s15-mp11`
2. Install the dependencies:
	- `npm install`
	- `npm install express --save`
	- `npm install express-handlebars --save`
	- `npm install @handlebars/allow-prototype-access --save`
	- `npm install mongoose`
3. Create your own [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
4. Create a .env file and save it in the folder containing the PORT, MONGODB_URL, and SESSION_SECRET values i.e
	- `PORT= 3000`
	- `MONGODB_URL='mongodb+srv://dbUsername:dbPassword@ccapdev-foorum-arjmq.mongodb.net/ClusterName?retryWrites=true&w=majority'`
	- `SESSION_SECRET="somegibberishsecret"`
5. Open cmd and navigate to `cd s15-mp11`
6. Run `heroku local web` or `heroku open`

## User Accounts
Users are given the option to register their own accounts. Listed below are existing user accounts and their credentials:
1. Username: `imartin0023`
2. Username: `sofiaC`
3. Username: `nerieSean`
4. Username: `borjie`
5. Username: `megmentos`

* Each account has the same password of `password`

## Team Members:

*Nerie, Sean Paulo
*Cu, Martin
*Cuevas, Sofia