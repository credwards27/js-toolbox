/* immutable.js
    
    Helper function to simplify making object properties immutable.
*/

/* Makes one or more object properties immutable. This is a wrapper around
    Object.defineProperty() that sets 'writable' and 'configurable' to false for
    each given property.
    
    obj - Object containing the properties.
    ...props - One or more properties to make immutable. Either of the following
        are supported, invalid arguments will be skipped:
        
        <string|number> Existing property on the object to be made immutable
            with its current value. If the property does not already exist, it
            will be created and set to undefined.
        
        <object> Property initializer object:
            
            name - Property name string or number.
            value - Optional property value to set before making immutable. If
                omitted, the current property value will be used. If omitted and
                the property does not exist on the object, it will be created
                and set to undefined.
*/
export default (obj, ...props) => {
    let opts = {
        writable: false,
        configurable: false
    };
    
    for (let i=0, l=props.length; i<l; ++i) {
        let prop = props[i];
        
        if (typeof prop === "object") {
            for (let k in prop) {
                if (!prop.hasOwnProperty(k)) { continue; }
                
                opts.value = prop[k];
                Object.defineProperty(obj, k, opts);
            }
            
            continue;
        }
        
        // Use existing value
        opts.value = obj[prop];
        Object.defineProperty(obj, prop, opts);
    }
};
