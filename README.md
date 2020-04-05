# CCAPDEV Project: Foorum (food forum)

This is based off on the [`node-mongoose-sample`](https://github.com/unisse-courses/node-mongoose-sample) repository but using [Materialize](https://materializecss.com/) as the CSS design framework.

## Requirements
* [NodeJS & npm](https://www.npmjs.com/get-npm)
* [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/) (Must be running in the background)
* [Postman](https://www.postman.com/) - To be able to test the endpoints
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
1. Username: `martin`
2. Username: `adrian`
3. Username: `kyla`
4. Username: `password`
* Each account has the same password of `password`

## Team Members:

*Nerie, Sean Paulo
*Cu, Martin