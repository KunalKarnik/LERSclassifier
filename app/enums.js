// Variable
const NUMERIC = 'numeric';
const SYMBOLIC = 'symbolic';
const ATTRIBUTE = 'attribute';
const DECISION = 'decision';

// Condition
FORMAT_L1 = {
  attributeSeparator: '&',
  decisionSeparator: '->'
};

FORMAT_L2 = {
  attributeSeparator: '&',
  decisionSeparator: '-->'
};

FORMAT_G1 = {
  attributeSeparator: '^',
  decisionSeparator: '->'
};

FORMAT_G2 = {
  attributeSeparator: '^',
  decisionSeparator: '-->'
};

module.exports = {
  ATTRIBUTE,
  DECISION,
  NUMERIC,
  SYMBOLIC,
  FORMAT_L1,
  FORMAT_L2,
  FORMAT_G1,
  FORMAT_G2
}