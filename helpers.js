const _ = require('lodash');


// function mergeArrays(val1, val2) {
//     var results = val1.splice(0);
//     console.log('mergeArray init', results)
//     val2.forEach((val) => {
//       if (val1.indexOf(val) < 0) {
//         results.push(val);
//       }
//     });
//     console.log('mergeArray Results', results)
//     return results;
//   }
// will not work for nested objects. Need to improve.
exports.findDiff = function diff(val1, val2) {
    var results  = [];
    var origKeys = Object.keys(val1);
    var newKeys  = Object.keys(val2);
    // console.log('newKeys', newKeys)
    // console.log('origKeys', origKeys)
    _.merge(origKeys, newKeys)
      .forEach((key) => {
        console.log(key)

        if (val1[key].toString() === val2[key].toString()) { return; }
        console.log(key)
        var result = {
          key:   key,
          orig:  val1[key],
          update: val2[key]
        };
        // console.log('----------------------------------------------------')
   
        // console.log('1) ', val1[key])
        // console.log('2) ', val2[key])
        console.log('----------------------------------------------------')
        // console.log('----------------------------------------------------')
        if (val1[key] == null) {
           result.type = 'add';
        } else if (val2[key] == null) {
          result.type = 'delete';
        } else {
          result.type = 'change';
        }
        results.push(result);
      });
    return results;
}