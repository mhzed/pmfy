pmfy
--------

Turns an async nodejs function into a ES6 Promise using terse ES6 syntax.

The function should:

* Have callback as last parameter
* Callback takes (err, ...results) as parameters

** Examples

Promisify a context free function:

    const pmfy = require('pmfy');
    const stat = pmfy(fs.stat);
    stat("file").then( (fstat)=> ... );
    
Promisify a function with 'this':

    const pmfy = require('pmfy');
    const fn = pmfy(myobj.mymethod, myobj);
    fn("file", 1).then( ()=> ... );
    
Use it with "co" module for async looping:

    const pmfy = require('pmfy');
    const co = require("co");
    const stat = pmfy(fs.stat);
    co(function* statFiles() {
      for (const file of ['file1', 'file2']) {
        console.log(yield stat(file));  // prints out stat object
      }
    }).then(()=>..);

You can also promisify an entire package, example:

    const pmfy = require('pmfy');
    const fse = pmfy(require('fs-extra'));
    
    fse.emptyDir('./dir').then(...);

When promisifying a package, it's assumed that all functions with name not ending in 'Sync' are async
functions.