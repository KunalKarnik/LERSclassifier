const inquirer = require('inquirer');
const Parser = require('./parser');
const AllRules = require('./models/allRules');
const fs = require('fs');

class Inquirer {
  inquire() {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'inputRuleFile',
        message: 'Please enter the name of the input rule file',
        validate(inputRuleFile) {
          let rawRuleFile = fs.readFileSync(inputRuleFile, 'utf8');
          let InputRuleClean = Parser
            .pruneData(rawRuleFile);

          let ruleset = new AllRules(InputRuleClean.slice());

          if (!ruleset.hasProperFormat) {
            return 'Your Rule File is not in the proper format. Please enter a file with the correct format.';
          }

          return true;
        }
      },
      {
        type: 'input',
        name: 'inputDataFile',
        message: 'Please enter the name of the input data file'
      },
      {
        type: 'checkbox',
        message: 'Please choose your settings to run LERS',
        name: 'conflictResolution',
        choices: [
          new inquirer.Separator('Do you wish to use a matching factor ?'),
          {
            name: 'Yes',
            checked: true
          },
          {
            name: 'No'
          },
          new inquirer.Separator('Do you wish to use Strength or Conditional Probablity ?'),
          {
            name: 'Strength',
            checked: true
          },
          {
            name: 'Conditional Probablity'
          },
          new inquirer.Separator('Do you wish to use the return factor of Specificity ?'),
          {
            name: 'Yes'
          },
          {
            name: 'No',
            checked: true
          },
          new inquirer.Separator('Do you wish to use support from other rules in the same concept ?'),
          {
            name: 'Yes'
          },
          {
            name: 'No',
            checked: true
          },
        ],
        validate: function(answer) {
          if (answer.length != 4) {
            return 'Please make a single selection under each choice!';
          }
          if(answer[0] != 'Yes' && answer[0] != 'No') {
            return 'Please make a single selection under each choice!';
          }
          if(answer[1] != 'Strength' && answer[1] != 'Conditional Probablity') {
            return 'Please make a single selection under each choice!';
          }
          if(answer[2] != 'Yes' && answer[2] != 'No') {
            return 'Please make a single selection under each choice!';
          }
          if(answer[3] != 'Yes' && answer[3] != 'No') {
            return 'Please make a single selection under each choice!5';
          }
          return true;
        }
      },
      {
        type: 'checkbox',
        message: 'What all do you wish to view ?',
        name: 'view',
        choices: [
          new inquirer.Separator('Do you wish to see the Concept Statistics ?'),
          {
            name: 'No',
            checked: true
          },
          {
            name: 'Yes'
          },
          new inquirer.Separator('Do you wish to see the information on how cases associated with concepts were classified ?'),
          {
            name: 'No',
            checked: true
          },
          {
            name: 'Yes'
          },
        ],
        validate: function(answer) {
          if (answer.length != 2) {
            return 'Please make a single selection under each choice!';
          }
          if(answer[0] != 'Yes' && answer[0] != 'No') {
            return 'Please make a single selection under each choice!';
          }
          if(answer[1] != 'Yes' && answer[1] != 'No') {
            return 'Please make a single selection under each choice!';
          }
          return true;
        }
      }
    ])
  }
}

module.exports = new Inquirer();