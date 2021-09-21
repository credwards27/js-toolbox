/* data-map.js
    
    Wrapper class for WeakMap data storage with common boilerplate and
    convenience methods.
*/

/* Wrapper class for WeakMap data storage with common boilerplate and
    convenience methods.
*/
export default class DataMap {
    //
    // STATIC PROPERTIES
    //
    
    //
    // PROPERTIES
    //
    
    // Internal WeakMap object.
    _map = null;
    
    /* Constructor for DataMap.
    */
    constructor() {
        this._map = new WeakMap();
    }
    
    /* Destructor for DataMap.
    */
    destroy() {
        this._map = null;
    }
    
    //
    // STATIC METHODS
    //
    
    //
    // METHODS
    //
    
    /* Initializes data storage for an object.
        
        obj - Object object to initialize in the data storage map.
        reset - True to reset all data for the object, regardless of whether or not
            there is already data associated with it.
        
        Returns the data set for the object.
    */
    init(obj, reset) {
        if (reset || !this._map.has(obj)) {
            this._map.delete(obj);
            this._map.set(obj, {});
        }
        
        return this._map.get(obj);
    }
    
    /* Gets arbitrary data for and object.
        
        obj - Object for which to retrieve data value.
        key - Specific key/value key to retrieve. If omitted, the entire data set
            associated with the object will be returned.
        
        Value associated with the given object and key, or full data object
        associated with the object.
    */
    get(obj, key) {
        let data = this.init(obj);
        
        switch (typeof key) {
            case "string":
            case "number":
                return data[key];
        }
        
        return data;
    }
    
    /* Sets arbitrary data key/value pairs for an object.
        
        obj - Object to which to set data.
        key - Data key, or an object containing one or more key/value pairs.
        val - Data value, or ignored if key is an object.
        
        Returns the object.
    */
    set(obj, key, val) {
        let data = this.init(obj);
        
        switch (true) {
            // 3 arguments
            case typeof key === "string":
            case typeof key === "number":
                // Fall through
                data[key] = val;
            
            // Invalid data format
            case !key:
            case typeof key !== "object":
                return obj;
        }
        
        // 2 arguments
        for (let k in key) {
            if (!key.hasOwnProperty(k)) { continue; }
            
            data[k] = key[k];
        }
        
        return obj;
    }
    
    /* Removes associated data from an object.
        
        obj - Object from which to remove data.
        ...keys - One or more data keys to remove. If omitted, all data key/value
            pairs will be removed from the object.
        
        Returns the object.
    */
    remove(obj, ...keys) {
        // Reset the entire data set for the object if no keys provided
        if (!keys.length) {
            this.init(obj, true);
            return obj;
        }
        
        let data = this.init(obj);
        
        for (let i=0, l=keys.length; i<l; ++i) {
            let key = keys[i];
            
            switch (typeof key) {
                case "string":
                case "number":
                    delete data[key];
                    break;
            }
        }
        
        return obj;
    }
}
