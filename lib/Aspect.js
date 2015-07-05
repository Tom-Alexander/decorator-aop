
import {BEFORE, AFTER, INTERCEPT} from './constants';

export default class Aspect {

  constructor() {
    let target = this.constructor._target;
    let joins = this.getJoins();

    Object.keys(joins).forEach((targetKey) => {

      if (!target.prototype.hasOwnProperty(targetKey)) {
        throw new Error(`function ${targetKey} does not exist on target`);
      }

      let targetFn = target.prototype[targetKey];
      let clone = targetFn.bind(target);
      let source = this;

      let innerProxy = function (...args) {
        source.getBeforeJoins(targetKey).forEach((join) => {
          source[join.sourceKey].apply(source, [target, args]);
        });

        let returned = clone.apply(targetFn, args);

        source.getAfterJoins(targetKey).forEach((join) => {
          source[join.sourceKey].apply(source, [target, args]);
        });

        return returned;
      };

      let outerProxy = function (innerProceed, ...args) {
        if (joins[targetKey][INTERCEPT].length === 1) {
          let join = joins[targetKey][INTERCEPT][0];
          let sourceFn = source[join.sourceKey];
          return sourceFn.apply(source, [target, args, innerProceed]);
        } else if (joins[targetKey][INTERCEPT].length > 0) {
          throw new Error(
            `Multiple intercept joins cannot be applied to ${targetKey}`
          );
        }
      };

      let proxy;

      if (joins[targetKey][INTERCEPT]) {
        proxy = outerProxy.bind(target, innerProxy.bind(target));
      } else {
        proxy = innerProxy.bind(target);
      }

      target.prototype[targetKey] = proxy;
    });

  }

  getJoins() {
    return this.constructor._joins || {};
  }

  getBeforeJoins(targetKey) {
    let joins = this.getJoins()[targetKey] || {};
    return joins[BEFORE] || [];
  }

  getAfterJoins(targetKey) {
    let joins = this.getJoins()[targetKey] || {};
    return joins[AFTER] || [];
  }

}
