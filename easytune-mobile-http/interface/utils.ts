function isObject(value): boolean {
  return value !== null && typeof value === 'object';
}

function isUndefined(value) {
  return typeof value === 'undefined';
}

function isEmpty(value) {
  return typeof value === 'undefined' || value === null;
}
