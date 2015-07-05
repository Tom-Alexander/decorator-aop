import Aspect from './Aspect';
import {before, after, intercept} from './join';

var AOP = {
  Aspect,
  before, after, intercept,
  target(target) {
    return function (context) {
      context._target = target;
    };
  }
};

export default AOP;
