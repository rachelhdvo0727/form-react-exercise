// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/is_js/is.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/*!
 * is.js 0.8.0
 * Author: Aras Atasaygin
 */

// AMD with global, Node, or global
;(function(root, factory) {    // eslint-disable-line no-extra-semi
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function() {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.is = factory());
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is self)
        root.is = factory();
    }
}(this, function() {

    // Baseline
    /* -------------------------------------------------------------------------- */

    // define 'is' object and current version
    var is = {};
    is.VERSION = '0.8.0';

    // define interfaces
    is.not = {};
    is.all = {};
    is.any = {};

    // cache some methods to call later on
    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // helper function which reverses the sense of predicate result
    function not(func) {
        return function() {
            return !func.apply(null, slice.call(arguments));
        };
    }

    // helper function which call predicate function per parameter and return true if all pass
    function all(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (!func.call(null, params[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // helper function which call predicate function per parameter and return true if any pass
    function any(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (func.call(null, params[i])) {
                    return true;
                }
            }
            return false;
        };
    }

    // build a 'comparator' object for various comparison checks
    var comparator = {
        '<': function(a, b) { return a < b; },
        '<=': function(a, b) { return a <= b; },
        '>': function(a, b) { return a > b; },
        '>=': function(a, b) { return a >= b; }
    }

    // helper function which compares a version to a range
    function compareVersion(version, range) {
        var string = (range + '');
        var n = +(string.match(/\d+/) || NaN);
        var op = string.match(/^[<>]=?|/)[0];
        return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
    }

    // helper function which extracts params from arguments
    function getParams(args) {
        var params = slice.call(args);
        var length = params.length;
        if (length === 1 && is.array(params[0])) {    // support array
            params = params[0];
        }
        return params;
    }

    // Type checks
    /* -------------------------------------------------------------------------- */

    // is a given value Arguments?
    is.arguments = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Arguments]' ||
            (value != null && typeof value === 'object' && 'callee' in value);
    };

    // is a given value Array?
    is.array = Array.isArray || function(value) {    // check native isArray first
        return toString.call(value) === '[object Array]';
    };

    // is a given value Boolean?
    is.boolean = function(value) {
        return value === true || value === false || toString.call(value) === '[object Boolean]';
    };

    // is a given value Char?
    is.char = function(value) {
        return is.string(value) && value.length === 1;
    };

    // is a given value Date Object?
    is.date = function(value) {
        return toString.call(value) === '[object Date]';
    };

    // is a given object a DOM node?
    is.domNode = function(object) {
        return is.object(object) && object.nodeType > 0;
    };

    // is a given value Error object?
    is.error = function(value) {
        return toString.call(value) === '[object Error]';
    };

    // is a given value function?
    is['function'] = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Function]' || typeof value === 'function';
    };

    // is given value a pure JSON object?
    is.json = function(value) {
        return toString.call(value) === '[object Object]';
    };

    // is a given value NaN?
    is.nan = function(value) {    // NaN is number :) Also it is the only value which does not equal itself
        return value !== value;
    };

    // is a given value null?
    is['null'] = function(value) {
        return value === null;
    };

    // is a given value number?
    is.number = function(value) {
        return is.not.nan(value) && toString.call(value) === '[object Number]';
    };

    // is a given value object?
    is.object = function(value) {
        return Object(value) === value;
    };

    // is a given value RegExp?
    is.regexp = function(value) {
        return toString.call(value) === '[object RegExp]';
    };

    // are given values same type?
    // prevent NaN, Number same type check
    is.sameType = function(value, other) {
        var tag = toString.call(value);
        if (tag !== toString.call(other)) {
            return false;
        }
        if (tag === '[object Number]') {
            return !is.any.nan(value, other) || is.all.nan(value, other);
        }
        return true;
    };
    // sameType method does not support 'all' and 'any' interfaces
    is.sameType.api = ['not'];

    // is a given value String?
    is.string = function(value) {
        return toString.call(value) === '[object String]';
    };

    // is a given value undefined?
    is.undefined = function(value) {
        return value === void 0;
    };

    // is a given value window?
    // setInterval method is only available for window object
    is.windowObject = function(value) {
        return value != null && typeof value === 'object' && 'setInterval' in value;
    };

    // Presence checks
    /* -------------------------------------------------------------------------- */

    //is a given value empty? Objects, arrays, strings
    is.empty = function(value) {
        if (is.object(value)) {
            var length = Object.getOwnPropertyNames(value).length;
            if (length === 0 || (length === 1 && is.array(value)) ||
                    (length === 2 && is.arguments(value))) {
                return true;
            }
            return false;
        }
        return value === '';
    };

    // is a given value existy?
    is.existy = function(value) {
        return value != null;
    };

    // is a given value falsy?
    is.falsy = function(value) {
        return !value;
    };

    // is a given value truthy?
    is.truthy = not(is.falsy);

    // Arithmetic checks
    /* -------------------------------------------------------------------------- */

    // is a given number above minimum parameter?
    is.above = function(n, min) {
        return is.all.number(n, min) && n > min;
    };
    // above method does not support 'all' and 'any' interfaces
    is.above.api = ['not'];

    // is a given number decimal?
    is.decimal = function(n) {
        return is.number(n) && n % 1 !== 0;
    };

    // are given values equal? supports numbers, strings, regexes, booleans
    // TODO: Add object and array support
    is.equal = function(value, other) {
        // check 0 and -0 equity with Infinity and -Infinity
        if (is.all.number(value, other)) {
            return value === other && 1 / value === 1 / other;
        }
        // check regexes as strings too
        if (is.all.string(value, other) || is.all.regexp(value, other)) {
            return '' + value === '' + other;
        }
        if (is.all.boolean(value, other)) {
            return value === other;
        }
        return false;
    };
    // equal method does not support 'all' and 'any' interfaces
    is.equal.api = ['not'];

    // is a given number even?
    is.even = function(n) {
        return is.number(n) && n % 2 === 0;
    };

    // is a given number finite?
    is.finite = isFinite || function(n) {
        return is.not.infinite(n) && is.not.nan(n);
    };

    // is a given number infinite?
    is.infinite = function(n) {
        return n === Infinity || n === -Infinity;
    };

    // is a given number integer?
    is.integer = function(n) {
        return is.number(n) && n % 1 === 0;
    };

    // is a given number negative?
    is.negative = function(n) {
        return is.number(n) && n < 0;
    };

    // is a given number odd?
    is.odd = function(n) {
        return is.number(n) && n % 2 === 1;
    };

    // is a given number positive?
    is.positive = function(n) {
        return is.number(n) && n > 0;
    };

    // is a given number above maximum parameter?
    is.under = function(n, max) {
        return is.all.number(n, max) && n < max;
    };
    // least method does not support 'all' and 'any' interfaces
    is.under.api = ['not'];

    // is a given number within minimum and maximum parameters?
    is.within = function(n, min, max) {
        return is.all.number(n, min, max) && n > min && n < max;
    };
    // within method does not support 'all' and 'any' interfaces
    is.within.api = ['not'];

    // Regexp checks
    /* -------------------------------------------------------------------------- */
    // Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
    // Scott Gonzalez: Email address validation

    // dateString match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month, and two or four digits for the year
    // eppPhone match extensible provisioning protocol format
    // nanpPhone match north american number plan format
    // time match hours, minutes, and seconds, 24-hour clock
    var regexes = {
        affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
        alphaNumeric: /^[A-Za-z0-9]+$/,
        caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
        creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
        dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
        eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
        hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
        hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
        ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
        ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
        nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
        timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
        ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
        url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
        usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
    };

    function regexpCheck(regexp, regexes) {
        is[regexp] = function(value) {
            return regexes[regexp].test(value);
        };
    }

    // create regexp checks methods from 'regexes' object
    for (var regexp in regexes) {
        if (regexes.hasOwnProperty(regexp)) {
            regexpCheck(regexp, regexes);
        }
    }

    // simplify IP checks by calling the regex helpers for IPv4 and IPv6
    is.ip = function(value) {
        return is.ipv4(value) || is.ipv6(value);
    };

    // String checks
    /* -------------------------------------------------------------------------- */

    // is a given string or sentence capitalized?
    is.capitalized = function(string) {
        if (is.not.string(string)) {
            return false;
        }
        var words = string.split(' ');
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word.length) {
                var chr = word.charAt(0);
                if (chr !== chr.toUpperCase()) {
                    return false;
                }
            }
        }
        return true;
    };

    // is string end with a given target parameter?
    is.endWith = function(string, target) {
        if (is.not.string(string)) {
            return false;
        }
        target += '';
        var position = string.length - target.length;
        return position >= 0 && string.indexOf(target, position) === position;
    };
    // endWith method does not support 'all' and 'any' interfaces
    is.endWith.api = ['not'];

    // is a given string include parameter target?
    is.include = function(string, target) {
        return string.indexOf(target) > -1;
    };
    // include method does not support 'all' and 'any' interfaces
    is.include.api = ['not'];

    // is a given string all lowercase?
    is.lowerCase = function(string) {
        return is.string(string) && string === string.toLowerCase();
    };

    // is a given string palindrome?
    is.palindrome = function(string) {
        if (is.not.string(string)) {
            return false;
        }
        string = string.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
        var length = string.length - 1;
        for (var i = 0, half = Math.floor(length / 2); i <= half; i++) {
            if (string.charAt(i) !== string.charAt(length - i)) {
                return false;
            }
        }
        return true;
    };

    // is a given value space?
    // horizantal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
    is.space = function(value) {
        if (is.not.char(value)) {
            return false;
        }
        var charCode = value.charCodeAt(0);
        return (charCode > 8 && charCode < 14) || charCode === 32;
    };

    // is string start with a given target parameter?
    is.startWith = function(string, target) {
        return is.string(string) && string.indexOf(target) === 0;
    };
    // startWith method does not support 'all' and 'any' interfaces
    is.startWith.api = ['not'];

    // is a given string all uppercase?
    is.upperCase = function(string) {
        return is.string(string) && string === string.toUpperCase();
    };

    // Time checks
    /* -------------------------------------------------------------------------- */

    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    // is a given dates day equal given day parameter?
    is.day = function(date, day) {
        return is.date(date) && day.toLowerCase() === days[date.getDay()];
    };
    // day method does not support 'all' and 'any' interfaces
    is.day.api = ['not'];

    // is a given date in daylight saving time?
    is.dayLightSavingTime = function(date) {
        var january = new Date(date.getFullYear(), 0, 1);
        var july = new Date(date.getFullYear(), 6, 1);
        var stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
        return date.getTimezoneOffset() < stdTimezoneOffset;
    };

    // is a given date future?
    is.future = function(date) {
        var now = new Date();
        return is.date(date) && date.getTime() > now.getTime();
    };

    // is date within given range?
    is.inDateRange = function(date, start, end) {
        if (is.not.date(date) || is.not.date(start) || is.not.date(end)) {
            return false;
        }
        var stamp = date.getTime();
        return stamp > start.getTime() && stamp < end.getTime();
    };
    // inDateRange method does not support 'all' and 'any' interfaces
    is.inDateRange.api = ['not'];

    // is a given date in last month range?
    is.inLastMonth = function(date) {
        return is.inDateRange(date, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date());
    };

    // is a given date in last week range?
    is.inLastWeek = function(date) {
        return is.inDateRange(date, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
    };

    // is a given date in last year range?
    is.inLastYear = function(date) {
        return is.inDateRange(date, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
    };

    // is a given date in next month range?
    is.inNextMonth = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
    };

    // is a given date in next week range?
    is.inNextWeek = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
    };

    // is a given date in next year range?
    is.inNextYear = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    };

    // is the given year a leap year?
    is.leapYear = function(year) {
        return is.number(year) && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    };

    // is a given dates month equal given month parameter?
    is.month = function(date, month) {
        return is.date(date) && month.toLowerCase() === months[date.getMonth()];
    };
    // month method does not support 'all' and 'any' interfaces
    is.month.api = ['not'];

    // is a given date past?
    is.past = function(date) {
        var now = new Date();
        return is.date(date) && date.getTime() < now.getTime();
    };

    // is a given date in the parameter quarter?
    is.quarterOfYear = function(date, quarter) {
        return is.date(date) && is.number(quarter) && quarter === Math.floor((date.getMonth() + 3) / 3);
    };
    // quarterOfYear method does not support 'all' and 'any' interfaces
    is.quarterOfYear.api = ['not'];

    // is a given date indicate today?
    is.today = function(date) {
        var now = new Date();
        var todayString = now.toDateString();
        return is.date(date) && date.toDateString() === todayString;
    };

    // is a given date indicate tomorrow?
    is.tomorrow = function(date) {
        var now = new Date();
        var tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
        return is.date(date) && date.toDateString() === tomorrowString;
    };

    // is a given date weekend?
    // 6: Saturday, 0: Sunday
    is.weekend = function(date) {
        return is.date(date) && (date.getDay() === 6 || date.getDay() === 0);
    };

    // is a given date weekday?
    is.weekday = not(is.weekend);

    // is a given dates year equal given year parameter?
    is.year = function(date, year) {
        return is.date(date) && is.number(year) && year === date.getFullYear();
    };
    // year method does not support 'all' and 'any' interfaces
    is.year.api = ['not'];

    // is a given date indicate yesterday?
    is.yesterday = function(date) {
        var now = new Date();
        var yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
        return is.date(date) && date.toDateString() === yesterdayString;
    };

    // Environment checks
    /* -------------------------------------------------------------------------- */

    var freeGlobal = is.windowObject(typeof global == 'object' && global) && global;
    var freeSelf = is.windowObject(typeof self == 'object' && self) && self;
    var thisGlobal = is.windowObject(typeof this == 'object' && this) && this;
    var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

    var document = freeSelf && freeSelf.document;
    var previousIs = root.is;

    // store navigator properties to use later
    var navigator = freeSelf && freeSelf.navigator;
    var appVersion = (navigator && navigator.appVersion || '').toLowerCase();
    var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
    var vendor = (navigator && navigator.vendor || '').toLowerCase();

    // is current device android?
    is.android = function() {
        return /android/.test(userAgent);
    };
    // android method does not support 'all' and 'any' interfaces
    is.android.api = ['not'];

    // is current device android phone?
    is.androidPhone = function() {
        return /android/.test(userAgent) && /mobile/.test(userAgent);
    };
    // androidPhone method does not support 'all' and 'any' interfaces
    is.androidPhone.api = ['not'];

    // is current device android tablet?
    is.androidTablet = function() {
        return /android/.test(userAgent) && !/mobile/.test(userAgent);
    };
    // androidTablet method does not support 'all' and 'any' interfaces
    is.androidTablet.api = ['not'];

    // is current device blackberry?
    is.blackberry = function() {
        return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
    };
    // blackberry method does not support 'all' and 'any' interfaces
    is.blackberry.api = ['not'];

    // is current browser chrome?
    // parameter is optional
    is.chrome = function(range) {
        var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
        return match !== null && compareVersion(match[1], range);
    };
    // chrome method does not support 'all' and 'any' interfaces
    is.chrome.api = ['not'];

    // is current device desktop?
    is.desktop = function() {
        return is.not.mobile() && is.not.tablet();
    };
    // desktop method does not support 'all' and 'any' interfaces
    is.desktop.api = ['not'];

    // is current browser edge?
    // parameter is optional
    is.edge = function(range) {
        var match = userAgent.match(/edge\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // edge method does not support 'all' and 'any' interfaces
    is.edge.api = ['not'];

    // is current browser firefox?
    // parameter is optional
    is.firefox = function(range) {
        var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // firefox method does not support 'all' and 'any' interfaces
    is.firefox.api = ['not'];

    // is current browser internet explorer?
    // parameter is optional
    is.ie = function(range) {
        var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ie method does not support 'all' and 'any' interfaces
    is.ie.api = ['not'];

    // is current device ios?
    is.ios = function() {
        return is.iphone() || is.ipad() || is.ipod();
    };
    // ios method does not support 'all' and 'any' interfaces
    is.ios.api = ['not'];

    // is current device ipad?
    // parameter is optional
    is.ipad = function(range) {
        var match = userAgent.match(/ipad.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipad method does not support 'all' and 'any' interfaces
    is.ipad.api = ['not'];

    // is current device iphone?
    // parameter is optional
    is.iphone = function(range) {
        // original iPhone doesn't have the os portion of the UA
        var match = userAgent.match(/iphone(?:.+?os (\d+))?/);
        return match !== null && compareVersion(match[1] || 1, range);
    };
    // iphone method does not support 'all' and 'any' interfaces
    is.iphone.api = ['not'];

    // is current device ipod?
    // parameter is optional
    is.ipod = function(range) {
        var match = userAgent.match(/ipod.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipod method does not support 'all' and 'any' interfaces
    is.ipod.api = ['not'];

    // is current operating system linux?
    is.linux = function() {
        return /linux/.test(appVersion);
    };
    // linux method does not support 'all' and 'any' interfaces
    is.linux.api = ['not'];

    // is current operating system mac?
    is.mac = function() {
        return /mac/.test(appVersion);
    };
    // mac method does not support 'all' and 'any' interfaces
    is.mac.api = ['not'];

    // is current device mobile?
    is.mobile = function() {
        return is.iphone() || is.ipod() || is.androidPhone() || is.blackberry() || is.windowsPhone();
    };
    // mobile method does not support 'all' and 'any' interfaces
    is.mobile.api = ['not'];

    // is current state offline?
    is.offline = not(is.online);
    // offline method does not support 'all' and 'any' interfaces
    is.offline.api = ['not'];

    // is current state online?
    is.online = function() {
        return !navigator || navigator.onLine === true;
    };
    // online method does not support 'all' and 'any' interfaces
    is.online.api = ['not'];

    // is current browser opera?
    // parameter is optional
    is.opera = function(range) {
        var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // opera method does not support 'all' and 'any' interfaces
    is.opera.api = ['not'];

    // is current browser phantomjs?
    // parameter is optional
    is.phantom = function(range) {
        var match = userAgent.match(/phantomjs\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // phantom method does not support 'all' and 'any' interfaces
    is.phantom.api = ['not'];

    // is current browser safari?
    // parameter is optional
    is.safari = function(range) {
        var match = userAgent.match(/version\/(\d+).+?safari/);
        return match !== null && compareVersion(match[1], range);
    };
    // safari method does not support 'all' and 'any' interfaces
    is.safari.api = ['not'];

    // is current device tablet?
    is.tablet = function() {
        return is.ipad() || is.androidTablet() || is.windowsTablet();
    };
    // tablet method does not support 'all' and 'any' interfaces
    is.tablet.api = ['not'];

    // is current device supports touch?
    is.touchDevice = function() {
        return !!document && ('ontouchstart' in freeSelf ||
            ('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
    };
    // touchDevice method does not support 'all' and 'any' interfaces
    is.touchDevice.api = ['not'];

    // is current operating system windows?
    is.windows = function() {
        return /win/.test(appVersion);
    };
    // windows method does not support 'all' and 'any' interfaces
    is.windows.api = ['not'];

    // is current device windows phone?
    is.windowsPhone = function() {
        return is.windows() && /phone/.test(userAgent);
    };
    // windowsPhone method does not support 'all' and 'any' interfaces
    is.windowsPhone.api = ['not'];

    // is current device windows tablet?
    is.windowsTablet = function() {
        return is.windows() && is.not.windowsPhone() && /touch/.test(userAgent);
    };
    // windowsTablet method does not support 'all' and 'any' interfaces
    is.windowsTablet.api = ['not'];

    // Object checks
    /* -------------------------------------------------------------------------- */

    // has a given object got parameterized count property?
    is.propertyCount = function(object, count) {
        if (is.not.object(object) || is.not.number(count)) {
            return false;
        }
        var n = 0;
        for (var property in object) {
            if (hasOwnProperty.call(object, property) && ++n > count) {
                return false;
            }
        }
        return n === count;
    };
    // propertyCount method does not support 'all' and 'any' interfaces
    is.propertyCount.api = ['not'];

    // is given object has parameterized property?
    is.propertyDefined = function(object, property) {
        return is.object(object) && is.string(property) && property in object;
    };
    // propertyDefined method does not support 'all' and 'any' interfaces
    is.propertyDefined.api = ['not'];

    // Array checks
    /* -------------------------------------------------------------------------- */

    // is a given item in an array?
    is.inArray = function(value, array) {
        if (is.not.array(array)) {
            return false;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    };
    // inArray method does not support 'all' and 'any' interfaces
    is.inArray.api = ['not'];

    // is a given array sorted?
    is.sorted = function(array, sign) {
        if (is.not.array(array)) {
            return false;
        }
        var predicate = comparator[sign] || comparator['>='];
        for (var i = 1; i < array.length; i++) {
            if (!predicate(array[i], array[i - 1])) {
                return false;
            }
        }
        return true;
    };

    // API
    // Set 'not', 'all' and 'any' interfaces to methods based on their api property
    /* -------------------------------------------------------------------------- */

    function setInterfaces() {
        var options = is;
        for (var option in options) {
            if (hasOwnProperty.call(options, option) && is['function'](options[option])) {
                var interfaces = options[option].api || ['not', 'all', 'any'];
                for (var i = 0; i < interfaces.length; i++) {
                    if (interfaces[i] === 'not') {
                        is.not[option] = not(is[option]);
                    }
                    if (interfaces[i] === 'all') {
                        is.all[option] = all(is[option]);
                    }
                    if (interfaces[i] === 'any') {
                        is.any[option] = any(is[option]);
                    }
                }
            }
        }
    }
    setInterfaces();

    // Configuration methods
    // Intentionally added after setInterfaces function
    /* -------------------------------------------------------------------------- */

    // change namespace of library to prevent name collisions
    // var preferredName = is.setNamespace();
    // preferredName.odd(3);
    // => true
    is.setNamespace = function() {
        root.is = previousIs;
        return this;
    };

    // set optional regexes to methods
    is.setRegexp = function(regexp, name) {
        for (var r in regexes) {
            if (hasOwnProperty.call(regexes, r) && (name === r)) {
                regexes[r] = regexp;
            }
        }
    };

    return is;
}));

},{}],"node_modules/cleave.js/dist/cleave-esm.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var NumeralFormatter = function (numeralDecimalMark, numeralIntegerScale, numeralDecimalScale, numeralThousandsGroupStyle, numeralPositiveOnly, stripLeadingZeroes, prefix, signBeforePrefix, tailPrefix, delimiter) {
  var owner = this;
  owner.numeralDecimalMark = numeralDecimalMark || '.';
  owner.numeralIntegerScale = numeralIntegerScale > 0 ? numeralIntegerScale : 0;
  owner.numeralDecimalScale = numeralDecimalScale >= 0 ? numeralDecimalScale : 2;
  owner.numeralThousandsGroupStyle = numeralThousandsGroupStyle || NumeralFormatter.groupStyle.thousand;
  owner.numeralPositiveOnly = !!numeralPositiveOnly;
  owner.stripLeadingZeroes = stripLeadingZeroes !== false;
  owner.prefix = prefix || prefix === '' ? prefix : '';
  owner.signBeforePrefix = !!signBeforePrefix;
  owner.tailPrefix = !!tailPrefix;
  owner.delimiter = delimiter || delimiter === '' ? delimiter : ',';
  owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
};

NumeralFormatter.groupStyle = {
  thousand: 'thousand',
  lakh: 'lakh',
  wan: 'wan',
  none: 'none'
};
NumeralFormatter.prototype = {
  getRawValue: function (value) {
    return value.replace(this.delimiterRE, '').replace(this.numeralDecimalMark, '.');
  },
  format: function (value) {
    var owner = this,
        parts,
        partSign,
        partSignAndPrefix,
        partInteger,
        partDecimal = ''; // strip alphabet letters

    value = value.replace(/[A-Za-z]/g, '') // replace the first decimal mark with reserved placeholder
    .replace(owner.numeralDecimalMark, 'M') // strip non numeric letters except minus and "M"
    // this is to ensure prefix has been stripped
    .replace(/[^\dM-]/g, '') // replace the leading minus with reserved placeholder
    .replace(/^\-/, 'N') // strip the other minus sign (if present)
    .replace(/\-/g, '') // replace the minus sign (if present)
    .replace('N', owner.numeralPositiveOnly ? '' : '-') // replace decimal mark
    .replace('M', owner.numeralDecimalMark); // strip any leading zeros

    if (owner.stripLeadingZeroes) {
      value = value.replace(/^(-)?0+(?=\d)/, '$1');
    }

    partSign = value.slice(0, 1) === '-' ? '-' : '';

    if (typeof owner.prefix != 'undefined') {
      if (owner.signBeforePrefix) {
        partSignAndPrefix = partSign + owner.prefix;
      } else {
        partSignAndPrefix = owner.prefix + partSign;
      }
    } else {
      partSignAndPrefix = partSign;
    }

    partInteger = value;

    if (value.indexOf(owner.numeralDecimalMark) >= 0) {
      parts = value.split(owner.numeralDecimalMark);
      partInteger = parts[0];
      partDecimal = owner.numeralDecimalMark + parts[1].slice(0, owner.numeralDecimalScale);
    }

    if (partSign === '-') {
      partInteger = partInteger.slice(1);
    }

    if (owner.numeralIntegerScale > 0) {
      partInteger = partInteger.slice(0, owner.numeralIntegerScale);
    }

    switch (owner.numeralThousandsGroupStyle) {
      case NumeralFormatter.groupStyle.lakh:
        partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + owner.delimiter);
        break;

      case NumeralFormatter.groupStyle.wan:
        partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, '$1' + owner.delimiter);
        break;

      case NumeralFormatter.groupStyle.thousand:
        partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + owner.delimiter);
        break;
    }

    if (owner.tailPrefix) {
      return partSign + partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '') + owner.prefix;
    }

    return partSignAndPrefix + partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '');
  }
};
var NumeralFormatter_1 = NumeralFormatter;

var DateFormatter = function (datePattern, dateMin, dateMax) {
  var owner = this;
  owner.date = [];
  owner.blocks = [];
  owner.datePattern = datePattern;
  owner.dateMin = dateMin.split('-').reverse().map(function (x) {
    return parseInt(x, 10);
  });
  if (owner.dateMin.length === 2) owner.dateMin.unshift(0);
  owner.dateMax = dateMax.split('-').reverse().map(function (x) {
    return parseInt(x, 10);
  });
  if (owner.dateMax.length === 2) owner.dateMax.unshift(0);
  owner.initBlocks();
};

DateFormatter.prototype = {
  initBlocks: function () {
    var owner = this;
    owner.datePattern.forEach(function (value) {
      if (value === 'Y') {
        owner.blocks.push(4);
      } else {
        owner.blocks.push(2);
      }
    });
  },
  getISOFormatDate: function () {
    var owner = this,
        date = owner.date;
    return date[2] ? date[2] + '-' + owner.addLeadingZero(date[1]) + '-' + owner.addLeadingZero(date[0]) : '';
  },
  getBlocks: function () {
    return this.blocks;
  },
  getValidatedDate: function (value) {
    var owner = this,
        result = '';
    value = value.replace(/[^\d]/g, '');
    owner.blocks.forEach(function (length, index) {
      if (value.length > 0) {
        var sub = value.slice(0, length),
            sub0 = sub.slice(0, 1),
            rest = value.slice(length);

        switch (owner.datePattern[index]) {
          case 'd':
            if (sub === '00') {
              sub = '01';
            } else if (parseInt(sub0, 10) > 3) {
              sub = '0' + sub0;
            } else if (parseInt(sub, 10) > 31) {
              sub = '31';
            }

            break;

          case 'm':
            if (sub === '00') {
              sub = '01';
            } else if (parseInt(sub0, 10) > 1) {
              sub = '0' + sub0;
            } else if (parseInt(sub, 10) > 12) {
              sub = '12';
            }

            break;
        }

        result += sub; // update remaining string

        value = rest;
      }
    });
    return this.getFixedDateString(result);
  },
  getFixedDateString: function (value) {
    var owner = this,
        datePattern = owner.datePattern,
        date = [],
        dayIndex = 0,
        monthIndex = 0,
        yearIndex = 0,
        dayStartIndex = 0,
        monthStartIndex = 0,
        yearStartIndex = 0,
        day,
        month,
        year,
        fullYearDone = false; // mm-dd || dd-mm

    if (value.length === 4 && datePattern[0].toLowerCase() !== 'y' && datePattern[1].toLowerCase() !== 'y') {
      dayStartIndex = datePattern[0] === 'd' ? 0 : 2;
      monthStartIndex = 2 - dayStartIndex;
      day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      date = this.getFixedDate(day, month, 0);
    } // yyyy-mm-dd || yyyy-dd-mm || mm-dd-yyyy || dd-mm-yyyy || dd-yyyy-mm || mm-yyyy-dd


    if (value.length === 8) {
      datePattern.forEach(function (type, index) {
        switch (type) {
          case 'd':
            dayIndex = index;
            break;

          case 'm':
            monthIndex = index;
            break;

          default:
            yearIndex = index;
            break;
        }
      });
      yearStartIndex = yearIndex * 2;
      dayStartIndex = dayIndex <= yearIndex ? dayIndex * 2 : dayIndex * 2 + 2;
      monthStartIndex = monthIndex <= yearIndex ? monthIndex * 2 : monthIndex * 2 + 2;
      day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);
      fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;
      date = this.getFixedDate(day, month, year);
    } // mm-yy || yy-mm


    if (value.length === 4 && (datePattern[0] === 'y' || datePattern[1] === 'y')) {
      monthStartIndex = datePattern[0] === 'm' ? 0 : 2;
      yearStartIndex = 2 - monthStartIndex;
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      year = parseInt(value.slice(yearStartIndex, yearStartIndex + 2), 10);
      fullYearDone = value.slice(yearStartIndex, yearStartIndex + 2).length === 2;
      date = [0, month, year];
    } // mm-yyyy || yyyy-mm


    if (value.length === 6 && (datePattern[0] === 'Y' || datePattern[1] === 'Y')) {
      monthStartIndex = datePattern[0] === 'm' ? 0 : 4;
      yearStartIndex = 2 - 0.5 * monthStartIndex;
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);
      fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;
      date = [0, month, year];
    }

    date = owner.getRangeFixedDate(date);
    owner.date = date;
    var result = date.length === 0 ? value : datePattern.reduce(function (previous, current) {
      switch (current) {
        case 'd':
          return previous + (date[0] === 0 ? '' : owner.addLeadingZero(date[0]));

        case 'm':
          return previous + (date[1] === 0 ? '' : owner.addLeadingZero(date[1]));

        case 'y':
          return previous + (fullYearDone ? owner.addLeadingZeroForYear(date[2], false) : '');

        case 'Y':
          return previous + (fullYearDone ? owner.addLeadingZeroForYear(date[2], true) : '');
      }
    }, '');
    return result;
  },
  getRangeFixedDate: function (date) {
    var owner = this,
        datePattern = owner.datePattern,
        dateMin = owner.dateMin || [],
        dateMax = owner.dateMax || [];
    if (!date.length || dateMin.length < 3 && dateMax.length < 3) return date;
    if (datePattern.find(function (x) {
      return x.toLowerCase() === 'y';
    }) && date[2] === 0) return date;
    if (dateMax.length && (dateMax[2] < date[2] || dateMax[2] === date[2] && (dateMax[1] < date[1] || dateMax[1] === date[1] && dateMax[0] < date[0]))) return dateMax;
    if (dateMin.length && (dateMin[2] > date[2] || dateMin[2] === date[2] && (dateMin[1] > date[1] || dateMin[1] === date[1] && dateMin[0] > date[0]))) return dateMin;
    return date;
  },
  getFixedDate: function (day, month, year) {
    day = Math.min(day, 31);
    month = Math.min(month, 12);
    year = parseInt(year || 0, 10);

    if (month < 7 && month % 2 === 0 || month > 8 && month % 2 === 1) {
      day = Math.min(day, month === 2 ? this.isLeapYear(year) ? 29 : 28 : 30);
    }

    return [day, month, year];
  },
  isLeapYear: function (year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  },
  addLeadingZero: function (number) {
    return (number < 10 ? '0' : '') + number;
  },
  addLeadingZeroForYear: function (number, fullYearMode) {
    if (fullYearMode) {
      return (number < 10 ? '000' : number < 100 ? '00' : number < 1000 ? '0' : '') + number;
    }

    return (number < 10 ? '0' : '') + number;
  }
};
var DateFormatter_1 = DateFormatter;

var TimeFormatter = function (timePattern, timeFormat) {
  var owner = this;
  owner.time = [];
  owner.blocks = [];
  owner.timePattern = timePattern;
  owner.timeFormat = timeFormat;
  owner.initBlocks();
};

TimeFormatter.prototype = {
  initBlocks: function () {
    var owner = this;
    owner.timePattern.forEach(function () {
      owner.blocks.push(2);
    });
  },
  getISOFormatTime: function () {
    var owner = this,
        time = owner.time;
    return time[2] ? owner.addLeadingZero(time[0]) + ':' + owner.addLeadingZero(time[1]) + ':' + owner.addLeadingZero(time[2]) : '';
  },
  getBlocks: function () {
    return this.blocks;
  },
  getTimeFormatOptions: function () {
    var owner = this;

    if (String(owner.timeFormat) === '12') {
      return {
        maxHourFirstDigit: 1,
        maxHours: 12,
        maxMinutesFirstDigit: 5,
        maxMinutes: 60
      };
    }

    return {
      maxHourFirstDigit: 2,
      maxHours: 23,
      maxMinutesFirstDigit: 5,
      maxMinutes: 60
    };
  },
  getValidatedTime: function (value) {
    var owner = this,
        result = '';
    value = value.replace(/[^\d]/g, '');
    var timeFormatOptions = owner.getTimeFormatOptions();
    owner.blocks.forEach(function (length, index) {
      if (value.length > 0) {
        var sub = value.slice(0, length),
            sub0 = sub.slice(0, 1),
            rest = value.slice(length);

        switch (owner.timePattern[index]) {
          case 'h':
            if (parseInt(sub0, 10) > timeFormatOptions.maxHourFirstDigit) {
              sub = '0' + sub0;
            } else if (parseInt(sub, 10) > timeFormatOptions.maxHours) {
              sub = timeFormatOptions.maxHours + '';
            }

            break;

          case 'm':
          case 's':
            if (parseInt(sub0, 10) > timeFormatOptions.maxMinutesFirstDigit) {
              sub = '0' + sub0;
            } else if (parseInt(sub, 10) > timeFormatOptions.maxMinutes) {
              sub = timeFormatOptions.maxMinutes + '';
            }

            break;
        }

        result += sub; // update remaining string

        value = rest;
      }
    });
    return this.getFixedTimeString(result);
  },
  getFixedTimeString: function (value) {
    var owner = this,
        timePattern = owner.timePattern,
        time = [],
        secondIndex = 0,
        minuteIndex = 0,
        hourIndex = 0,
        secondStartIndex = 0,
        minuteStartIndex = 0,
        hourStartIndex = 0,
        second,
        minute,
        hour;

    if (value.length === 6) {
      timePattern.forEach(function (type, index) {
        switch (type) {
          case 's':
            secondIndex = index * 2;
            break;

          case 'm':
            minuteIndex = index * 2;
            break;

          case 'h':
            hourIndex = index * 2;
            break;
        }
      });
      hourStartIndex = hourIndex;
      minuteStartIndex = minuteIndex;
      secondStartIndex = secondIndex;
      second = parseInt(value.slice(secondStartIndex, secondStartIndex + 2), 10);
      minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
      hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);
      time = this.getFixedTime(hour, minute, second);
    }

    if (value.length === 4 && owner.timePattern.indexOf('s') < 0) {
      timePattern.forEach(function (type, index) {
        switch (type) {
          case 'm':
            minuteIndex = index * 2;
            break;

          case 'h':
            hourIndex = index * 2;
            break;
        }
      });
      hourStartIndex = hourIndex;
      minuteStartIndex = minuteIndex;
      second = 0;
      minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
      hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);
      time = this.getFixedTime(hour, minute, second);
    }

    owner.time = time;
    return time.length === 0 ? value : timePattern.reduce(function (previous, current) {
      switch (current) {
        case 's':
          return previous + owner.addLeadingZero(time[2]);

        case 'm':
          return previous + owner.addLeadingZero(time[1]);

        case 'h':
          return previous + owner.addLeadingZero(time[0]);
      }
    }, '');
  },
  getFixedTime: function (hour, minute, second) {
    second = Math.min(parseInt(second || 0, 10), 60);
    minute = Math.min(minute, 60);
    hour = Math.min(hour, 60);
    return [hour, minute, second];
  },
  addLeadingZero: function (number) {
    return (number < 10 ? '0' : '') + number;
  }
};
var TimeFormatter_1 = TimeFormatter;

var PhoneFormatter = function (formatter, delimiter) {
  var owner = this;
  owner.delimiter = delimiter || delimiter === '' ? delimiter : ' ';
  owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
  owner.formatter = formatter;
};

PhoneFormatter.prototype = {
  setFormatter: function (formatter) {
    this.formatter = formatter;
  },
  format: function (phoneNumber) {
    var owner = this;
    owner.formatter.clear(); // only keep number and +

    phoneNumber = phoneNumber.replace(/[^\d+]/g, ''); // strip non-leading +

    phoneNumber = phoneNumber.replace(/^\+/, 'B').replace(/\+/g, '').replace('B', '+'); // strip delimiter

    phoneNumber = phoneNumber.replace(owner.delimiterRE, '');
    var result = '',
        current,
        validated = false;

    for (var i = 0, iMax = phoneNumber.length; i < iMax; i++) {
      current = owner.formatter.inputDigit(phoneNumber.charAt(i)); // has ()- or space inside

      if (/[\s()-]/g.test(current)) {
        result = current;
        validated = true;
      } else {
        if (!validated) {
          result = current;
        } // else: over length input
        // it turns to invalid number again

      }
    } // strip ()
    // e.g. US: 7161234567 returns (716) 123-4567


    result = result.replace(/[()]/g, ''); // replace library delimiter with user customized delimiter

    result = result.replace(/[\s-]/g, owner.delimiter);
    return result;
  }
};
var PhoneFormatter_1 = PhoneFormatter;
var CreditCardDetector = {
  blocks: {
    uatp: [4, 5, 6],
    amex: [4, 6, 5],
    diners: [4, 6, 4],
    discover: [4, 4, 4, 4],
    mastercard: [4, 4, 4, 4],
    dankort: [4, 4, 4, 4],
    instapayment: [4, 4, 4, 4],
    jcb15: [4, 6, 5],
    jcb: [4, 4, 4, 4],
    maestro: [4, 4, 4, 4],
    visa: [4, 4, 4, 4],
    mir: [4, 4, 4, 4],
    unionPay: [4, 4, 4, 4],
    general: [4, 4, 4, 4]
  },
  re: {
    // starts with 1; 15 digits, not starts with 1800 (jcb card)
    uatp: /^(?!1800)1\d{0,14}/,
    // starts with 34/37; 15 digits
    amex: /^3[47]\d{0,13}/,
    // starts with 6011/65/644-649; 16 digits
    discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
    // starts with 300-305/309 or 36/38/39; 14 digits
    diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
    // starts with 51-55/2221–2720; 16 digits
    mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
    // starts with 5019/4175/4571; 16 digits
    dankort: /^(5019|4175|4571)\d{0,12}/,
    // starts with 637-639; 16 digits
    instapayment: /^63[7-9]\d{0,13}/,
    // starts with 2131/1800; 15 digits
    jcb15: /^(?:2131|1800)\d{0,11}/,
    // starts with 2131/1800/35; 16 digits
    jcb: /^(?:35\d{0,2})\d{0,12}/,
    // starts with 50/56-58/6304/67; 16 digits
    maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
    // starts with 22; 16 digits
    mir: /^220[0-4]\d{0,12}/,
    // starts with 4; 16 digits
    visa: /^4\d{0,15}/,
    // starts with 62/81; 16 digits
    unionPay: /^(62|81)\d{0,14}/
  },
  getStrictBlocks: function (block) {
    var total = block.reduce(function (prev, current) {
      return prev + current;
    }, 0);
    return block.concat(19 - total);
  },
  getInfo: function (value, strictMode) {
    var blocks = CreditCardDetector.blocks,
        re = CreditCardDetector.re; // Some credit card can have up to 19 digits number.
    // Set strictMode to true will remove the 16 max-length restrain,
    // however, I never found any website validate card number like
    // this, hence probably you don't want to enable this option.

    strictMode = !!strictMode;

    for (var key in re) {
      if (re[key].test(value)) {
        var matchedBlocks = blocks[key];
        return {
          type: key,
          blocks: strictMode ? this.getStrictBlocks(matchedBlocks) : matchedBlocks
        };
      }
    }

    return {
      type: 'unknown',
      blocks: strictMode ? this.getStrictBlocks(blocks.general) : blocks.general
    };
  }
};
var CreditCardDetector_1 = CreditCardDetector;
var Util = {
  noop: function () {},
  strip: function (value, re) {
    return value.replace(re, '');
  },
  getPostDelimiter: function (value, delimiter, delimiters) {
    // single delimiter
    if (delimiters.length === 0) {
      return value.slice(-delimiter.length) === delimiter ? delimiter : '';
    } // multiple delimiters


    var matchedDelimiter = '';
    delimiters.forEach(function (current) {
      if (value.slice(-current.length) === current) {
        matchedDelimiter = current;
      }
    });
    return matchedDelimiter;
  },
  getDelimiterREByDelimiter: function (delimiter) {
    return new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
  },
  getNextCursorPosition: function (prevPos, oldValue, newValue, delimiter, delimiters) {
    // If cursor was at the end of value, just place it back.
    // Because new value could contain additional chars.
    if (oldValue.length === prevPos) {
      return newValue.length;
    }

    return prevPos + this.getPositionOffset(prevPos, oldValue, newValue, delimiter, delimiters);
  },
  getPositionOffset: function (prevPos, oldValue, newValue, delimiter, delimiters) {
    var oldRawValue, newRawValue, lengthOffset;
    oldRawValue = this.stripDelimiters(oldValue.slice(0, prevPos), delimiter, delimiters);
    newRawValue = this.stripDelimiters(newValue.slice(0, prevPos), delimiter, delimiters);
    lengthOffset = oldRawValue.length - newRawValue.length;
    return lengthOffset !== 0 ? lengthOffset / Math.abs(lengthOffset) : 0;
  },
  stripDelimiters: function (value, delimiter, delimiters) {
    var owner = this; // single delimiter

    if (delimiters.length === 0) {
      var delimiterRE = delimiter ? owner.getDelimiterREByDelimiter(delimiter) : '';
      return value.replace(delimiterRE, '');
    } // multiple delimiters


    delimiters.forEach(function (current) {
      current.split('').forEach(function (letter) {
        value = value.replace(owner.getDelimiterREByDelimiter(letter), '');
      });
    });
    return value;
  },
  headStr: function (str, length) {
    return str.slice(0, length);
  },
  getMaxLength: function (blocks) {
    return blocks.reduce(function (previous, current) {
      return previous + current;
    }, 0);
  },
  // strip prefix
  // Before type  |   After type    |     Return value
  // PEFIX-...    |   PEFIX-...     |     ''
  // PREFIX-123   |   PEFIX-123     |     123
  // PREFIX-123   |   PREFIX-23     |     23
  // PREFIX-123   |   PREFIX-1234   |     1234
  getPrefixStrippedValue: function (value, prefix, prefixLength, prevResult, delimiter, delimiters, noImmediatePrefix, tailPrefix, signBeforePrefix) {
    // No prefix
    if (prefixLength === 0) {
      return value;
    }

    if (signBeforePrefix && value.slice(0, 1) == '-') {
      var prev = prevResult.slice(0, 1) == '-' ? prevResult.slice(1) : prevResult;
      return '-' + this.getPrefixStrippedValue(value.slice(1), prefix, prefixLength, prev, delimiter, delimiters, noImmediatePrefix, tailPrefix, signBeforePrefix);
    } // Pre result prefix string does not match pre-defined prefix


    if (prevResult.slice(0, prefixLength) !== prefix && !tailPrefix) {
      // Check if the first time user entered something
      if (noImmediatePrefix && !prevResult && value) return value;
      return '';
    } else if (prevResult.slice(-prefixLength) !== prefix && tailPrefix) {
      // Check if the first time user entered something
      if (noImmediatePrefix && !prevResult && value) return value;
      return '';
    }

    var prevValue = this.stripDelimiters(prevResult, delimiter, delimiters); // New value has issue, someone typed in between prefix letters
    // Revert to pre value

    if (value.slice(0, prefixLength) !== prefix && !tailPrefix) {
      return prevValue.slice(prefixLength);
    } else if (value.slice(-prefixLength) !== prefix && tailPrefix) {
      return prevValue.slice(0, -prefixLength - 1);
    } // No issue, strip prefix for new value


    return tailPrefix ? value.slice(0, -prefixLength) : value.slice(prefixLength);
  },
  getFirstDiffIndex: function (prev, current) {
    var index = 0;

    while (prev.charAt(index) === current.charAt(index)) {
      if (prev.charAt(index++) === '') {
        return -1;
      }
    }

    return index;
  },
  getFormattedValue: function (value, blocks, blocksLength, delimiter, delimiters, delimiterLazyShow) {
    var result = '',
        multipleDelimiters = delimiters.length > 0,
        currentDelimiter; // no options, normal input

    if (blocksLength === 0) {
      return value;
    }

    blocks.forEach(function (length, index) {
      if (value.length > 0) {
        var sub = value.slice(0, length),
            rest = value.slice(length);

        if (multipleDelimiters) {
          currentDelimiter = delimiters[delimiterLazyShow ? index - 1 : index] || currentDelimiter;
        } else {
          currentDelimiter = delimiter;
        }

        if (delimiterLazyShow) {
          if (index > 0) {
            result += currentDelimiter;
          }

          result += sub;
        } else {
          result += sub;

          if (sub.length === length && index < blocksLength - 1) {
            result += currentDelimiter;
          }
        } // update remaining string


        value = rest;
      }
    });
    return result;
  },
  // move cursor to the end
  // the first time user focuses on an input with prefix
  fixPrefixCursor: function (el, prefix, delimiter, delimiters) {
    if (!el) {
      return;
    }

    var val = el.value,
        appendix = delimiter || delimiters[0] || ' ';

    if (!el.setSelectionRange || !prefix || prefix.length + appendix.length <= val.length) {
      return;
    }

    var len = val.length * 2; // set timeout to avoid blink

    setTimeout(function () {
      el.setSelectionRange(len, len);
    }, 1);
  },
  // Check if input field is fully selected
  checkFullSelection: function (value) {
    try {
      var selection = window.getSelection() || document.getSelection() || {};
      return selection.toString().length === value.length;
    } catch (ex) {// Ignore
    }

    return false;
  },
  setSelection: function (element, position, doc) {
    if (element !== this.getActiveElement(doc)) {
      return;
    } // cursor is already in the end


    if (element && element.value.length <= position) {
      return;
    }

    if (element.createTextRange) {
      var range = element.createTextRange();
      range.move('character', position);
      range.select();
    } else {
      try {
        element.setSelectionRange(position, position);
      } catch (e) {
        // eslint-disable-next-line
        console.warn('The input element type does not support selection');
      }
    }
  },
  getActiveElement: function (parent) {
    var activeElement = parent.activeElement;

    if (activeElement && activeElement.shadowRoot) {
      return this.getActiveElement(activeElement.shadowRoot);
    }

    return activeElement;
  },
  isAndroid: function () {
    return navigator && /android/i.test(navigator.userAgent);
  },
  // On Android chrome, the keyup and keydown events
  // always return key code 229 as a composition that
  // buffers the user’s keystrokes
  // see https://github.com/nosir/cleave.js/issues/147
  isAndroidBackspaceKeydown: function (lastInputValue, currentInputValue) {
    if (!this.isAndroid() || !lastInputValue || !currentInputValue) {
      return false;
    }

    return currentInputValue === lastInputValue.slice(0, -1);
  }
};
var Util_1 = Util;
/**
 * Props Assignment
 *
 * Separate this, so react module can share the usage
 */

var DefaultProperties = {
  // Maybe change to object-assign
  // for now just keep it as simple
  assign: function (target, opts) {
    target = target || {};
    opts = opts || {}; // credit card

    target.creditCard = !!opts.creditCard;
    target.creditCardStrictMode = !!opts.creditCardStrictMode;
    target.creditCardType = '';

    target.onCreditCardTypeChanged = opts.onCreditCardTypeChanged || function () {}; // phone


    target.phone = !!opts.phone;
    target.phoneRegionCode = opts.phoneRegionCode || 'AU';
    target.phoneFormatter = {}; // time

    target.time = !!opts.time;
    target.timePattern = opts.timePattern || ['h', 'm', 's'];
    target.timeFormat = opts.timeFormat || '24';
    target.timeFormatter = {}; // date

    target.date = !!opts.date;
    target.datePattern = opts.datePattern || ['d', 'm', 'Y'];
    target.dateMin = opts.dateMin || '';
    target.dateMax = opts.dateMax || '';
    target.dateFormatter = {}; // numeral

    target.numeral = !!opts.numeral;
    target.numeralIntegerScale = opts.numeralIntegerScale > 0 ? opts.numeralIntegerScale : 0;
    target.numeralDecimalScale = opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2;
    target.numeralDecimalMark = opts.numeralDecimalMark || '.';
    target.numeralThousandsGroupStyle = opts.numeralThousandsGroupStyle || 'thousand';
    target.numeralPositiveOnly = !!opts.numeralPositiveOnly;
    target.stripLeadingZeroes = opts.stripLeadingZeroes !== false;
    target.signBeforePrefix = !!opts.signBeforePrefix;
    target.tailPrefix = !!opts.tailPrefix; // others

    target.swapHiddenInput = !!opts.swapHiddenInput;
    target.numericOnly = target.creditCard || target.date || !!opts.numericOnly;
    target.uppercase = !!opts.uppercase;
    target.lowercase = !!opts.lowercase;
    target.prefix = target.creditCard || target.date ? '' : opts.prefix || '';
    target.noImmediatePrefix = !!opts.noImmediatePrefix;
    target.prefixLength = target.prefix.length;
    target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix;
    target.copyDelimiter = !!opts.copyDelimiter;
    target.initValue = opts.initValue !== undefined && opts.initValue !== null ? opts.initValue.toString() : '';
    target.delimiter = opts.delimiter || opts.delimiter === '' ? opts.delimiter : opts.date ? '/' : opts.time ? ':' : opts.numeral ? ',' : opts.phone ? ' ' : ' ';
    target.delimiterLength = target.delimiter.length;
    target.delimiterLazyShow = !!opts.delimiterLazyShow;
    target.delimiters = opts.delimiters || [];
    target.blocks = opts.blocks || [];
    target.blocksLength = target.blocks.length;
    target.root = typeof commonjsGlobal === 'object' && commonjsGlobal ? commonjsGlobal : window;
    target.document = opts.document || target.root.document;
    target.maxLength = 0;
    target.backspace = false;
    target.result = '';

    target.onValueChanged = opts.onValueChanged || function () {};

    return target;
  }
};
var DefaultProperties_1 = DefaultProperties;
/**
 * Construct a new Cleave instance by passing the configuration object
 *
 * @param {String | HTMLElement} element
 * @param {Object} opts
 */

var Cleave = function (element, opts) {
  var owner = this;
  var hasMultipleElements = false;

  if (typeof element === 'string') {
    owner.element = document.querySelector(element);
    hasMultipleElements = document.querySelectorAll(element).length > 1;
  } else {
    if (typeof element.length !== 'undefined' && element.length > 0) {
      owner.element = element[0];
      hasMultipleElements = element.length > 1;
    } else {
      owner.element = element;
    }
  }

  if (!owner.element) {
    throw new Error('[cleave.js] Please check the element');
  }

  if (hasMultipleElements) {
    try {
      // eslint-disable-next-line
      console.warn('[cleave.js] Multiple input fields matched, cleave.js will only take the first one.');
    } catch (e) {// Old IE
    }
  }

  opts.initValue = owner.element.value;
  owner.properties = Cleave.DefaultProperties.assign({}, opts);
  owner.init();
};

Cleave.prototype = {
  init: function () {
    var owner = this,
        pps = owner.properties; // no need to use this lib

    if (!pps.numeral && !pps.phone && !pps.creditCard && !pps.time && !pps.date && pps.blocksLength === 0 && !pps.prefix) {
      owner.onInput(pps.initValue);
      return;
    }

    pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
    owner.isAndroid = Cleave.Util.isAndroid();
    owner.lastInputValue = '';
    owner.onChangeListener = owner.onChange.bind(owner);
    owner.onKeyDownListener = owner.onKeyDown.bind(owner);
    owner.onFocusListener = owner.onFocus.bind(owner);
    owner.onCutListener = owner.onCut.bind(owner);
    owner.onCopyListener = owner.onCopy.bind(owner);
    owner.initSwapHiddenInput();
    owner.element.addEventListener('input', owner.onChangeListener);
    owner.element.addEventListener('keydown', owner.onKeyDownListener);
    owner.element.addEventListener('focus', owner.onFocusListener);
    owner.element.addEventListener('cut', owner.onCutListener);
    owner.element.addEventListener('copy', owner.onCopyListener);
    owner.initPhoneFormatter();
    owner.initDateFormatter();
    owner.initTimeFormatter();
    owner.initNumeralFormatter(); // avoid touch input field if value is null
    // otherwise Firefox will add red box-shadow for <input required />

    if (pps.initValue || pps.prefix && !pps.noImmediatePrefix) {
      owner.onInput(pps.initValue);
    }
  },
  initSwapHiddenInput: function () {
    var owner = this,
        pps = owner.properties;
    if (!pps.swapHiddenInput) return;
    var inputFormatter = owner.element.cloneNode(true);
    owner.element.parentNode.insertBefore(inputFormatter, owner.element);
    owner.elementSwapHidden = owner.element;
    owner.elementSwapHidden.type = 'hidden';
    owner.element = inputFormatter;
    owner.element.id = '';
  },
  initNumeralFormatter: function () {
    var owner = this,
        pps = owner.properties;

    if (!pps.numeral) {
      return;
    }

    pps.numeralFormatter = new Cleave.NumeralFormatter(pps.numeralDecimalMark, pps.numeralIntegerScale, pps.numeralDecimalScale, pps.numeralThousandsGroupStyle, pps.numeralPositiveOnly, pps.stripLeadingZeroes, pps.prefix, pps.signBeforePrefix, pps.tailPrefix, pps.delimiter);
  },
  initTimeFormatter: function () {
    var owner = this,
        pps = owner.properties;

    if (!pps.time) {
      return;
    }

    pps.timeFormatter = new Cleave.TimeFormatter(pps.timePattern, pps.timeFormat);
    pps.blocks = pps.timeFormatter.getBlocks();
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
  },
  initDateFormatter: function () {
    var owner = this,
        pps = owner.properties;

    if (!pps.date) {
      return;
    }

    pps.dateFormatter = new Cleave.DateFormatter(pps.datePattern, pps.dateMin, pps.dateMax);
    pps.blocks = pps.dateFormatter.getBlocks();
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
  },
  initPhoneFormatter: function () {
    var owner = this,
        pps = owner.properties;

    if (!pps.phone) {
      return;
    } // Cleave.AsYouTypeFormatter should be provided by
    // external google closure lib


    try {
      pps.phoneFormatter = new Cleave.PhoneFormatter(new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode), pps.delimiter);
    } catch (ex) {
      throw new Error('[cleave.js] Please include phone-type-formatter.{country}.js lib');
    }
  },
  onKeyDown: function (event) {
    var owner = this,
        pps = owner.properties,
        charCode = event.which || event.keyCode,
        Util = Cleave.Util,
        currentValue = owner.element.value; // if we got any charCode === 8, this means, that this device correctly
    // sends backspace keys in event, so we do not need to apply any hacks

    owner.hasBackspaceSupport = owner.hasBackspaceSupport || charCode === 8;

    if (!owner.hasBackspaceSupport && Util.isAndroidBackspaceKeydown(owner.lastInputValue, currentValue)) {
      charCode = 8;
    }

    owner.lastInputValue = currentValue; // hit backspace when last character is delimiter

    var postDelimiter = Util.getPostDelimiter(currentValue, pps.delimiter, pps.delimiters);

    if (charCode === 8 && postDelimiter) {
      pps.postDelimiterBackspace = postDelimiter;
    } else {
      pps.postDelimiterBackspace = false;
    }
  },
  onChange: function () {
    this.onInput(this.element.value);
  },
  onFocus: function () {
    var owner = this,
        pps = owner.properties;

    if (pps.prefix && pps.noImmediatePrefix && !owner.element.value) {
      this.onInput(pps.prefix);
    }

    Cleave.Util.fixPrefixCursor(owner.element, pps.prefix, pps.delimiter, pps.delimiters);
  },
  onCut: function (e) {
    if (!Cleave.Util.checkFullSelection(this.element.value)) return;
    this.copyClipboardData(e);
    this.onInput('');
  },
  onCopy: function (e) {
    if (!Cleave.Util.checkFullSelection(this.element.value)) return;
    this.copyClipboardData(e);
  },
  copyClipboardData: function (e) {
    var owner = this,
        pps = owner.properties,
        Util = Cleave.Util,
        inputValue = owner.element.value,
        textToCopy = '';

    if (!pps.copyDelimiter) {
      textToCopy = Util.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
    } else {
      textToCopy = inputValue;
    }

    try {
      if (e.clipboardData) {
        e.clipboardData.setData('Text', textToCopy);
      } else {
        window.clipboardData.setData('Text', textToCopy);
      }

      e.preventDefault();
    } catch (ex) {//  empty
    }
  },
  onInput: function (value) {
    var owner = this,
        pps = owner.properties,
        Util = Cleave.Util; // case 1: delete one more character "4"
    // 1234*| -> hit backspace -> 123|
    // case 2: last character is not delimiter which is:
    // 12|34* -> hit backspace -> 1|34*
    // note: no need to apply this for numeral mode

    var postDelimiterAfter = Util.getPostDelimiter(value, pps.delimiter, pps.delimiters);

    if (!pps.numeral && pps.postDelimiterBackspace && !postDelimiterAfter) {
      value = Util.headStr(value, value.length - pps.postDelimiterBackspace.length);
    } // phone formatter


    if (pps.phone) {
      if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
        pps.result = pps.prefix + pps.phoneFormatter.format(value).slice(pps.prefix.length);
      } else {
        pps.result = pps.phoneFormatter.format(value);
      }

      owner.updateValueState();
      return;
    } // numeral formatter


    if (pps.numeral) {
      // Do not show prefix when noImmediatePrefix is specified
      // This mostly because we need to show user the native input placeholder
      if (pps.prefix && pps.noImmediatePrefix && value.length === 0) {
        pps.result = '';
      } else {
        pps.result = pps.numeralFormatter.format(value);
      }

      owner.updateValueState();
      return;
    } // date


    if (pps.date) {
      value = pps.dateFormatter.getValidatedDate(value);
    } // time


    if (pps.time) {
      value = pps.timeFormatter.getValidatedTime(value);
    } // strip delimiters


    value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters); // strip prefix

    value = Util.getPrefixStrippedValue(value, pps.prefix, pps.prefixLength, pps.result, pps.delimiter, pps.delimiters, pps.noImmediatePrefix, pps.tailPrefix, pps.signBeforePrefix); // strip non-numeric characters

    value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value; // convert case

    value = pps.uppercase ? value.toUpperCase() : value;
    value = pps.lowercase ? value.toLowerCase() : value; // prevent from showing prefix when no immediate option enabled with empty input value

    if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
      if (pps.tailPrefix) {
        value = value + pps.prefix;
      } else {
        value = pps.prefix + value;
      } // no blocks specified, no need to do formatting


      if (pps.blocksLength === 0) {
        pps.result = value;
        owner.updateValueState();
        return;
      }
    } // update credit card props


    if (pps.creditCard) {
      owner.updateCreditCardPropsByValue(value);
    } // strip over length characters


    value = Util.headStr(value, pps.maxLength); // apply blocks

    pps.result = Util.getFormattedValue(value, pps.blocks, pps.blocksLength, pps.delimiter, pps.delimiters, pps.delimiterLazyShow);
    owner.updateValueState();
  },
  updateCreditCardPropsByValue: function (value) {
    var owner = this,
        pps = owner.properties,
        Util = Cleave.Util,
        creditCardInfo; // At least one of the first 4 characters has changed

    if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
      return;
    }

    creditCardInfo = Cleave.CreditCardDetector.getInfo(value, pps.creditCardStrictMode);
    pps.blocks = creditCardInfo.blocks;
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Util.getMaxLength(pps.blocks); // credit card type changed

    if (pps.creditCardType !== creditCardInfo.type) {
      pps.creditCardType = creditCardInfo.type;
      pps.onCreditCardTypeChanged.call(owner, pps.creditCardType);
    }
  },
  updateValueState: function () {
    var owner = this,
        Util = Cleave.Util,
        pps = owner.properties;

    if (!owner.element) {
      return;
    }

    var endPos = owner.element.selectionEnd;
    var oldValue = owner.element.value;
    var newValue = pps.result;
    endPos = Util.getNextCursorPosition(endPos, oldValue, newValue, pps.delimiter, pps.delimiters); // fix Android browser type="text" input field
    // cursor not jumping issue

    if (owner.isAndroid) {
      window.setTimeout(function () {
        owner.element.value = newValue;
        Util.setSelection(owner.element, endPos, pps.document, false);
        owner.callOnValueChanged();
      }, 1);
      return;
    }

    owner.element.value = newValue;
    if (pps.swapHiddenInput) owner.elementSwapHidden.value = owner.getRawValue();
    Util.setSelection(owner.element, endPos, pps.document, false);
    owner.callOnValueChanged();
  },
  callOnValueChanged: function () {
    var owner = this,
        pps = owner.properties;
    pps.onValueChanged.call(owner, {
      target: {
        name: owner.element.name,
        value: pps.result,
        rawValue: owner.getRawValue()
      }
    });
  },
  setPhoneRegionCode: function (phoneRegionCode) {
    var owner = this,
        pps = owner.properties;
    pps.phoneRegionCode = phoneRegionCode;
    owner.initPhoneFormatter();
    owner.onChange();
  },
  setRawValue: function (value) {
    var owner = this,
        pps = owner.properties;
    value = value !== undefined && value !== null ? value.toString() : '';

    if (pps.numeral) {
      value = value.replace('.', pps.numeralDecimalMark);
    }

    pps.postDelimiterBackspace = false;
    owner.element.value = value;
    owner.onInput(value);
  },
  getRawValue: function () {
    var owner = this,
        pps = owner.properties,
        Util = Cleave.Util,
        rawValue = owner.element.value;

    if (pps.rawValueTrimPrefix) {
      rawValue = Util.getPrefixStrippedValue(rawValue, pps.prefix, pps.prefixLength, pps.result, pps.delimiter, pps.delimiters, pps.noImmediatePrefix, pps.tailPrefix, pps.signBeforePrefix);
    }

    if (pps.numeral) {
      rawValue = pps.numeralFormatter.getRawValue(rawValue);
    } else {
      rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
    }

    return rawValue;
  },
  getISOFormatDate: function () {
    var owner = this,
        pps = owner.properties;
    return pps.date ? pps.dateFormatter.getISOFormatDate() : '';
  },
  getISOFormatTime: function () {
    var owner = this,
        pps = owner.properties;
    return pps.time ? pps.timeFormatter.getISOFormatTime() : '';
  },
  getFormattedValue: function () {
    return this.element.value;
  },
  destroy: function () {
    var owner = this;
    owner.element.removeEventListener('input', owner.onChangeListener);
    owner.element.removeEventListener('keydown', owner.onKeyDownListener);
    owner.element.removeEventListener('focus', owner.onFocusListener);
    owner.element.removeEventListener('cut', owner.onCutListener);
    owner.element.removeEventListener('copy', owner.onCopyListener);
  },
  toString: function () {
    return '[Cleave Object]';
  }
};
Cleave.NumeralFormatter = NumeralFormatter_1;
Cleave.DateFormatter = DateFormatter_1;
Cleave.TimeFormatter = TimeFormatter_1;
Cleave.PhoneFormatter = PhoneFormatter_1;
Cleave.CreditCardDetector = CreditCardDetector_1;
Cleave.Util = Util_1;
Cleave.DefaultProperties = DefaultProperties_1; // for angular directive

(typeof commonjsGlobal === 'object' && commonjsGlobal ? commonjsGlobal : window)['Cleave'] = Cleave; // CommonJS

var Cleave_1 = Cleave;
var _default = Cleave_1;
exports.default = _default;
},{}],"node_modules/cleave.js/dist/addons/cleave-phone.dk.js":[function(require,module,exports) {
var global = arguments[3];
!function(){function n(n,t){var e=n.split("."),l=T;e[0]in l||!l.execScript||l.execScript("var "+e[0]);for(var r;e.length&&(r=e.shift());)e.length||void 0===t?l=l[r]?l[r]:l[r]={}:l[r]=t}function t(n,t){function e(){}e.prototype=t.prototype,n.M=t.prototype,n.prototype=new e,n.prototype.constructor=n,n.N=function(n,e,l){for(var r=Array(arguments.length-2),i=2;i<arguments.length;i++)r[i-2]=arguments[i];return t.prototype[e].apply(n,r)}}function e(n,t){null!=n&&this.a.apply(this,arguments)}function l(n){n.b=""}function r(n,t){n.sort(t||i)}function i(n,t){return n>t?1:n<t?-1:0}function a(n){var t,e=[],l=0;for(t in n)e[l++]=n[t];return e}function u(n,t){this.b=n,this.a={};for(var e=0;e<t.length;e++){var l=t[e];this.a[l.b]=l}}function o(n){return n=a(n.a),r(n,function(n,t){return n.b-t.b}),n}function s(n,t){switch(this.b=n,this.g=!!t.v,this.a=t.c,this.i=t.type,this.h=!1,this.a){case k:case J:case L:case O:case Z:case Y:case U:this.h=!0}this.f=t.defaultValue}function f(){this.a={},this.f=this.j().a,this.b=this.g=null}function p(n,t){for(var e=o(n.j()),l=0;l<e.length;l++){var r=e[l],i=r.b;if(null!=t.a[i]){n.b&&delete n.b[r.b];var a=11==r.a||10==r.a;if(r.g)for(var r=c(t,i)||[],u=0;u<r.length;u++){var s=n,f=i,h=a?r[u].clone():r[u];s.a[f]||(s.a[f]=[]),s.a[f].push(h),s.b&&delete s.b[f]}else r=c(t,i),a?(a=c(n,i))?p(a,r):b(n,i,r.clone()):b(n,i,r)}}}function c(n,t){var e=n.a[t];if(null==e)return null;if(n.g){if(!(t in n.b)){var l=n.g,r=n.f[t];if(null!=e)if(r.g){for(var i=[],a=0;a<e.length;a++)i[a]=l.b(r,e[a]);e=i}else e=l.b(r,e);return n.b[t]=e}return n.b[t]}return e}function h(n,t,e){var l=c(n,t);return n.f[t].g?l[e||0]:l}function g(n,t){var e;if(null!=n.a[t])e=h(n,t,void 0);else n:{if(e=n.f[t],void 0===e.f){var l=e.i;if(l===Boolean)e.f=!1;else if(l===Number)e.f=0;else{if(l!==String){e=new l;break n}e.f=e.h?"0":""}}e=e.f}return e}function m(n,t){return n.f[t].g?null!=n.a[t]?n.a[t].length:0:null!=n.a[t]?1:0}function b(n,t,e){n.a[t]=e,n.b&&(n.b[t]=e)}function y(n,t){var e,l=[];for(e in t)0!=e&&l.push(new s(e,t[e]));return new u(n,l)}/*

 Protocol Buffer 2 Copyright 2008 Google Inc.
 All other code copyright its respective owners.
 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
function v(){f.call(this)}function _(){f.call(this)}function d(){f.call(this)}function S(){}function w(){}function x(){}/*

 Copyright (C) 2010 The Libphonenumber Authors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
function A(){this.a={}}function N(n){return 0==n.length||an.test(n)}function j(n,t){if(null==t)return null;t=t.toUpperCase();var e=n.a[t];if(null==e){if(e=tn[t],null==e)return null;e=(new x).a(d.j(),e),n.a[t]=e}return e}function E(n){return n=nn[n],null==n?"ZZ":n[0]}function B(n){this.H=RegExp(" "),this.C="",this.m=new e,this.w="",this.i=new e,this.u=new e,this.l=!0,this.A=this.o=this.F=!1,this.G=A.b(),this.s=0,this.b=new e,this.B=!1,this.h="",this.a=new e,this.f=[],this.D=n,this.J=this.g=D(this,this.D)}function D(n,t){var e;if(null!=t&&isNaN(t)&&t.toUpperCase()in tn){if(e=j(n.G,t),null==e)throw Error("Invalid region code: "+t);e=g(e,10)}else e=0;return e=j(n.G,E(e)),null!=e?e:un}function R(n){for(var t=n.f.length,e=0;e<t;++e){var r=n.f[e],i=g(r,1);if(n.w==i)return!1;var a;a=n;var u=r,o=g(u,1);if(-1!=o.indexOf("|"))a=!1;else{o=o.replace(on,"\\d"),o=o.replace(sn,"\\d"),l(a.m);var s;s=a;var u=g(u,2),f="999999999999999".match(o)[0];f.length<s.a.b.length?s="":(s=f.replace(new RegExp(o,"g"),u),s=s.replace(RegExp("9","g")," ")),0<s.length?(a.m.a(s),a=!0):a=!1}if(a)return n.w=i,n.B=pn.test(h(r,4)),n.s=0,!0}return n.l=!1}function $(n,t){for(var e=[],l=t.length-3,r=n.f.length,i=0;i<r;++i){var a=n.f[i];0==m(a,3)?e.push(n.f[i]):(a=h(a,3,Math.min(l,m(a,3)-1)),0==t.search(a)&&e.push(n.f[i]))}n.f=e}function F(n,t){n.i.a(t);var e=t;if(rn.test(e)||1==n.i.b.length&&ln.test(e)){var r,e=t;"+"==e?(r=e,n.u.a(e)):(r=en[e],n.u.a(r),n.a.a(r)),t=r}else n.l=!1,n.F=!0;if(!n.l){if(!n.F)if(H(n)){if(P(n))return C(n)}else if(0<n.h.length&&(e=n.a.toString(),l(n.a),n.a.a(n.h),n.a.a(e),e=n.b.toString(),r=e.lastIndexOf(n.h),l(n.b),n.b.a(e.substring(0,r))),n.h!=G(n))return n.b.a(" "),C(n);return n.i.toString()}switch(n.u.b.length){case 0:case 1:case 2:return n.i.toString();case 3:if(!H(n))return n.h=G(n),M(n);n.A=!0;default:return n.A?(P(n)&&(n.A=!1),n.b.toString()+n.a.toString()):0<n.f.length?(e=q(n,t),r=I(n),0<r.length?r:($(n,n.a.toString()),R(n)?V(n):n.l?K(n,e):n.i.toString())):M(n)}}function C(n){return n.l=!0,n.A=!1,n.f=[],n.s=0,l(n.m),n.w="",M(n)}function I(n){for(var t=n.a.toString(),e=n.f.length,l=0;l<e;++l){var r=n.f[l],i=g(r,1);if(new RegExp("^(?:"+i+")$").test(t))return n.B=pn.test(h(r,4)),t=t.replace(new RegExp(i,"g"),h(r,2)),K(n,t)}return""}function K(n,t){var e=n.b.b.length;return n.B&&0<e&&" "!=n.b.toString().charAt(e-1)?n.b+" "+t:n.b+t}function M(n){var t=n.a.toString();if(3<=t.length){for(var e=n.o&&0==n.h.length&&0<m(n.g,20)?c(n.g,20)||[]:c(n.g,19)||[],l=e.length,r=0;r<l;++r){var i=e[r];0<n.h.length&&N(g(i,4))&&!h(i,6)&&null==i.a[5]||(0!=n.h.length||n.o||N(g(i,4))||h(i,6))&&fn.test(g(i,2))&&n.f.push(i)}return $(n,t),t=I(n),0<t.length?t:R(n)?V(n):n.i.toString()}return K(n,t)}function V(n){var t=n.a.toString(),e=t.length;if(0<e){for(var l="",r=0;r<e;r++)l=q(n,t.charAt(r));return n.l?K(n,l):n.i.toString()}return n.b.toString()}function G(n){var t,e=n.a.toString(),r=0;return 1!=h(n.g,10)?t=!1:(t=n.a.toString(),t="1"==t.charAt(0)&&"0"!=t.charAt(1)&&"1"!=t.charAt(1)),t?(r=1,n.b.a("1").a(" "),n.o=!0):null!=n.g.a[15]&&(t=new RegExp("^(?:"+h(n.g,15)+")"),t=e.match(t),null!=t&&null!=t[0]&&0<t[0].length&&(n.o=!0,r=t[0].length,n.b.a(e.substring(0,r)))),l(n.a),n.a.a(e.substring(r)),e.substring(0,r)}function H(n){var t=n.u.toString(),e=new RegExp("^(?:\\+|"+h(n.g,11)+")"),e=t.match(e);return null!=e&&null!=e[0]&&0<e[0].length&&(n.o=!0,e=e[0].length,l(n.a),n.a.a(t.substring(e)),l(n.b),n.b.a(t.substring(0,e)),"+"!=t.charAt(0)&&n.b.a(" "),!0)}function P(n){if(0==n.a.b.length)return!1;var t,r=new e;n:{if(t=n.a.toString(),0!=t.length&&"0"!=t.charAt(0))for(var i,a=t.length,u=1;3>=u&&u<=a;++u)if(i=parseInt(t.substring(0,u),10),i in nn){r.a(t.substring(u)),t=i;break n}t=0}return 0!=t&&(l(n.a),n.a.a(r.toString()),r=E(t),"001"==r?n.g=j(n.G,""+t):r!=n.D&&(n.g=D(n,r)),n.b.a(""+t).a(" "),n.h="",!0)}function q(n,t){var e=n.m.toString();if(0<=e.substring(n.s).search(n.H)){var r=e.search(n.H),e=e.replace(n.H,t);return l(n.m),n.m.a(e),n.s=r,e.substring(0,n.s+1)}return 1==n.f.length&&(n.l=!1),n.w="",n.i.toString()}var T=this;e.prototype.b="",e.prototype.set=function(n){this.b=""+n},e.prototype.a=function(n,t,e){if(this.b+=String(n),null!=t)for(var l=1;l<arguments.length;l++)this.b+=arguments[l];return this},e.prototype.toString=function(){return this.b};var U=1,Y=2,k=3,J=4,L=6,O=16,Z=18;f.prototype.set=function(n,t){b(this,n.b,t)},f.prototype.clone=function(){var n=new this.constructor;return n!=this&&(n.a={},n.b&&(n.b={}),p(n,this)),n},t(v,f);var z=null;t(_,f);var Q=null;t(d,f);var W=null;v.prototype.j=function(){var n=z;return n||(z=n=y(v,{0:{name:"NumberFormat",I:"i18n.phonenumbers.NumberFormat"},1:{name:"pattern",required:!0,c:9,type:String},2:{name:"format",required:!0,c:9,type:String},3:{name:"leading_digits_pattern",v:!0,c:9,type:String},4:{name:"national_prefix_formatting_rule",c:9,type:String},6:{name:"national_prefix_optional_when_formatting",c:8,defaultValue:!1,type:Boolean},5:{name:"domestic_carrier_code_formatting_rule",c:9,type:String}})),n},v.j=v.prototype.j,_.prototype.j=function(){var n=Q;return n||(Q=n=y(_,{0:{name:"PhoneNumberDesc",I:"i18n.phonenumbers.PhoneNumberDesc"},2:{name:"national_number_pattern",c:9,type:String},9:{name:"possible_length",v:!0,c:5,type:Number},10:{name:"possible_length_local_only",v:!0,c:5,type:Number},6:{name:"example_number",c:9,type:String}})),n},_.j=_.prototype.j,d.prototype.j=function(){var n=W;return n||(W=n=y(d,{0:{name:"PhoneMetadata",I:"i18n.phonenumbers.PhoneMetadata"},1:{name:"general_desc",c:11,type:_},2:{name:"fixed_line",c:11,type:_},3:{name:"mobile",c:11,type:_},4:{name:"toll_free",c:11,type:_},5:{name:"premium_rate",c:11,type:_},6:{name:"shared_cost",c:11,type:_},7:{name:"personal_number",c:11,type:_},8:{name:"voip",c:11,type:_},21:{name:"pager",c:11,type:_},25:{name:"uan",c:11,type:_},27:{name:"emergency",c:11,type:_},28:{name:"voicemail",c:11,type:_},29:{name:"short_code",c:11,type:_},30:{name:"standard_rate",c:11,type:_},31:{name:"carrier_specific",c:11,type:_},33:{name:"sms_services",c:11,type:_},24:{name:"no_international_dialling",c:11,type:_},9:{name:"id",required:!0,c:9,type:String},10:{name:"country_code",c:5,type:Number},11:{name:"international_prefix",c:9,type:String},17:{name:"preferred_international_prefix",c:9,type:String},12:{name:"national_prefix",c:9,type:String},13:{name:"preferred_extn_prefix",c:9,type:String},15:{name:"national_prefix_for_parsing",c:9,type:String},16:{name:"national_prefix_transform_rule",c:9,type:String},18:{name:"same_mobile_and_fixed_line_pattern",c:8,defaultValue:!1,type:Boolean},19:{name:"number_format",v:!0,c:11,type:v},20:{name:"intl_number_format",v:!0,c:11,type:v},22:{name:"main_country_for_code",c:8,defaultValue:!1,type:Boolean},23:{name:"leading_digits",c:9,type:String},26:{name:"leading_zero_possible",c:8,defaultValue:!1,type:Boolean}})),n},d.j=d.prototype.j,S.prototype.a=function(n){throw new n.b,Error("Unimplemented")},S.prototype.b=function(n,t){if(11==n.a||10==n.a)return t instanceof f?t:this.a(n.i.prototype.j(),t);if(14==n.a){if("string"==typeof t&&X.test(t)){var e=Number(t);if(0<e)return e}return t}if(!n.h)return t;if(e=n.i,e===String){if("number"==typeof t)return String(t)}else if(e===Number&&"string"==typeof t&&("Infinity"===t||"-Infinity"===t||"NaN"===t||X.test(t)))return Number(t);return t};var X=/^-?[0-9]+$/;t(w,S),w.prototype.a=function(n,t){var e=new n.b;return e.g=this,e.a=t,e.b={},e},t(x,w),x.prototype.b=function(n,t){return 8==n.a?!!t:S.prototype.b.apply(this,arguments)},x.prototype.a=function(n,t){return x.M.a.call(this,n,t)};/*

 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
var nn={45:["DK"]},tn={DK:[null,[null,null,"[2-9]\\d{7}",null,null,null,null,null,null,[8]],[null,null,"(?:[2-7]\\d|8[126-9]|9[1-36-9])\\d{6}",null,null,null,"32123456"],[null,null,"(?:[2-7]\\d|8[126-9]|9[1-36-9])\\d{6}",null,null,null,"32123456"],[null,null,"80\\d{6}",null,null,null,"80123456"],[null,null,"90\\d{6}",null,null,null,"90123456"],[null,null,null,null,null,null,null,null,null,[-1]],[null,null,null,null,null,null,null,null,null,[-1]],[null,null,null,null,null,null,null,null,null,[-1]],"DK",45,"00",null,null,null,null,null,null,1,[[null,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[2-9]"]]],null,[null,null,null,null,null,null,null,null,null,[-1]],null,null,[null,null,null,null,null,null,null,null,null,[-1]],[null,null,null,null,null,null,null,null,null,[-1]],null,null,[null,null,null,null,null,null,null,null,null,[-1]]]};A.b=function(){return A.a?A.a:A.a=new A};var en={0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9","０":"0","１":"1","２":"2","３":"3","４":"4","５":"5","６":"6","７":"7","８":"8","９":"9","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9"},ln=RegExp("[+＋]+"),rn=RegExp("([0-9０-９٠-٩۰-۹])"),an=/^\(?\$1\)?$/,un=new d;b(un,11,"NA");var on=/\[([^\[\]])*\]/g,sn=/\d(?=[^,}][^,}])/g,fn=RegExp("^[-x‐-―−ー－-／  ­​⁠　()（）［］.\\[\\]/~⁓∼～]*(\\$\\d[-x‐-―−ー－-／  ­​⁠　()（）［］.\\[\\]/~⁓∼～]*)+$"),pn=/[- ]/;B.prototype.K=function(){this.C="",l(this.i),l(this.u),l(this.m),this.s=0,this.w="",l(this.b),this.h="",l(this.a),this.l=!0,this.A=this.o=this.F=!1,this.f=[],this.B=!1,this.g!=this.J&&(this.g=D(this,this.D))},B.prototype.L=function(n){return this.C=F(this,n)},n("Cleave.AsYouTypeFormatter",B),n("Cleave.AsYouTypeFormatter.prototype.inputDigit",B.prototype.L),n("Cleave.AsYouTypeFormatter.prototype.clear",B.prototype.K)}.call("object"==typeof global&&global?global:window);
},{}],"script.js":[function(require,module,exports) {
"use strict";
"use strcict";

var _is_js = _interopRequireDefault(require("is_js"));

var _cleave = _interopRequireDefault(require("cleave.js"));

require("cleave.js/dist/addons/cleave-phone.dk");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_is_js.default.firefox()) {
  console.log("😈");
} else {
  console.log("🤖");
} //import { firefox } from "is_js";   //import a specific module
// if (firefox()) {
//   console.log("😈");
// } else {
//   console.log("🤖");
// }


var cleave = new _cleave.default("#testInput", {
  phone: true,
  phoneRegionCode: "DK"
});
var cleave = new _cleave.default("#card", {
  creditCard: true,
  onCreditCardTypeChanged: function onCreditCardTypeChanged(input) {
    console.log("fire card input");
  }
});
},{"is_js":"node_modules/is_js/is.js","cleave.js":"node_modules/cleave.js/dist/cleave-esm.js","cleave.js/dist/addons/cleave-phone.dk":"node_modules/cleave.js/dist/addons/cleave-phone.dk.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55328" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map