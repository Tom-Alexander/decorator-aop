import {BEFORE, AFTER, INTERCEPT} from './constants';

var joinPointDecorator = function joinPointDecorator(type, targetKey) {
  return function (context, sourceKey) {
    var joins = context.constructor._joins;
    if (!joins) joins = {};
    if (!joins[targetKey]) joins[targetKey] = {};
    if (!joins[targetKey][type]) joins[targetKey][type] = [];
    joins[targetKey][type].push({
      sourceKey,
      targetKey
    });
    context.constructor._joins = joins;
  };
};

export default {
  joinPointDecorator,
  after: (targetKey) => joinPointDecorator(AFTER, targetKey),
  before: (targetKey) => joinPointDecorator(BEFORE, targetKey),
  intercept: (targetKey) => joinPointDecorator(INTERCEPT, targetKey)
};
