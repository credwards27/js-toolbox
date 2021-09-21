/* ready.js
    
    Assigns handlers to run when the HTML document has finished loading.
*/

// Dependencies.
import DataMap from "#lib/class/data-map";

// Global data map.
const dataMap = new DataMap();

/* Executes a callback when a given document object has finished loading, or on
    the next tick if the document has already loaded.
    
    d - Document object to listen to.
    cb - Callback to run when the document has loaded.
        
        [this] - The document object that triggered the callback.
*/
export default (d, cb) => {
    let data = dataMap.get(d);
    
    // Initialize data for the document if necessary
    if (!data.hasOwnProperty("listener")) {
        dataMap.set(d, {
            listener: false,
            callbacks: []
        });
    }
    
    if (!data.listener) {
        data.listener = true;
        
        // Add event listener for the document
        d.addEventListener("DOMContentLoaded", () => {
            let callbacks = dataMap.get(d, "callbacks");
            
            while (callbacks.length) {
                callbacks.pop().call(d);
            }
            
            dataMap.remove(d, "callbacks");
        });
    }
    
    // Run the callback if document has already finished loading, or enqueue the
    // callback
    switch (d.readyState) {
        case "complete":
        case "interactive":
            new Promise((res) => {
                cb.call(d);
                res();
            });
            
            break;
        
        default:
            typeof cb === "function" && dataMap.get(d, "callbacks").push(cb);
    }
};
