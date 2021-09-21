/* dispatch.js
    
    Custom event dispatch helper.
*/

/* Dispatches a custom event with optional data.
    
    elem - Element from which to dispatch the event.
    
    type - Event type string.
    
    opts - EventInit options. This also supports a boolean 'async' option. If
        true, the event will be dispatched on the next tick (called from an
        immediately-resolved promise).
        
        NOTE: The default EventInit options are different from the native
        Event options:
            
            bubbles - Defaults to true.
            cancelable - Defaults to true.
            composed - Default matches native (false).
    
    data - Optional data to include with the event.
*/
export default function(elem, type, opts, data) {
    if (!type || typeof type !== "string") {
        throw new Error("Event type must be a non-empty string.");
    }
    
    opts = (opts && typeof opts === "object") ? opts : {};
    
    let eventInit = {
        detail: data,
        bubbles: true,
        cancelable: true
    },
        keys = [ "bubbles", "cancelable", "composed" ],
        isAsync = !!opts.async,
        event;
    
    // Apply event options
    for (let i=0, l=keys.length; i<l; ++i) {
        let k = keys[i];
        
        opts.hasOwnProperty(k) && (eventInit[k] = opts[k]);
    }
    
    // Create and dispatch the event
    event = new CustomEvent(type, eventInit);
    
    if (isAsync) {
        new Promise((res) => {
            elem.dispatchEvent(event);
            res();
        });
    }
    else {
        elem.dispatchEvent(event);
    }
};
