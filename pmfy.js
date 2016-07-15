
let future = require("phuture");

let pmfyFunc = function(fn, ctx) {
  return function(...fargs) {
    if (!(ctx === undefined || ctx === null)) fn = fn.bind(ctx);
    return new Promise((res, rej) => {
      try {
        fn(...fargs, (err, ...data)=> {
          if (err) rej(err);
          else {
            // if resolve multiple parameters, bundle as one array
            if (data.length == 1) res(data[0]);
            else res(data);
          }
        })
      } catch (e) {
        rej(e);
      }
    });
  }
}

let pmfyAuto = function(p, ctx) {
  "use strict";
  if (p instanceof Function) return pmfyFunc(p, ctx);
  else if (p instanceof Object) {
    let ret = {};
    for (let k in p) {
      if (!/Sync$/.test(k) && p[k] instanceof Function) {
        ret[k] = pmfyFunc(p[k], ctx);
      } else ret[k] = p[k];
    }
    return ret;
  }
  else return undefined;
}

pmfyAuto.timeOut = function(mswait, fn, ctx) {
  return function(...fargs) {
    if (!(ctx === undefined || ctx === null)) fn = fn.bind(ctx);
    return new Promise((res, rej) => {

      let once = false;
      let task;
      const checkOnce = ()=>{
        if (!once) {
          once = true;
          if (task) task.cancel();
          return true;
        } else return false;
      }

      if (mswait > 0)
        task = future.once(mswait, ()=>{
          if (checkOnce()) {
            rej(new Error('Timed out after ' + mswait + 'ms'));
          }
        })

      try {
        fn(...fargs, (err, ...data)=> {
          if (checkOnce()) {

            if (err) rej(err);
            else {
              // if resolve multiple parameters, bundle as one array
              if (data.length == 1) res(data[0]);
              else res(data);
            }
          }
        })
      } catch (e) {
        if (checkOnce()) {
          rej(e);
        }
      }
    });
  }
}

module.exports = pmfyAuto
