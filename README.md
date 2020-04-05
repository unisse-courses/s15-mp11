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

## Pre-Setup
1. Clone **your copy** of the repository `https://github.com/unisse-courses/s15-mp11.git`

## Running Locally
1. Navigate to the directory: `cd s15-mp11`
2. Install the dependencies:
	- `npm install`
	- `npm install express --save`
	- `npm install express-handlebars --save`
	- `npm install @handlebars/allow-prototype-access --save`
3. Setup npm: `npm init`
4. Run the server: `npm run dev`
    - This is using [`nodemon`](https://github.com/remy/nodemon#nodemon) to be able to watch for any changes in the application and restart the server automatically
    - The command `npm run <script>` looks at [`package.json`](package.json) for the name of the command to be run under the `"scripts"` config.

5. Navigate to [http://localhost:3000/](http://localhost:3000/) where you will be redirected to the home page showing all current posts

## User Accounts
Users are given the option to register their own accounts. Listed below are existing user accounts and their credentials:
1. Username: `martin`
2. Username: `adrian`
3. Username: `kyla`
4. Username: `password`
* Each account has the same password of `password`

## Functionalities to follow (for Phase 3)
* Deployment using heroku
* Enhanced input validation and error messages
* Search function
* Implement post viewing based on category
* Display post sorted based on:
	- number of views
	- number of comments
	- score of the post (vote score of the first comment)
* Store image in DB
* Update user picture
* Read user information for individual post comments
* Update comment vote score
* Update post picture
* Delete post 
* Delete comment


## Team Members:

*Nerie, Sean Paulo
*Cu, Martin