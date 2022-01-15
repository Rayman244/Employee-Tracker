const inquirer = require('inquirer');

const{ startQ } = require('./brain/questions')
const {getDepartments} = require('./server')
inquirer
  .prompt(startQ)
  .then((answers) => {
    // Use user feedback for... whatever!!
    console.log(answers);
    // switch(answers){
    //     case'View all departments': getDepartments();
    //     break;
    // }
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });