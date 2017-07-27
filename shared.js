const WIT_TOKEN = '' // TODO: add your wit token here

function firstEntity(entities, name) {
  return entities &&
    entities[name] &&
    Array.isArray(entities[name]) &&
    entities[name] &&
    entities[name][0];
}

module.exports = {
  WIT_TOKEN,
  firstEntity,
};
