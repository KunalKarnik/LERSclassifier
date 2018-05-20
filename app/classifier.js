/* LERS classifier.
* Kunal A. Karnik
* 2768455
*/

require('./set-theory');
const Dataset = require('./models/dataset');
const AllRules = require('./models/allRules');
const ENUMS = require('./enums');
const Variable = require('./models/variable');

class Classifier {

  constructor(inputRuleFile = [], inputDataFile = [], conflictResolution = [], view = []) {
    this.ruleset = new AllRules(inputRuleFile);
    this.dataset = new Dataset(inputDataFile);
    this.conflictResolution = conflictResolution;
    this.view = view;
    this.matchedCases = {};
  }

  printResults() {

    console.log("The total number of cases: ", this.dataset.cases.length);
    console.log("The total number of attributes: ", this.dataset.cases[0].attributes.length);
    console.log("The total number of rules: ", this.ruleset.rules.length);
    let NumberOfConditions = this.ruleset.rules.reduce((conditions, rule) => {
      conditions += rule.conditions.length;
      return conditions;
    }, 0);
    console.log("The total number of conditions: ", NumberOfConditions);

    let PartialClassifiedCorrect = 0;
    let PartialClassifiedInCorrect = 0;
    let CompleteClassifiedCorrect = 0;
    let CompleteClassifiedInCorrect = 0;
    let Unclassified = 0;

    //GENERAL STASTISTICS

    this.dataset.concepts.forEach((concept) => {
      concept.cases.forEach((conceptCase) => {
        let finalDecision = '';
        let isComplete = false;
        let curScore = 0;
        this.dataset.concepts.forEach((decision) => {
          let temp = this.matchedCases[conceptCase.index][decision.decision.value];
          if(temp){
            if(!isComplete) {
              if(temp.isComplete)  {
                curScore = temp.score;
                finalDecision = decision.decision.value;
                isComplete = true;
              } else if(temp.score > curScore) {
                curScore = temp.score;
                finalDecision = decision.decision.value;
              } else if(temp.score === curScore) {
                finalDecision = '';
              }
            } else {
              if(temp.isComplete) {
                if(temp.score > curScore) {
                  curScore = temp.score;
                  finalDecision = decision.decision.value;
                } else if(temp.score === curScore) {
                  finalDecision = '';
                }
              }
            }
          }
        });

        if(finalDecision === '') {
          Unclassified++;
        } else {
          if(isComplete) {
            if(conceptCase.decision.value === finalDecision) {
              CompleteClassifiedCorrect++;
            } else {
              CompleteClassifiedInCorrect++;
            }
          } else {
            if(conceptCase.decision.value === finalDecision) {
              PartialClassifiedCorrect++;
            } else {
              PartialClassifiedInCorrect++;
            }
          }
        }
      });
    });
    console.log('The total number of cases that are not classified: ', Unclassified);
    console.log();
    console.log('PARTIAL MATCHING:');
    console.log('The total number of cases that are incorrectly classified: ', PartialClassifiedInCorrect);
    console.log('The total number of cases that are correctly classified: ', PartialClassifiedCorrect);
    console.log();
    console.log('COMPLETE MATCHING:');
    console.log('The total number of cases that are incorrectly classified: ', CompleteClassifiedInCorrect);
    console.log('The total number of cases that are correctly classified: ', CompleteClassifiedCorrect);
    console.log();
    console.log('PARTIAL AND COMPLETE MATCHING:');
    console.log('The total number of cases that are not classified or incorrectly classified: ', Unclassified+PartialClassifiedInCorrect+CompleteClassifiedInCorrect);
    console.log(' Error rate: ', ((Unclassified+PartialClassifiedInCorrect+CompleteClassifiedInCorrect)/this.dataset.cases.length).toFixed(2));
    console.log();
    console.log();

    if(this.view[0] === 'Yes' || this.view[1] === 'Yes') {
      // CONCEPT STASTISTICS
      if(this.view[0] === 'Yes') {
        console.log('Concept Statistics :');
        console.log('--------------------');
      }
      if(this.view[1] === 'Yes') {
        console.log('How cases associated with concepts were classified :');
        console.log('----------------------------------------------------');
      }
      console.log();
      console.log();

      this.dataset.concepts.forEach((concept) => {
        let PartialClassifiedCorrect = 0;
        let PartialClassifiedInCorrect = 0;
        let CompleteClassifiedCorrect = 0;
        let CompleteClassifiedInCorrect = 0;
        let Unclassified = 0;
        let lPartialClassifiedCorrect = [];
        let lPartialClassifiedInCorrect = [];
        let lCompleteClassifiedCorrect = [];
        let lCompleteClassifiedInCorrect = [];
        let lUnclassified = [];
        
        concept.cases.forEach((conceptCase) => {
          let finalDecision = '';
          let isComplete = false;
          let curScore = 0;
          this.dataset.concepts.forEach((decision) => {
            let temp = this.matchedCases[conceptCase.index][decision.decision.value];
            if(temp){
              if(!isComplete) {
                if(temp.isComplete)  {
                  curScore = temp.score;
                  finalDecision = decision.decision.value;
                  isComplete = true;
                } else if(temp.score > curScore) {
                  curScore = temp.score;
                  finalDecision = decision.decision.value;
                } else if(temp.score === curScore) {
                  finalDecision = '';
                }
              } else {
                if(temp.isComplete) {
                  if(temp.score > curScore) {
                    curScore = temp.score;
                    finalDecision = decision.decision.value;
                  } else if(temp.score === curScore) {
                    finalDecision = '';
                  }
                }
              }
            }
          });

          if(finalDecision === '') {
            Unclassified++;
            lUnclassified.push(conceptCase.index);
          } else {
            if(isComplete) {
              if(conceptCase.decision.value === finalDecision) {
                CompleteClassifiedCorrect++;
                lCompleteClassifiedCorrect.push(conceptCase.index);
              } else {
                CompleteClassifiedInCorrect++;
                lCompleteClassifiedInCorrect.push(conceptCase.index);
              }
            } else {
              if(conceptCase.decision.value === finalDecision) {
                PartialClassifiedCorrect++;
                lPartialClassifiedCorrect.push(conceptCase.index);
              } else {
                PartialClassifiedInCorrect++;
                lPartialClassifiedInCorrect.push(conceptCase.index);
              }
            }
          }
        });
        console.log('Concept (',concept.decision.name, ',',concept.decision.value,'):');
        console.log('The total number of cases that are not classified: ', Unclassified);
        console.log('List of cases that are not classified:', lUnclassified.toString());
        console.log();
        console.log('PARTIAL MATCHING:');
        console.log('The total number of cases that are incorrectly classified: ', PartialClassifiedInCorrect);
        console.log('List of cases that are incorrectly classified: ', lPartialClassifiedInCorrect.toString());
        console.log('The total number of cases that are correctly classified: ', PartialClassifiedCorrect);
        console.log('List of cases that are correctly classified: ', lPartialClassifiedCorrect.toString());
        console.log();
        console.log('COMPLETE MATCHING:');
        console.log('The total number of cases that are incorrectly classified: ', CompleteClassifiedInCorrect);
        console.log('List of cases that are incorrectly classified: ', lCompleteClassifiedInCorrect.toString());
        console.log('The total number of cases that are correctly classified: ', CompleteClassifiedCorrect);
        console.log('List of cases that are correctly classified: ', lCompleteClassifiedCorrect.toString());
        console.log();
        console.log('The total number of cases in the concept: ', concept.cases.length);
        console.log();
        console.log();
      });
    
    }
  }

  classify() {

    let available = this.ruleset.rules.some(rule => {
        return rule.matchingCases === 0;
      });

      if(available) {
        console.log();
        console.log('Conditional probablity cannot be used since there is a rule with 0 matched conditions.');
        console.log();
      }
    
    this.dataset.concepts.forEach((concept) => {
      concept.cases.forEach((conceptCase) => {
        this.ruleset.rules.forEach(rule => {

          let matchingScore = 0;
          let strength = rule.strength;
          let specificity = rule.specificity;
          let matchingCases = rule.matchingCases;
          let matchingFactor = 1;

          if (!this.matchedCases[conceptCase.index])  { // Technically initialization
            this.matchedCases[conceptCase.index] = {};
          }

          if (!this.matchedCases[conceptCase.index][rule.action.value])  { // Technically initialization
            this.matchedCases[conceptCase.index][rule.action.value] = {isComplete:false, score: matchingScore};
          }

          if (!available && this.conflictResolution[1] === 'Conditional Probablity')  {
            strength = strength/matchingCases ;
          }

          if (this.conflictResolution[2] === 'Yes')  {
            specificity = 1.0;
          }

          let matchedConditions = 0;

          //Stuff for Symbolic/Numeric
          let caseAttributes = conceptCase.attributes;
          let ruleConditions = rule.conditions;

          let matchedConditionsMap = ruleConditions.reduce((caseRuleMap, condition) => {
            caseRuleMap[condition.name] = condition;

            return caseRuleMap;
          }, {});

          caseAttributes.forEach((attribute) => {
            let matchedCondition = matchedConditionsMap[attribute.name];

            if (
              matchedCondition &&
              matchedCondition.isSymbolic &&
              matchedCondition.belongsToInterval(attribute.value)
            ) {
              matchedConditions++;
            } else if (matchedCondition && !matchedCondition.isSymbolic) {
              if (attribute.isMissing || attribute.isAttributeConcept) {
                matchedConditions++;
              } else if (attribute.value === matchedCondition.value) {
                matchedConditions++;
              }
            }
          });

          if (matchedConditions === rule.attributeValuePairs.size && !(conceptCase.hasLostValue)){
            //Complete Matching
            matchingScore = (strength * specificity * matchingFactor);
            this.matchedCases[conceptCase.index][rule.action.value].isComplete = true;

            if (this.conflictResolution[3]==='Yes')  {
              this.matchedCases[conceptCase.index][rule.action.value].score = matchingScore + this.matchedCases[conceptCase.index][rule.action.value].score;
            } else {
              if (this.matchedCases[conceptCase.index][rule.action.value].score < matchingScore)  {
                this.matchedCases[conceptCase.index][rule.action.value].score = matchingScore;
              }
            }
          } else if (matchedConditions > 0) {
            //Partial matching
            let caseClassifications = this.matchedCases[conceptCase.index];
            let hasCaseBeenCompletelyClassified = false;

            hasCaseBeenCompletelyClassified =Object.keys(caseClassifications).some(actionValue => {
              return this.matchedCases[conceptCase.index][actionValue].isComplete === true;
            });

            if (!hasCaseBeenCompletelyClassified) { //Check if this case has already been classified using complete matching
              if (this.conflictResolution[0] != 'Yes')  {
                matchingFactor = matchedConditions/rule.attributeValuePairs.size;
              }

              matchingScore = (strength * specificity * matchingFactor);

              if (this.conflictResolution[3]==='Yes')  {
                this.matchedCases[conceptCase.index][rule.action.value].score = matchingScore + this.matchedCases[conceptCase.index][rule.action.value].score;
              } else {
                if (this.matchedCases[conceptCase.index][rule.action.value].score < matchingScore)  {
                  this.matchedCases[conceptCase.index][rule.action.value].score = matchingScore;
                }
              }
            }
          }
        });
      });
    });
  }
}

module.exports = Classifier;