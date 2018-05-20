
Set.prototype.union = function(setB = new Set()) {
  let union = new Set(this);
  for (let elem of setB) {
    union.add(elem);
  }
  return union;
}

Set.prototype.toString = function() {
  return `{${[...this]}}`;
}
