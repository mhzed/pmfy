
let pmfyFunc = function(fn, ctx) {
  return function(...fargs) {
    if (!(ctx === undefined || ctx === null)) fn = fn.bind(ctx);
    return new Promise((res, rej) => {
      fn(...fargs, (err, data)=> {
        if (err) rej(err);
        else res(data);
      })
    });
  }
}

let pmfyAuto = function(p, ctx) {
  "use strict";
  if (p instanceof Function) return pmfyFunc(p, ctx);
  else if (p instanceof Object) {
    for (let k in p) {
      if (!/Sync$/.test(k) && p[k] instanceof Function) {
        p[k] = pmfyFunc(p[k]);
      }
    }
    return p;
  }
  else return undefined;
}

module.exports = pmfyAuto
