const Parser = require('../parser');
const Variable = require('./variable');

class AllRules {

  constructor(data = []) {
    this.hasProperFormat = true;
    this.rules = [];
    for (let i = 0; i < data.length; i += 2) {
      let hasValidRuleFactors = Parser.hasValidRuleFactors(data[i]);
      if (!hasValidRuleFactors) {
        this.hasProperFormat = hasValidRuleFactors;
        break;
      } else if (Parser.hasValidRuleConditions(data[i + 1])) {
        this.rules.push(
          new Rule(
            Parser.extractRule(data[i + 1]),
            Parser.extractRuleFactors(data[i])
          )
        );
      }
    }
  }
}

class Rule {

  constructor(variables, { strength, specificity, matchingCases }) {
    let variablesCopy = variables.slice();
    this.action = Variable.toVariable(variablesCopy.pop());
    this.conditions = variablesCopy.map(condition => Variable.toVariable(condition));
    this.strength = strength;
    this.specificity = specificity;
    this.matchingCases = matchingCases;
  }

  get conditionNames() {
    return this.conditions.reduce((conditionNames, condition) => {
      conditionNames.add(condition.name);
      return conditionNames;
    }, new Set())
  }

  get conditionValues() {
    return this.conditions.reduce((conditionValues, condition) => {
      conditionValues.add(condition.value);
      return conditionValues;
    }, new Set())
  }

  get attributeValuePairs() {
    return this.conditions.reduce((attributeValuePairs, condition) => {
      attributeValuePairs.add(condition.toString());
      return attributeValuePairs;
    }, new Set());
  }

  toString(format = ENUMS.FORMAT_L1) {
    let output = '';
    this.attributeValuePairs.forEach(attributeValuePair => {
      output += output === '' ? attributeValuePair : ` ${format.attributeSeparator} ${attributeValuePair}`;
    });
    output += ` ${format.decisionSeparator} ${this.action.toString()}`;
    return output;
  }
}



module.exports = Rule;

module.exports = AllRules;