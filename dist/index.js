'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Aspect = require('./Aspect');

var _Aspect2 = _interopRequireDefault(_Aspect);

var _join = require('./join');

var AOP = {
  Aspect: _Aspect2['default'],
  before: _join.before, after: _join.after, intercept: _join.intercept,
  target: function target(_target) {
    return function (context) {
      context._target = _target;
    };
  }
};

exports['default'] = AOP;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var Aspect = (function () {
  function Aspect() {
    var _this = this;

    _classCallCheck(this, Aspect);

    var target = this.constructor._target;
    var joins = this.getJoins();

    Object.keys(joins).forEach(function (targetKey) {

      if (!target.prototype.hasOwnProperty(targetKey)) {
        throw new Error('function ' + targetKey + ' does not exist on target');
      }

      var targetFn = target.prototype[targetKey];
      var clone = targetFn.bind(target);
      var source = _this;

      var innerProxy = function innerProxy() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        source.getBeforeJoins(targetKey).forEach(function (join) {
          source[join.sourceKey].apply(source, [target, args]);
        });

        var returned = clone.apply(targetFn, args);

        source.getAfterJoins(targetKey).forEach(function (join) {
          source[join.sourceKey].apply(source, [target, args]);
        });

        return returned;
      };

      var outerProxy = function outerProxy(innerProceed) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        if (joins[targetKey][_constants.INTERCEPT].length === 1) {
          var join = joins[targetKey][_constants.INTERCEPT][0];
          var sourceFn = source[join.sourceKey];
          return sourceFn.apply(source, [target, args, innerProceed]);
        } else if (joins[targetKey][_constants.INTERCEPT].length > 0) {
          throw new Error('Multiple intercept joins cannot be applied to ' + targetKey);
        }
      };

      var proxy = undefined;

      if (joins[targetKey][_constants.INTERCEPT]) {
        proxy = outerProxy.bind(target, innerProxy.bind(target));
      } else {
        proxy = innerProxy.bind(target);
      }

      target.prototype[targetKey] = proxy;
    });
  }

  _createClass(Aspect, [{
    key: 'getJoins',
    value: function getJoins() {
      return this.constructor._joins || {};
    }
  }, {
    key: 'getBeforeJoins',
    value: function getBeforeJoins(targetKey) {
      var joins = this.getJoins()[targetKey] || {};
      return joins[_constants.BEFORE] || [];
    }
  }, {
    key: 'getAfterJoins',
    value: function getAfterJoins(targetKey) {
      var joins = this.getJoins()[targetKey] || {};
      return joins[_constants.AFTER] || [];
    }
  }]);

  return Aspect;
})();

exports['default'] = Aspect;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var constants = {
  AFTER: 'AFTER',
  BEFORE: 'BEFORE',
  INTERCEPT: 'INTERCEPT'
};

exports['default'] = constants;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _constants = require('./constants');

var joinPointDecorator = function joinPointDecorator(type, targetKey) {
  return function (context, sourceKey) {
    var joins = context.constructor._joins;
    if (!joins) joins = {};
    if (!joins[targetKey]) joins[targetKey] = {};
    if (!joins[targetKey][type]) joins[targetKey][type] = [];
    joins[targetKey][type].push({
      sourceKey: sourceKey,
      targetKey: targetKey
    });
    context.constructor._joins = joins;
  };
};

exports['default'] = {
  joinPointDecorator: joinPointDecorator,
  after: function after(targetKey) {
    return joinPointDecorator(_constants.AFTER, targetKey);
  },
  before: function before(targetKey) {
    return joinPointDecorator(_constants.BEFORE, targetKey);
  },
  intercept: function intercept(targetKey) {
    return joinPointDecorator(_constants.INTERCEPT, targetKey);
  }
};
module.exports = exports['default'];
