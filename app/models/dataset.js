const Parser = require('../parser');
const ENUMS = require('../enums');
const Variable = require('./variable');

class Dataset {
  
  constructor(data = []) {
    let variableNames = Parser.extractVariables(data.shift());
    let dataMatrix = Parser.extractDataMatrix(data);
    let conceptCache = [];
    this.concepts = [];
    this.cases = [];
    dataMatrix.forEach((dataRow, index) => {
      let newCase = new Case(index + 1, variableNames, dataRow);
      let decisionValue = newCase.decision.value;
      this.cases.push(newCase);
      if (conceptCache.indexOf(decisionValue) === -1) {
        conceptCache.push(decisionValue);
        this.concepts[conceptCache.indexOf(decisionValue)] = new Concept(newCase.decision);
      }
      this.concepts[conceptCache.indexOf(decisionValue)].addCase(newCase);
    });
    this.attributeValuePairs = this.attributeVAluePairsfromData;
  }

  get attributeVAluePairsfromData() {
    let AVpairs = new Set();
    this.cases.forEach(dataCase =>  {
      AVpairs = AVpairs.union(dataCase.attributeValuePairs);
    });
    return AVpairs;
  }
}


class Concept {

  constructor(decision = new Variable(), cases = []) {
    this.decision = decision;
    this.cases = cases;
  }

  addCase(caseForConcept) {
    this.cases.push(caseForConcept);
  }

  get length() {
    return this.cases.length;
  }
}

class Case {

  constructor(index, variableNames = [], variableValues = []) {
    let variableNamesCopy = variableNames.slice();
    let variableValuesCopy = variableValues.slice();
    this.index = index;
    this.attributes = []
    this.decision = new Variable(variableNamesCopy.pop(), variableValuesCopy.pop());
    for (let i = 0; i < variableNamesCopy.length; i++) {
      this.attributes.push(new Variable(variableNamesCopy[i], variableValuesCopy[i]));
    }
  }

  get attributeNames() {
    return this.attributes.reduce((attributeNames, attribute) => {
      attributeNames.add(attribute.name);

      return attributeNames;
    }, new Set())
  }

  get attributeValues() {
    return this.attributes.reduce((attributeValues, attribute) => {
      attributeValues.add(attribute.value);

      return attributeValues;
    }, new Set())
  }

  get attributeValuePairs() {
    return this.attributes.reduce((attributeValuePairs, attribute) => {
      attributeValuePairs.add(attribute.toString());

      return attributeValuePairs;
    }, new Set());
  }

  get hasLostValue() {
    return this.attributes.some(attribute => attribute.isLost);
  }

  get hasSymbolicValues() {
    return this.attributes.some(attribute => attribute.isSymbolic);
  }

  toString(format = ENUMS.FORMAT_L1) {
    let output = '';
    this.attributeValuePairs.forEach(attributeValuePair => {
      output += output === '' ? attributeValuePair : ` ${format.attributeSeparator} ${attributeValuePair}`;
    });
    output += ` ${format.decisionSeparator} ${this.decision.toString()}`;
    return output;
  }
}



module.exports = Case;

module.exports = Concept;

module.exports = Dataset;