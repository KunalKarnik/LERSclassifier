function pruneData(data = '') {
  return data
    .replace(/(\n){2,}/g, '\n')
    .split(/\n/)
    .filter(item => {
      let prunedItem = item.trim();

      return prunedItem.length > 0 && prunedItem.indexOf('!') === -1;
    });
}

function hasValidRuleFactors(inputString = '') {
  return inputString
    .trim()
    .split(/,\s+/)
    .length === 3;
}

function extractRuleFactors(inputString = '') {
  let ruleFactors = inputString
    .trim()
    .split(/\s*,\s*/);

  return {
    strength: +ruleFactors[0],
    specificity: +ruleFactors[1],
    matchingCases: +ruleFactors[2]
  };
}

function extractVariables(inputString = '') {
  return inputString
    .replace(/(\s|\t){2,}/g, ' ')
    .replace(/((\[)(\t|\s)*)|((\t|\s)*(\]))/g, '')
    .trim()
    .split(' ');
}

function extractVariable(inputString = '') {
  return inputString
    .replace(/(\s|\t)+/g, '')
    .replace(/\(|\)|\s|\t/g, '')
    .split(',');
}

function extractDataMatrix(data = []) {
  return data.reduce((dataMatrix, dataMatrixRow) => {
    let prunedDataMatrixRow = dataMatrixRow
      .replace(/(\s|\t){2,}/g, ' ')
      .trim()
      .split(' ');

    dataMatrix.push(prunedDataMatrixRow);

    return dataMatrix;
  }, []);
}

function hasValidRuleConditions(inputString = '') {
  return inputString
    .trim()
    .split(/(\(.+?,.+?\))+/g)
    .length >= 2;
}

function extractRule(inputString = '') {
  let regex = /(\(.+?,.+?\))+/g;

  return inputString
    .match(regex)
    .reduce((ruleCondition, item) => {
      let variable = item
        .replace(/\(|\)|\s|\t/g, '')
        .split(',');

      ruleCondition.push({
        name: variable[0],
        value: variable[1]
      });

      return ruleCondition;
    }, []);
}

function isVariableDefinition(inputString = '') {
  return inputString.match(/(<.*?>)+/g) !== null;
}

module.exports = {
  extractDataMatrix,
  extractRule,
  extractRuleFactors,
  extractVariable,
  extractVariables,
  hasValidRuleFactors,
  hasValidRuleConditions,
  isVariableDefinition,
  pruneData
}