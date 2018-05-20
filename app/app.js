const Inquirer = require('./inquirer');
const Classifier = require('./classifier');
const Parser = require('./parser');
const chalk = require('chalk');
const fs = require('fs');

/* function debugApp() {
  let rawDataFile = fs.readFileSync('test.d.txt', 'utf8');
  let rawRuleFile = fs.readFileSync('car.p.txt', 'utf8');
  let conflictResolution = ['Yes', 'Conditional Probablity', '', ''];
  let view = ['Yes', 'Yes'];
  
  let cleanRulesInput = Parser
    .pruneData(rawRuleFile);

  let cleanDataInput = Parser
    .pruneData(rawDataFile);

  if (Parser.isVariableDefinition(cleanDataInput[0])) {
    cleanDataInput.shift();
  }

  let classifier = new Classifier(cleanRulesInput, cleanDataInput, conflictResolution, view);

  classifier.classify();

  classifier.printResults();

}; */

// uncomment this to run debugger
//debugApp();


 Inquirer
  .inquire()
  .then(({ inputRuleFile, inputDataFile, conflictResolution, view }) => {
    let rawDataFile = fs.readFileSync(inputDataFile, 'utf8');
    let rawRuleFile = fs.readFileSync(inputRuleFile, 'utf8');
    let cleanRulesInput = Parser
      .pruneData(rawRuleFile);

    let cleanDataInput = Parser
      .pruneData(rawDataFile);

    if (Parser.isVariableDefinition(cleanDataInput[0])) {
      cleanDataInput.shift();
    }
    let classifier = new Classifier(cleanRulesInput, cleanDataInput, conflictResolution, view);

    classifier.classify();

    console.log('This report was created from: ', inputRuleFile ,' and from: ', inputDataFile );
    classifier.printResults();


  })
  .catch((err) => {
    console.log('Voici l\'erreur : ', err);
  }); 