const ENUMS = require('../enums');
const Parser = require('../parser');

class Variable {

  belongsToInterval(inputValue) {
    let isInputValueSymbolic = inputValue.match(/(\d.*\.\..*\d)+?/g) !== null;
    let interval = this.value.split('..');

    if (isInputValueSymbolic) {
      let inputValueInterval = inputValue.split('..');

      return +inputValue[0] >= +interval[0] && +inputValue[1] <= +interval[1];
    }

    return +inputValue >= +interval[0] && +inputValue <= +interval[1];
  }

  constructor(name = '', value = '') {
    this.name = name;
    this.value = value;
  }

  get isLost() {
    return this.value === '?';
  }

  get isDoNotCare() {
    return this.value === '*';
  }

  get isAttributeConcept() {
    return this.value === '-';
  }

  get isMissing() {
    return this.isLost || this.isDoNotCare || this.isAttributeConcept;
  }

  get isNumeric() {
    return isNan(this.value);
  }

  get isSymbolic() {
    return this.value
      .match(/(\d.*\.\..*\d)+?/g) !== null;
  }

  toString() {
    return `(${this.name}, ${this.value})`;
  }

  static fromString(variableString) {
    let variable = Parser.extractVariable(variableString);

    return new Variable(variable[0], variable[1]);
  }

  static toVariable({ name, value }) {
    return new Variable(name, value);
  }
}

module.exports = Variable;