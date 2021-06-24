const _ = require('lodash');

/**
 * Find difference between two objects
 * Does not factor in nested objects
 * @param {*} val1 
 * @param {*} val2 
 * @returns {[{}]} array of object changes
 */
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