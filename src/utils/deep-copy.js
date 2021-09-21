/* deep-copy.js
    
    Recursively deep-copies an object's properties into a new or existing
    object.
*/

/* Recursively copies a plain object into another object. Custom classes should
    implement their own copy/clone logic to properly deal with constructors.
    
    source - Source object to copy.
    target - Target object into which to copy the source object's properties. If
        omitted, the source object will be copied into a new object.
*/
function copy(source, target) {
    target = typeof target === "object" ? target : {};
    
    if (!source || typeof source !== "object") {
        return source;
    }
    
    // Source is an object, handle it accordingly
    if (source instanceof Array) {
        // Copy source as an array
        target = [];
        
        for (let i=0, l=source.length; i<l; ++i) {
            target.push(copy(source[i]));
        }
        
        return target;
    }
    
    // Copy as plain object
    for (let k in source) {
        if (!source.hasOwnProperty(k)) { continue; }
        
        target[k] = copy(source[k]);
    }
    
    return target;
}

export default copy;
