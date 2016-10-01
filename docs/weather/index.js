'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.4.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _library = false;

var global$2 = _global;
var SHARED = '__core-js_shared__';
var store = global$2[SHARED] || (global$2[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks'),
    uid = _uid,
    Symbol = _global.Symbol,
    USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
});

var f = _wks;

var _wksExt = {
	f: f
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var isObject = _isObject;
var _anObject = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () {
      return 7;
    } }).a != 7;
});

var isObject$1 = _isObject;
var document$1 = _global.document;
var is = isObject$1(document$1) && isObject$1(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () {
      return 7;
    } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject$2 = _isObject;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!isObject$2(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject$2(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var anObject = _anObject;
var IE8_DOM_DEFINE = _ie8DomDefine;
var toPrimitive = _toPrimitive;
var dP = Object.defineProperty;

var f$1 = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f$1
};

var global$1 = _global;
var core = _core;
var LIBRARY = _library;
var wksExt = _wksExt;
var defineProperty$1 = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global$1.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty$1($Symbol, name, { value: wksExt.f(name) });
};

_wksDefine('asyncIterator');

var asyncIterator = function (iterable) {
  if (typeof Symbol === "function") {
    if (Symbol.asyncIterator) {
      var method = iterable[Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (Symbol.iterator) {
      return iterable[Symbol.iterator]();
    }
  }

  throw new TypeError("Object is not async iterable");
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};











var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

let asyncIteratorNext = (() => {
    var _ref4 = asyncToGenerator(function* (iterator) {
        const item = yield iterator.next();
        const value = yield item.value;
        return _extends({}, item, { value });
    });

    return function asyncIteratorNext(_x6) {
        return _ref4.apply(this, arguments);
    };
})();

function listenTo(element, event) {
    let resolve = null;
    const listener = event => {
        if (resolve) resolve({ done: false, value: event });
    };

    element.addEventListener(event, listener);

    return {
        [Symbol.asyncIterator]() {
            return this;
        },

        next() {
            return new Promise(resolve_ => resolve = resolve_);
        },

        return() {
            element.removeEventListener(event, listener);
        }
    };
}

let map = (() => {
    var _ref = asyncGenerator.wrap(function* (fn, iterator) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = asyncIterator(iterator), _step, _value; _step = yield asyncGenerator.await(_iterator.next()), _iteratorNormalCompletion = _step.done, _value = yield asyncGenerator.await(_step.value), !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
                const value = _value;
                yield fn(value);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    yield asyncGenerator.await(_iterator.return());
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    });

    return function map(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

let filter = (() => {
    var _ref2 = asyncGenerator.wrap(function* (fn, iterator) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = asyncIterator(iterator), _step2, _value2; _step2 = yield asyncGenerator.await(_iterator2.next()), _iteratorNormalCompletion2 = _step2.done, _value2 = yield asyncGenerator.await(_step2.value), !_iteratorNormalCompletion2; _iteratorNormalCompletion2 = true) {
                const value = _value2;
                if (fn(value)) yield value;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    yield asyncGenerator.await(_iterator2.return());
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    });

    return function filter(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

let fromPromise = (() => {
    var _ref3 = asyncGenerator.wrap(function* (promise) {
        yield yield asyncGenerator.await(promise);
    });

    return function fromPromise(_x5) {
        return _ref3.apply(this, arguments);
    };
})();

function select(...iterators) {
    const STOP = 0,
          RUN = 1,
          END = 2;
    const states = iterators.map(() => STOP);
    const pendingValues = [];
    let resolved, resolve, reject;

    function run(iterator, index) {
        if (states[index] !== STOP) return;

        states[index] = RUN;
        asyncIteratorNext(iterator).then(item => {
            states[index] = item.done ? END : STOP;
            const newValue = _extends({ index }, item);
            if (resolved) {
                pendingValues.push(newValue);
            } else {
                resolved = true;
                resolve({ value: [newValue], done: false });
            }
        }, error => {
            states[index] = END;
            resolved = true;
            reject(error);
        });
    }

    return {
        [Symbol.asyncIterator]() {
            return this;
        },

        next() {
            if (pendingValues.length) {
                const value = pendingValues.slice();
                pendingValues.length = 0;
                return Promise.resolve({ value, done: false });
            }

            if (states.every(s => s === END)) {
                return Promise.resolve({ done: true });
            }

            return new Promise((resolve_, reject_) => {
                resolved = false;
                resolve = resolve_;
                reject = reject_;

                iterators.forEach(run);
            });
        },

        return() {
            for (const iterator of iterators) iterator.return();
            return { done: true };
        }
    };
}

let withLatestFrom = (() => {
    var _ref5 = asyncGenerator.wrap(function* (iterator, fromIterator) {
        let latest;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = asyncIterator(select(iterator, fromIterator)), _step3, _value3; _step3 = yield asyncGenerator.await(_iterator3.next()), _iteratorNormalCompletion3 = _step3.done, _value3 = yield asyncGenerator.await(_step3.value), !_iteratorNormalCompletion3; _iteratorNormalCompletion3 = true) {
                const items = _value3;

                for (const item of items) {
                    if (item.index === 0) {
                        if (item.done) return;
                        yield [item.value, latest];
                    } else if (!item.done) {
                        latest = item.value;
                    }
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    yield asyncGenerator.await(_iterator3.return());
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    });

    return function withLatestFrom(_x7, _x8) {
        return _ref5.apply(this, arguments);
    };
})();

let flatMap = (() => {
    var _ref6 = asyncGenerator.wrap(function* (fn, iterator) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = asyncIterator(iterator), _step4, _value4; _step4 = yield asyncGenerator.await(_iterator4.next()), _iteratorNormalCompletion4 = _step4.done, _value4 = yield asyncGenerator.await(_step4.value), !_iteratorNormalCompletion4; _iteratorNormalCompletion4 = true) {
                const value = _value4;

                // yield* await fn(value)
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = asyncIterator(fn(value)), _step5, _value5; _step5 = yield asyncGenerator.await(_iterator5.next()), _iteratorNormalCompletion5 = _step5.done, _value5 = yield asyncGenerator.await(_step5.value), !_iteratorNormalCompletion5; _iteratorNormalCompletion5 = true) {
                        const transformed = _value5;

                        yield transformed;
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            yield asyncGenerator.await(_iterator5.return());
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    yield asyncGenerator.await(_iterator4.return());
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
    });

    return function flatMap(_x9, _x10) {
        return _ref6.apply(this, arguments);
    };
})();

let distinct = (() => {
    var _ref7 = asyncGenerator.wrap(function* (iterator) {
        const pastValues = new Set();
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = asyncIterator(iterator), _step6, _value6; _step6 = yield asyncGenerator.await(_iterator6.next()), _iteratorNormalCompletion6 = _step6.done, _value6 = yield asyncGenerator.await(_step6.value), !_iteratorNormalCompletion6; _iteratorNormalCompletion6 = true) {
                const value = _value6;

                if (pastValues.has(value)) continue;
                pastValues.add(value);
                yield value;
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    yield asyncGenerator.await(_iterator6.return());
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }
    });

    return function distinct(_x11) {
        return _ref7.apply(this, arguments);
    };
})();

function sleep(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

let interval = (() => {
    var _ref8 = asyncGenerator.wrap(function* (ms) {
        for (let i = 0; true; i++) yield sleep(ms);
    });

    return function interval(_x12) {
        return _ref8.apply(this, arguments);
    };
})();

class Replayable {
    constructor(source) {
        this._source = source;
        this._values = [];
    }

    [Symbol.asyncIterator]() {
        return this;
    }

    next() {
        return asyncIteratorNext(this._source).then(item => {
            if (!item.done) this._values.push(item.value);
            return item;
        });
    }

    return() {
        return this._source.return();
    }

    replay() {
        return this._values[Symbol.iterator]();
    }
}

let getTemperature = (() => {
    var _ref = asyncToGenerator(function* (zip) {
        return { main: { temp: Math.round(Math.random() * 100), zip } };
        // const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${zip},us&units=imperial&appid=APPID`)
        // return res.json()
    });

    return function getTemperature(_x) {
        return _ref.apply(this, arguments);
    };
})();

// Grab HTML elements


let buildNewLocations = (() => {
    var _ref2 = asyncToGenerator(function* (zipcodeStream) {
        const stream = flatMap(zipTemperatureStreamFactory, zipcodeStream);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = asyncIterator(stream), _step, _value; _step = yield _iterator.next(), _iteratorNormalCompletion = _step.done, _value = yield _step.value, !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
                const { zip, temp } = _value;

                const locationEle = document.createElement("div");
                locationEle.id = `zip-${ zip }`;
                locationEle.classList.add("location");

                const zipEle = document.createElement("p");
                zipEle.classList.add("zip");
                zipEle.innerText = zip;

                const tempEle = document.createElement("p");
                tempEle.classList.add("temp");
                tempEle.innerHTML = `${ temp }&deg;F`;

                locationEle.appendChild(zipEle);
                locationEle.appendChild(tempEle);
                appContainer.appendChild(locationEle);

                zipcodeInput.value = "";
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    yield _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    });

    return function buildNewLocations(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

let updateWeather = (() => {
    var _ref3 = asyncToGenerator(function* (zipcodeStream) {
        const stream = flatMap(zipTemperatureStreamFactory, flatMap(function () {
            return zipcodeStream.replay();
        }, interval(2000)));

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = asyncIterator(stream), _step2, _value2; _step2 = yield _iterator2.next(), _iteratorNormalCompletion2 = _step2.done, _value2 = yield _step2.value, !_iteratorNormalCompletion2; _iteratorNormalCompletion2 = true) {
                const { zip, temp } = _value2;

                console.log("Updating!", zip, temp);

                const locationEle = document.getElementById(`zip-${ zip }`);
                const tempEle = locationEle.querySelector(".temp");

                tempEle.innerHTML = `${ temp }&deg;F`;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    yield _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    });

    return function updateWeather(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

let runApp = (() => {
    var _ref4 = asyncToGenerator(function* () {
        const zipInputStream = filter(function (zip) {
            return zip.length === 5;
        }, map(function (e) {
            return e.target.value;
        }, listenTo(zipcodeInput, "keyup")));

        const btnClickStream = listenTo(addLocationBtn, "click");

        const zipcodeStream = new Replayable(distinct(map(function ([_, zip]) {
            return zip;
        }, withLatestFrom(btnClickStream, zipInputStream))));

        yield Promise.all([buildNewLocations(zipcodeStream), updateWeather(zipcodeStream)]);
    });

    return function runApp() {
        return _ref4.apply(this, arguments);
    };
})();

const appContainer = document.getElementById("app-container");
const zipcodeInput = document.getElementById("zipcode-input");
const addLocationBtn = document.getElementById("add-location");

function zipTemperatureStreamFactory(zip) {
    return map(({ main: { temp } }) => ({ temp, zip }), fromPromise(getTemperature(zip)));
}

runApp().then(() => console.log("FINISHED")).catch(e => console.error(e.stack || String(e)));
