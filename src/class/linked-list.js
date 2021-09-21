/* linked-list.js
    
    Reversible, doubly-linked list object.
*/

/* Reversible, doubly-linked list object.
*/
class LinkedList {
    //
    // STATIC PROPERTIES
    //
    
    //
    // PROPERTIES
    //
    
    // Head node.
    _head = null;
    
    // Tail node.
    _tail = null;
    
    // Next item property name.
    _next = "next";
    
    // Previous item property name.
    _prev = "prev";
    
    // Starting node property name.
    _start = "_head";
    
    // Ending node property name.
    _end = "_tail";
    
    /* Constructor for LinkedList.
        
        ...items - Optional initial items to add to the list.
    */
    constructor(...items) {
        this._tail = new Node(this);
        this._head = new Node(this);
        
        this._head.next = this._tail;
        this._tail.prev = this._head;
        
        lock(this, "_head", "_tail");
        lock(this._head, "_list", "_data");
        lock(this._tail, "_list", "_data");
        
        this.push(...items);
    }
    
    /* Destructor for LinkedList.
        
        cb - See LinkedList.removeAll().
    */
    destroy(cb) {
        this.removeAll(cb);
    }
    
    //
    // STATIC METHODS
    //
    
    /* Checks whether or not a value is a Node object.
        
        val - Arbitrary data to check.
        
        Returns true if the specified value is a LinkedList Node object, false
        otherwise.
    */
    static isNode(val) {
        return val instanceof Node;
    }
    
    //
    // METHODS
    //
    
    /* Getter for _head.
        
        Returns the head node.
    */
    get head() {
        return this._head;
    }
    
    /* Setter for _head.
        
        node - Unused.
    */
    set head(node) {
        throw new Error("Cannot reassign head node.");
    }
    
    /* Getter for _tail.
        
        Returns the tail node.
    */
    get tail() {
        return this._tail;
    }
    
    /* Setter for _tail.
        
        node - Unused.
    */
    set tail(node) {
        throw new Error("Cannot reassign tail node.");
    }
    
    /* Getter for _next.
        
        Returns the 'next' directional property based on the list's current
        forward/reverse state.
    */
    get next() {
        return this._next;
    }
    
    /* Getter for _prev.
        
        Returns the 'prev' directional property based on the list's current
        forward/reverse state.
    */
    get prev() {
        return this._prev;
    }
    
    /* Gets the starting node based on the list's current forward/reverse state.
        
        Returns the current starting cap node.
    */
    get start() {
        return this[this._start];
    }
    
    /* Gets the ending node based on the list's current forward/reverse state.
        
        Returns the current ending cap node.
    */
    get end() {
        return this[this._end];
    }
    
    /* Checks whether or not the list is empty.
        
        Returns true if the list contains no items, false otherwise.
    */
    get empty() {
        return this._head.next === this._tail;
    }
    
    /* Checks whether or not the list is reversed.
        
        Returns true if the list is currently reversed, false otherwise.
    */
    get reversed() {
        return "prev" === this._next;
    }
    
    /* Gets the first item in the list.
        
        returnNode - True to return the first node in the list, false to return
            its data. Defaults to false.
        
        Returns the data from the first node in the list, or the first node
        object if returnNode is true.
    */
    first(returnNode) {
        let node = this[this._start][this._next];
        return returnNode ? node : node.data;
    }
    
    /* Gets the last item in the list.
        
        returnNode - True to return the last node in the list, false to return
            its data. Defaults to false.
        
        Returns the data from the last node in the list, or the last node
        object if returnNode is true.
    */
    last(returnNode) {
        let node = this[this._end][this._prev];
        return returnNode ? node : node.data;
    }
    
    /* Get an item at a given index.
        
        NOTE: As this is a LinkedList, retrieval by index is O(n), not O(1) like
        a standard array or array-like object.
        
        index - Zero-based index of the item to retrieve. Negative numbers will
            count from the end of the list, where -1 returns the last item in
            the list.
        
        returnNode - True to return the node object, false to return the node's
            data. Defaults to false.
        
        Returns the data from the node at the given index, or the node object if
        returnNode is true. If the given index is out of range, this will return
        undefined.
    */
    get(index, returnNode) {
        if (typeof index !== "number") {
            return;
        }
        
        index = parseInt(index, 10);
        
        let incr = index >= 0 ? 1 : -1,
            method, node, curr;
        
        if (1 === incr) {
            // From the beginning
            curr = 0;
            method = "each";
        }
        else {
            // From the end
            curr = -1;
            method = "eachReverse";
        }
        
        // Find the item
        this[method]((v, n) => {
            if (curr === index) {
                node = n;
                return false;
            }
            
            curr += incr;
        });
        
        if (!node) {
            return;
        }
        
        return returnNode ? node : node.data;
    }
    
    /* Pushes an item to the end of the list.
        
        ...data - One or more data to append.
        
        Returns the new node containing the last appended data (last argument).
    */
    push(...data) {
        let node;
        
        for (let i=0, l=data.length; i<l; ++i) {
            node = this.insert(data[i]);
        }
        
        return node;
    }
    
    /* Removes the last item from the list and returns it.
        
        returnNode - True to return the removed node instead of only its data,
            false to return the node's data and destroy the node. Defaults to
            false.
        
        Returns the data from the last item in the list, or undefined if the
        list contains no items.
    */
    pop(returnNode) {
        if (this.empty) {
            return;
        }
        
        return this.remove(this.last(true), returnNode);
    }
    
    /* Prepends an item to the beginning of the list.
        
        ...data - One or more data to prepend. Arguments will be prepended in
            argument order, with the last argument being inserted immediately
            before the list's current first item.
        
        Returns the new node containing the last prepended data (first
        argument).
    */
    unshift(...data) {
        let node;
        
        for (let i=data.length-1; i>=0; --i) {
            node = this.insert(data[i], this[this._start]);
        }
        
        return node;
    }
    
    /* Removes the first item from the list and returns it.
        
        returnNode - True to return the removed node instead of only its data,
            false to return the node's data and destroy the node. Defaults to
            false.
        
        Returns the data from the last item in the list, or undefined if the
        list contains no items.
    */
    shift(returnNode) {
        if (this.empty) {
            return;
        }
        
        return this.remove(this.first(true), returnNode);
    }
    
    /* Inserts an item after a given node.
        
        data - Data to insert.
        refNode - Node object after which to insert the data. If omitted, the
            data will be inserted at the end of the list.
        
        Returns the new node containing the inserted data.
    */
    insert(data, refNode) {
        return this.insertNode(new Node(this, data), refNode);
    }
    
    /* Inserts an existing node object after a given node in the list.
        
        NOTE: The existing node must be assigned to the list using Node.move()
        before calling LinkedList.insertNode().
        
        node - Node object to insert.
        refNode - See LinkedList.insert().
        
        Returns the inserted node.
    */
    insertNode(node, refNode) {
        let refNodeIsNode = refNode instanceof Node,
            next = this._next,
            prev = this._prev;
        
        // Validate reference node
        if (refNode && !refNodeIsNode) {
            throw new Error("Invalid reference node.");
        }
        
        refNode = refNodeIsNode ? refNode : this.last(true);
        
        // Check for other errors
        switch (true) {
            case node.list !== this:
                throw new Error("Node does not belong to this list.");
                return;
            
            case refNode.list !== this:
                throw new Error("Reference node does not belong to this list.");
                return;
            
            case node === this._head:
                throw new Error("Cannot insert head node.");
                return;
            
            case node === this._tail:
                throw new Error("Cannot insert tail node.");
                return;
        }
        
        // Attach node pointers
        node[next] = refNode[next];
        node[prev] = refNode;
        
        refNode[next][prev] = node;
        refNode[next] = node;
        
        return node;
    }
    
    /* Removes a node object from the list.
        
        NOTE: A node's ownership does not change unless it is destroyed or
        node.move() is called.
        
        node - Node object to remove. The node must belong to the list in order
            to be removed.
        
        returnNode - True to return the removed node instead of destroying it,
            false to destroy it and return only its data. Defaults to false.
        
        Returns the removed node if returnNode is true, or the node's data if
        returnNode is false.
    */
    remove(node, returnNode) {
        let next = this._next,
            prev = this._prev,
            data;
        
        // Check for errors
        switch (true) {
            case node.list !== this:
                throw new Error("Node does not belong to this list.");
                return;
            
            case node === this._head:
                throw new Error("Cannot remove head node.");
                return;
            
            case node === this._tail:
                throw new Error("Cannot remove tail node.");
                return;
        }
        
        // Remove the node from its siblings
        node[next][prev] = node[prev];
        node[prev][next] = node[next];
        
        node[next] = null;
        node[prev] = null;
        
        if (!returnNode) {
            data = node.data;
            node.destroy();
        }
        else {
            data = node;
        }
        
        return data;
    }
    
    /* Removes and destroys all nodes from the list.
        
        returnNodes - True to return all nodes without destroying them, false to
            return all node data. Defaults to false.
        
        cb - Optional callback to run on each item in the list after it is
            removed.
            
            [this] - The list object being iterated over.
            value - Value of the node at the current iteration.
            node - Node at the current iteration.
        
        Returns an array containing all data from the removed nodes, preserving
        the node order. If returnNodes is true, the array will contain the
        removed node objects instead of their data.
    */
    removeAll(returnNodes, cb) {
        let data = [],
            cbFunc = typeof cb === "function";
        
        while (!this.empty) {
            let node = this.shift(true);
            
            cbFunc && cb.call(this, node.data, node);
            
            if (returnNodes) {
                data.push(node);
            }
            else {
                data.push(node.data);
                node.destroy();
            }
        }
        
        return data;
    }
    
    /* Iterates over each item in the list.
        
        NOTE: The list can be reversed during iteration; each step in the
        iteration will respect the list's direction.
        
        cb - Callback to run on each item in the list.
            
            [this] - The list object being iterated over.
            value - Value of the node at the current iteration.
            node - Node at the current iteration.
            
            Return explicitly false to break from the loop, or any other value
            to continue to the next iteration.
        
        Returns the list instance.
    */
    each(cb) {
        let curr = this.first(true);
        
        while (curr !== this[this._end]) {
            if (false === cb.call(this, curr.data, curr)) {
                break;
            }
            
            curr = curr[this._next];
        }
        
        return this;
    }
    
    /* Iterates over each item in the list, in reverse, without actually
        reversing the list.
        
        cb - See LinkedList.each().
        
        Returns the list instance.
    */
    eachReverse(cb) {
        let curr = this.last(true);
        
        while (curr !== this[this._start]) {
            if (false === cb.call(this, curr.data, curr)) {
                break;
            }
            
            curr = curr[this._prev];
        }
        
        return this;
    }
    
    /* Reverses the list relative to its current direction.
        
        NOTE: List insertion/removal methods do not reflect whether or not the
        list is reversed. For example, appending an item to a reversed list will
        attach the new item to the non-reversed "first" item.
        
        Returns true if the new direction is reversed, false if the new
        direction is normal.
    */
    reverse() {
        let reversed = this.reversed;
        
        if (reversed) {
            // Set list to forward
            this._next = "next";
            this._prev = "prev";
            this._start = "_head";
            this._end = "_tail";
        }
        else {
            // Set list to reversed
            this._next = "prev";
            this._prev = "next";
            this._start = "_tail";
            this._end = "_head";
        }
        
        return !reversed;
    }
    
    /* Returns the list data as an array, applying an optional callback to each
        item in the list.
        
        cb - Optional callback function to run on each item in the list. If
            omitted, all items will be included as-is.
            
            [this] - The list object.
            value - Value at the current node.
            node - The current node object in the list.
            
            Returns the data to be included in the final array for the current
            value.
        
        Returns an array containing each value from the list, or each value as
        returned from the callback function.
    */
    toArray(cb) {
        cb = typeof cb === "function" ? cb : null;
        
        let values = [];
        
        this.each((v, n) => {
            values.push(cb ? cb.call(this, v, n) : v);
        });
        
        return values;
    }
}

/* Linked list node.
*/
class Node {
    //
    // STATIC PROPERTIES
    //
    
    //
    // PROPERTIES
    //
    
    // LinkedList object to which the node belongs.
    _list = null;
    
    // Data contained by the node.
    _data = undefined;
    
    // Next node pointer (Node object or null).
    _next = null;
    
    // Previous node pointer (Node object or null).
    _prev = null;
    
    /* Constructor for Node.
        
        list - LinkedList object to which the node belongs.
        data - Data to be contained by the node.
    */
    constructor(list, data) {
        this._list = list;
        this._data = data;
    }
    
    /* Destructor for Node.
    */
    destroy() {
        this._list = null;
        this._data = null;
        this._next = null;
        this._prev = null;
    }
    
    //
    // STATIC METHODS
    //
    
    /* Sanitizes and validates a given value and throws an error is not a valid
        Node object, null, or undefined.
        
        val - Value to validate as a pointer. Valid values are a Node object,
            null, or undefined. If undefined, the value will be normalized to
            null.
        
        error - True to throw an error if validation fails, false otherwise.
            Defaults to false.
        
        Returns the value (possibly normalized) if valid, or throws an error and
        returns null if invalid.
    */
    static sanitizeNode(val, error) {
        switch (true) {
            case undefined === val:
                val = null;
            
            case null === val:
            case val instanceof Node:
                break;
            
            default:
                error && Node.throw("pointer");
                return null;
        }
        
        return val;
    }
    
    /* Throws an error.
        
        type - Error type.
    */
    static error(type) {
        let msg = "Unknown Node error";
        
        switch (type) {
            case "invalid-list":
                msg = "Invalid object provided for parent linked list.";
                break;
            
            case "pointer":
                msg = "Node pointer must be either a node object, null, or " +
                    "undefined.";
                break;
            
            case "reassign-list":
                msg = "Node cannot be reassigned to a different list this " +
                    "way, use node.move() instead.";
                break;
            
            case "illegal-move":
                msg = "New list does not match the new previous node's list.";
                break;
        }
        
        throw new Error(msg);
    }
    
    //
    // METHODS
    //
    
    /* Getter for _data.
        
        Returns the node's data.
    */
    get data() {
        return this._data;
    }
    
    /* Setter for _data.
        
        val - New data for the node.
    */
    set data(val) {
        this._data = val;
    }
    
    /* Getter for _list.
        
        Returns the linked list to which the node is assigned.
    */
    get list() {
        return this._list;
    }
    
    /* Setter for _list. This prevents the node from being moved to a new list.
        
        list - Unused.
    */
    set list(list) {
        Node.throw("reassign-list");
    }
    
    /* Getter for the next node.
        
        Returns the next node attached to this one.
    */
    get next() {
        return this._next;
    }
    
    /* Setter for the next node.
        
        node - New node to attach to the 'next' position.
    */
    set next(node) {
        this._next = Node.sanitizeNode(node, true);
    }
    
    /* Getter for the previous node.
        
        Returns the previous node attached to this one.
    */
    get prev() {
        return this._prev;
    }
    
    /* Setter for the previous node.
        
        node - New node to attach to the 'previous' position.
    */
    set prev(node) {
        this._prev = Node.sanitizeNode(node, true);
    }
    
    /* Moves the node to a new list.
        
        list - New LinkedList object into which to move the node.
        
        prevNode - Node in the new list after which to insert the node. If
            omitted, the node will be inserted at the end of the new list.
    */
    move(list, prevNode) {
        prevNode = Node.sanitizeNode(prevNode);
        
        if (prevNode && prevNode.list !== list) {
            Node.throw("illegal-move");
            return;
        }
        
        if (!(list instanceof LinkedList)) {
            Node.throw("invalid-list");
            return;
        }
        
        // Remove node from its current list
        this._list.remove(this, true);
        
        // Move node to the new list
        this._list = list;
        
        list.insertNode(
            this,
            prevNode instanceof Node ? prevNode : list.last(true)
        );
    }
}

/* Makes an object property immutable using its current value.
    
    obj - Object containing the property.
    prop - Property name to make immutable.
*/
function lock(obj, ...props) {
    let opts = {
        writable: false,
        configurable: false
    };
    
    for (let i=0, l=props.length; i<l; ++i) {
        opts.value = obj[props[i]];
        Object.defineProperty(obj, props[i], opts);
    }
}

export default LinkedList;
