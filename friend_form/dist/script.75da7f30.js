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
})({"modules/vars.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validForm = exports.formElms = exports.elms = exports.pattern = exports.form = exports.apiKey = exports.endpoint = void 0;
var endpoint = "https://frontendspring20-e4cd.restdb.io/rest/friends";
exports.endpoint = endpoint;
var apiKey = "5e956ffd436377171a0c230f";
exports.apiKey = apiKey;
var form = document.querySelector("form");
exports.form = form;
var pattern = document.querySelector("template").content;
exports.pattern = pattern;
var elms = form.elements;
exports.elms = elms;
var formElms = form.querySelectorAll("input");
exports.formElms = formElms;
var validForm = true;
exports.validForm = validForm;
},{}],"script.js":[function(require,module,exports) {
"use strict";

var _vars = require("./modules/vars");

window.addEventListener("DOMContentLoaded", start);

function start() {
  document.querySelector(".add").addEventListener("click", function (evt) {
    _vars.form.classList.remove("hidden");

    document.querySelector("main").classList.add("blurBg");
  });
  document.querySelector(".cancel").addEventListener("click", function () {
    _vars.form.classList.add("hidden");

    document.querySelector("main").classList.remove("blurBg");
  });

  _vars.form.setAttribute("novalidate", true);

  checkInfo();
  autoFillInfo();
  get();
}

function checkInfo() {
  _vars.form.addEventListener("submit", function (evt) {
    evt.preventDefault(); //turn off validation on submit

    _vars.formElms.forEach(function (elm) {
      elm.classList.remove("invalid");
    });

    if (_vars.form.checkValidity() && validForm) {
      //send data
      post({
        first_name: _vars.elms.fstname.value,
        last_name: _vars.elms.lstname.value,
        age: _vars.elms.age.value,
        email: _vars.elms.email.value
      });

      _vars.form.classList.add("hidden");

      _vars.form.reset();
    } else {
      //loop validity
      _vars.formElms.forEach(function (elm) {
        elm.classList.remove("invalid");

        if (!elm.checkValidity()) {
          elm.classList.add("invalid");
        }
      });
    }
  });
}

function autoFillInfo() {
  _vars.elms.unknownDOB.addEventListener("click", function (evt) {
    _vars.elms.dob.disabled = !_vars.elms.dob.disabled;
    _vars.elms.age.disabled = !_vars.elms.age.disabled;
  });

  _vars.elms.dob.addEventListener("change", function (e) {
    var ageStr = _vars.elms.dob.value;
    var ageNum = parseInt(ageStr);
    var currentYr = 2020;
    _vars.elms.age.value = currentYr - ageNum;
  });
}

function get() {
  document.querySelector("main").innerHTML = "";
  fetch(_vars.endpoint, {
    method: "get",
    headers: {
      accept: "application/json",
      "x-apikey": _vars.apiKey,
      "cache-control": "no-cache"
    }
  }).then(function (e) {
    return e.json();
  }).then(showData);
}

function showData(e) {
  e.forEach(showFriends);
}

function showFriends(friend) {
  var display = document.querySelector("main");

  var clone = _vars.pattern.cloneNode(true);

  clone.querySelector(".first").textContent = friend.first_name;
  clone.querySelector(".last").textContent = friend.last_name;
  clone.querySelector(".email").textContent = friend.email;
  clone.querySelector(".age").textContent = friend.age; //clone.querySelector("button").dataset.id = friend._id;

  clone.querySelectorAll("article, button[data-action=\"delete\"]").forEach(function (elm) {
    return elm.dataset.id = friend._id;
  });
  clone.querySelector("[data-action=\"delete\"]").addEventListener("click", function (elm) {
    return deleteAFriend(friend._id);
  });
  display.appendChild(clone);
}

function post(data) {
  var postData = JSON.stringify(data);
  fetch(_vars.endpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": _vars.apiKey,
      "cache-control": "no-cache"
    },
    body: postData
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    return showFriends(data);
  });
}

function deleteAFriend(id) {
  document.querySelector("article[data-id=\"".concat(id, "\"]")).remove();
  fetch("".concat(_vars.endpoint, "/").concat(id), {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": _vars.apiKey,
      "cache-control": "no-cache"
    }
  }).then(function (res) {
    return res.json();
  }).then(function (data) {});
}
},{"./modules/vars":"modules/vars.js"}],"../../../../../../../../.npm-global/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52256" + '/');

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
},{}]},{},["../../../../../../../../.npm-global/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map