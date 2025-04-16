
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
function noop() { }
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

// Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
// at the end of hydration without touching the remaining nodes.
let is_hydrating = false;
function start_hydrating() {
    is_hydrating = true;
}
function end_hydrating() {
    is_hydrating = false;
}
function upper_bound(low, high, key, value) {
    // Return first index of value larger than input value in the range [low, high)
    while (low < high) {
        const mid = low + ((high - low) >> 1);
        if (key(mid) <= value) {
            low = mid + 1;
        }
        else {
            high = mid;
        }
    }
    return low;
}
function init_hydrate(target) {
    if (target.hydrate_init)
        return;
    target.hydrate_init = true;
    // We know that all children have claim_order values since the unclaimed have been detached
    const children = target.childNodes;
    /*
    * Reorder claimed children optimally.
    * We can reorder claimed children optimally by finding the longest subsequence of
    * nodes that are already claimed in order and only moving the rest. The longest
    * subsequence subsequence of nodes that are claimed in order can be found by
    * computing the longest increasing subsequence of .claim_order values.
    *
    * This algorithm is optimal in generating the least amount of reorder operations
    * possible.
    *
    * Proof:
    * We know that, given a set of reordering operations, the nodes that do not move
    * always form an increasing subsequence, since they do not move among each other
    * meaning that they must be already ordered among each other. Thus, the maximal
    * set of nodes that do not move form a longest increasing subsequence.
    */
    // Compute longest increasing subsequence
    // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
    const m = new Int32Array(children.length + 1);
    // Predecessor indices + 1
    const p = new Int32Array(children.length);
    m[0] = -1;
    let longest = 0;
    for (let i = 0; i < children.length; i++) {
        const current = children[i].claim_order;
        // Find the largest subsequence length such that it ends in a value less than our current value
        // upper_bound returns first greater value, so we subtract one
        const seqLen = upper_bound(1, longest + 1, idx => children[m[idx]].claim_order, current) - 1;
        p[i] = m[seqLen] + 1;
        const newLen = seqLen + 1;
        // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
        m[newLen] = i;
        longest = Math.max(newLen, longest);
    }
    // The longest increasing subsequence of nodes (initially reversed)
    const lis = [];
    // The rest of the nodes, nodes that will be moved
    const toMove = [];
    let last = children.length - 1;
    for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
        lis.push(children[cur - 1]);
        for (; last >= cur; last--) {
            toMove.push(children[last]);
        }
        last--;
    }
    for (; last >= 0; last--) {
        toMove.push(children[last]);
    }
    lis.reverse();
    // We sort the nodes being moved to guarantee that their insertion order matches the claim order
    toMove.sort((a, b) => a.claim_order - b.claim_order);
    // Finally, we move the nodes
    for (let i = 0, j = 0; i < toMove.length; i++) {
        while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
            j++;
        }
        const anchor = j < lis.length ? lis[j] : null;
        target.insertBefore(toMove[i], anchor);
    }
}
function append(target, node) {
    if (is_hydrating) {
        init_hydrate(target);
        if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentElement !== target))) {
            target.actual_end_child = target.firstChild;
        }
        if (node !== target.actual_end_child) {
            target.insertBefore(node, target.actual_end_child);
        }
        else {
            target.actual_end_child = node.nextSibling;
        }
    }
    else if (node.parentNode !== target) {
        target.appendChild(node);
    }
}
function insert(target, node, anchor) {
    if (is_hydrating && !anchor) {
        append(target, node);
    }
    else if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
        target.insertBefore(node, anchor || null);
    }
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            start_hydrating();
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        end_hydrating();
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.3' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

// Environment indicator
const ENVIRONMENT = "development" ;

// Enhanced debugging for API credentials
const debugCredentials = () => {
  // Log environment
  console.log('Current environment:', ENVIRONMENT);
  
  // Debug API_KEY
  {
    console.log('API_KEY is present with length:', process.env.API_KEY.length);
    console.log('API_KEY first 4 chars:', process.env.API_KEY.substring(0, 4) + '...');
  }
  
  // Debug API_SUBSCRIPTION_KEY
  {
    console.log('API_SUBSCRIPTION_KEY is present with length:', process.env.API_SUBSCRIPTION_KEY.length);
    console.log('API_SUBSCRIPTION_KEY first 4 chars:', process.env.API_SUBSCRIPTION_KEY.substring(0, 4) + '...');
  }
  
  // Debug API_BASE_URL
  {
    console.log('API_BASE_URL:', "https://maber-apim-test.azure-api.net/pokedata-api/v0");
  }
  
  // Log build time to verify new deployment
  console.log('Build timestamp:', "2025-04-16T20:03:00.640Z" );
};

// Run enhanced debugging
debugCredentials();

// API Configuration
const API_CONFIG = {
  // Base URL for the API
  baseUrl: "https://maber-apim-test.azure-api.net/pokedata-api/v0" ,
  
  // API key for authentication
  apiKey: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczNzMxNzE0MiwianRpIjoiNjJkNWU1ZjktNTI5ZC00NGIyLTlkMTgtOTY3NWQ3ZTU3NWMwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjJlZGY1N2Y2LWU5OTYtNGNhMy1iZDk5LTFlZDY3MDRkMzJhOSIsIm5iZiI6MTczNzMxNzE0MiwidG9rZW5fdHlwZSI6ImFwaSJ9.y4JduoyU_gG1aiBy4w6frD3h3m-AEoxw_7f6vExYay4" ,
  
  // Subscription key for API Management
  subscriptionKey: "1c3e73f4352b415c98eb89f91541c4e4" ,
  
  // Current environment
  environment: ENVIRONMENT,
  
  // Endpoints
  endpoints: {
    pricing: '/pricing', // Get Info and Pricing for Card or Product
    sets: '/sets',      // List All Sets 
    set: '/set'         // List Cards in Set
  },
  
  // Headers function to get standard headers
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      'Content-Type': 'application/json'
    };
  },
  
  // URL builder functions
  buildPricingUrl(id) {
    return `${this.baseUrl}${this.endpoints.pricing}?id=${encodeURIComponent(id)}&asset_type=CARD`;
  },
  
  buildSetsUrl() {
    return `${this.baseUrl}${this.endpoints.sets}`;
  },
  
  buildCardsForSetUrl(setId) {
    return `${this.baseUrl}${this.endpoints.set}?set_id=${encodeURIComponent(setId)}`;
  }
};

// Enhanced fetch with detailed debugging - relies on your API Management service to handle CORS
async function fetchWithProxy(url, options = {}) {
  // Just use the standard fetch with the provided options
  try {
    console.log(`Fetching from: ${url}`);
    
    // Enhanced header debugging
    if (options.headers) {
      console.log('Headers summary:');
      
      // Check Authorization header
      const authHeader = options.headers['Authorization'] || options.headers['authorization'];
      if (authHeader) {
        console.log('- Authorization header present:', 
          authHeader.substring(0, 10) + '...' + 
          (authHeader.length > 20 ? authHeader.substring(authHeader.length - 4) : ''));
        console.log('- Authorization header length:', authHeader.length);
        
        // Check if it's just "Bearer " without a token
        if (authHeader === 'Bearer ' || authHeader === 'Bearer') {
          console.warn('⚠️ Authorization header contains "Bearer" but no token!');
        }
      } else {
        console.warn('⚠️ No Authorization header found!');
      }
      
      // Check Subscription Key header
      const subKeyHeader = options.headers['Ocp-Apim-Subscription-Key'] || 
                          options.headers['ocp-apim-subscription-key'];
      if (subKeyHeader) {
        console.log('- Subscription Key present:', 
          subKeyHeader.substring(0, 4) + '...' + 
          (subKeyHeader.length > 8 ? subKeyHeader.substring(subKeyHeader.length - 4) : ''));
        console.log('- Subscription Key length:', subKeyHeader.length);
      } else {
        console.warn('⚠️ No Subscription Key header found!');
      }
      
      // Log all headers for debugging
      console.log('All headers:');
      Object.entries(options.headers).forEach(([key, value]) => {
        // Mask the actual values for security
        const maskedValue = typeof value === 'string' && value.length > 8 
          ? value.substring(0, 4) + '...' + value.substring(value.length - 4) 
          : value;
        console.log(`- ${key}: ${maskedValue}`);
      });
    } else {
      console.warn('⚠️ No headers provided in request options!');
    }
    
    const response = await fetch(url, {
      ...options,
      mode: 'cors', // Use CORS mode to allow cross-origin requests
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to get error details');
      console.error(`HTTP Error: ${response.status} - ${response.statusText}\nURL: ${url}\nDetails: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Fetch error for URL [${url}]:`, error);
    throw error;
  }
}

/**
 * IndexedDB Storage Service
 * Provides persistent storage for set list and card data
 */

// Database configuration
const DB_NAME = 'poke-data-db';
const DB_VERSION = 1; // Reset to version 1
const STORES = {
  setList: 'setList',
  cardsBySet: 'cardsBySet',
  cardPricing: 'cardPricing' // Added store for card pricing
};

/**
 * Open the IndexedDB database
 * @returns {Promise<IDBDatabase>} The database instance
 */
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.setList)) {
        db.createObjectStore(STORES.setList, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.cardsBySet)) {
        db.createObjectStore(STORES.cardsBySet, { keyPath: 'setCode' });
      }
      
      // Create cardPricing store if it doesn't exist
      if (!db.objectStoreNames.contains(STORES.cardPricing)) {
        db.createObjectStore(STORES.cardPricing, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Database Service for managing persistent storage of card data
 */
const dbService = {
  /**
   * Save the set list to IndexedDB
   * @param {Array} setList - The array of set objects
   * @returns {Promise<void>}
   */
  async saveSetList(setList) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.setList, 'readwrite');
      const store = transaction.objectStore(STORES.setList);
      
      // We'll store the entire set list as a single record
      await store.put({
        id: 'pokemonSets',
        data: setList,
        timestamp: Date.now()
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error('Error saving set list:', error);
      throw error;
    }
  },
  
  /**
   * Get the set list from IndexedDB
   * @returns {Promise<Array>} The array of set objects
   */
  async getSetList() {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.setList, 'readonly');
      const store = transaction.objectStore(STORES.setList);
      
      const request = store.get('pokemonSets');
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          // If we have the data in the cache, return it
          if (request.result && request.result.data) {
            resolve(request.result.data);
          } else {
            // No data found
            resolve(null);
          }
        };
        
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error('Error getting set list:', error);
      throw error;
    }
  },
  
  /**
   * Save cards for a specific set to IndexedDB
   * @param {string} setCode - The set code
   * @param {Array} cards - The array of card objects for the set
   * @returns {Promise<void>}
   */
  async saveCardsForSet(setCode, cards) {
    try {
      // Use a fallback key if setCode is null or undefined
      const storageKey = setCode || 'unknown-set';
      
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardsBySet, 'readwrite');
      const store = transaction.objectStore(STORES.cardsBySet);
      
      await store.put({
        setCode: storageKey,
        cards,
        timestamp: Date.now()
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error saving cards for set ${setCode}:`, error);
      throw error;
    }
  },
  
  /**
   * Get cards for a specific set from IndexedDB
   * @param {string} setCode - The set code
   * @returns {Promise<Array>} The array of card objects for the set
   */
  async getCardsForSet(setCode) {
    try {
      // Use a fallback key if setCode is null or undefined
      const storageKey = setCode || 'unknown-set';
      
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardsBySet, 'readonly');
      const store = transaction.objectStore(STORES.cardsBySet);
      
      const request = store.get(storageKey);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          // If we have the data in the cache, return it
          if (request.result && request.result.cards) {
            resolve(request.result.cards);
          } else {
            // No data found
            resolve(null);
          }
        };
        
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error getting cards for set ${setCode}:`, error);
      throw error;
    }
  },
  
  /**
   * Save pricing data for a specific card to IndexedDB
   * @param {string} cardId - The card ID
   * @param {Object} pricingData - The pricing data for the card
   * @returns {Promise<void>}
   */
  async saveCardPricing(cardId, pricingData) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardPricing, 'readwrite');
      const store = transaction.objectStore(STORES.cardPricing);
      
      await store.put({
        id: cardId,
        data: pricingData,
        timestamp: Date.now()
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error saving pricing data for card ${cardId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get pricing data for a specific card from IndexedDB
   * @param {string} cardId - The card ID
   * @returns {Promise<Object>} The pricing data for the card
   */
  async getCardPricing(cardId) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardPricing, 'readonly');
      const store = transaction.objectStore(STORES.cardPricing);
      
      const request = store.get(cardId);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          // If we have the data in the cache, return it
          if (request.result && request.result.data) {
            resolve(request.result.data);
          } else {
            // No data found
            resolve(null);
          }
        };
        
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error getting pricing data for card ${cardId}:`, error);
      throw error;
    }
  },
  
  /**
   * Check if we have cards for a specific set in the cache
   * @param {string} setCode - The set code
   * @returns {Promise<boolean>} True if we have the data, false otherwise
   */
  async hasCardsForSet(setCode) {
    try {
      // Use a fallback key if setCode is null or undefined
      const storageKey = setCode || 'unknown-set';
      
      const cards = await this.getCardsForSet(storageKey);
      return cards !== null;
    } catch (error) {
      console.error(`Error checking if we have cards for set ${setCode}:`, error);
      return false;
    }
  },
  
  /**
   * Clear specific set data
   * @param {string} setCode - The set code to clear
   * @returns {Promise<void>}
   */
  async clearSetData(setCode) {
    try {
      // Use a fallback key if setCode is null or undefined
      const storageKey = setCode || 'unknown-set';
      
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardsBySet, 'readwrite');
      const store = transaction.objectStore(STORES.cardsBySet);
      
      const request = store.delete(storageKey);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`Cleared cache for set ${setCode}`);
          resolve();
        };
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error clearing data for set ${setCode}:`, error);
      throw error;
    }
  },
  
  /**
   * Clear pricing data for a specific card
   * @param {string} cardId - The card ID to clear
   * @returns {Promise<void>}
   */
  async clearCardPricing(cardId) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardPricing, 'readwrite');
      const store = transaction.objectStore(STORES.cardPricing);
      
      const request = store.delete(cardId);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`Cleared pricing cache for card ${cardId}`);
          resolve();
        };
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error clearing pricing data for card ${cardId}:`, error);
      throw error;
    }
  },
  
  /**
   * Clear all stored data (useful for testing or resets)
   * @returns {Promise<void>}
   */
  async storeCardPricing(cardId, pricingData) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardPricing, 'readwrite');
      const store = transaction.objectStore(STORES.cardPricing);
      
      await store.put({
        id: cardId,
        data: pricingData,
        timestamp: Date.now()
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error storing pricing for card ${cardId}:`, error);
      throw error;
    }
  },

  /**
   * Get card pricing data
   * @param {string} cardId - The card ID
   * @returns {Promise<Object>} The pricing data
   */
  async getCardPricing(cardId) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardPricing, 'readonly');
      const store = transaction.objectStore(STORES.cardPricing);
      
      const request = store.get(cardId);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          // If we have the data in the cache, return it
          if (request.result && request.result.data) {
            resolve(request.result.data);
          } else {
            // No data found
            resolve(null);
          }
        };
        
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error getting pricing for card ${cardId}:`, error);
      throw error;
    }
  },
  
  async clearAllData() {
    try {
      const db = await openDatabase();
      const transaction = db.transaction([STORES.setList, STORES.cardsBySet, STORES.cardPricing], 'readwrite');
      
      transaction.objectStore(STORES.setList).clear();
      transaction.objectStore(STORES.cardsBySet).clear();
      transaction.objectStore(STORES.cardPricing).clear();
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          console.log('All cache data cleared successfully');
          resolve();
        };
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  },
  
  /**
   * Delete the entire database
   * @returns {Promise<void>}
   */
  async resetDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      
      request.onsuccess = () => {
        console.log(`Database ${DB_NAME} deleted successfully`);
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error deleting database:', event.target.error);
        reject(event.target.error);
      };
      
      request.onblocked = () => {
        console.warn('Database deletion blocked - may have open connections');
        // Still attempt to continue
        resolve();
      };
    });
  }
};

// Debug API configuration on service initialization
console.log('=== PokeDataService Initialization ===');
console.log('API_CONFIG loaded with:');
console.log('- baseUrl:', API_CONFIG.baseUrl);
console.log('- apiKey length:', API_CONFIG.apiKey ? API_CONFIG.apiKey.length : 0);
console.log('- subscriptionKey length:', API_CONFIG.subscriptionKey ? API_CONFIG.subscriptionKey.length : 0);
console.log('- environment:', API_CONFIG.environment);

// Debug headers that will be used
const debugHeaders = API_CONFIG.getHeaders();
console.log('Headers that will be used for API calls:');
Object.entries(debugHeaders).forEach(([key, value]) => {
  // Mask the actual values for security
  const maskedValue = typeof value === 'string' && value.length > 8 
    ? value.substring(0, 4) + '...' + value.substring(value.length - 4) 
    : value;
  console.log(`- ${key}: ${maskedValue}`);
});
console.log('=====================================');

/**
 * Helper function to sort sets by release date in descending order
 * @param {Array} sets - Array of set objects
 * @returns {Array} - Sorted array of sets
 */
function sortSetsByReleaseDate(sets) {
  return sets.sort((a, b) => {
    // Compare release dates in descending order (newest first)
    const dateA = new Date(a.release_date || 0);
    const dateB = new Date(b.release_date || 0);
    return dateB - dateA;
  });
}

/**
 * Helper function to ensure all sets have unique IDs
 * @param {Array} sets - Array of set objects
 * @returns {Array} - Array of sets with guaranteed IDs
 */
function ensureSetsHaveIds(sets) {
  if (!sets || !Array.isArray(sets)) return [];
  
  let highestId = 0;
  
  // Find the highest existing ID
  sets.forEach(set => {
    if (set.id && typeof set.id === 'number' && set.id > highestId) {
      highestId = set.id;
    }
  });
  
  // Ensure all sets have an ID
  return sets.map(set => {
    // If the set already has an ID, return it unchanged
    if (set.id) return set;
    
    // Otherwise, assign a new unique ID
    highestId += 1;
    return { ...set, id: highestId };
  });
}

/**
 * Service for Pokémon data operations
 */
const pokeDataService = {
  /**
   * Get the list of all Pokémon card sets
   * @returns {Promise<Array>} Array of set objects
   */
  async getSetList() {
    try {
      console.log('Fetching set list...');
      // First try to get from cache
      const cachedSets = await dbService.getSetList();
      if (cachedSets && cachedSets.length > 0) {
        console.log(`Using cached sets data - ${cachedSets.length} sets`);
        return sortSetsByReleaseDate(ensureSetsHaveIds(cachedSets));
      }
      
      // If not in cache, fetch from API
      const url = API_CONFIG.buildSetsUrl();
      console.log(`Fetching sets from API: ${url}`);
      
      const response = await fetchWithProxy(url, {
        headers: API_CONFIG.getHeaders()
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to get error details');
        console.error(`API error: ${response.status} - ${errorText}`);
        throw new Error(`API error: ${response.status}. Details: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API response for sets:', data);
      
      // Check for different response formats
      let setsData = data;
      
      // Handle data wrapper
      if (!Array.isArray(data) && data.data && Array.isArray(data.data)) {
        console.log('Found data wrapper in sets response');
        setsData = data.data;
      }
      
      // Handle sets wrapper
      if (!Array.isArray(data) && data.sets && Array.isArray(data.sets)) {
        console.log('Found sets wrapper in response');
        setsData = data.sets;
      }
      
      // Ensure all sets have IDs
      const processedData = ensureSetsHaveIds(setsData);
      console.log(`Processed ${processedData.length} sets with IDs`);
      
      // Cache the results
      if (processedData && Array.isArray(processedData)) {
        await dbService.saveSetList(processedData);
      }
      
      return sortSetsByReleaseDate(processedData);
    } catch (error) {
      console.error('Error fetching sets:', error);
      // Return the fallback list which already has IDs
      console.log('Using hard-coded fallback set list due to API error');
      const { setList } = await import('./setList-f1a2e7a1.js');
      return sortSetsByReleaseDate(setList);
    }
  },
  
  /**
   * Get cards for a specific set
   * @param {string} setCode - The set code
   * @param {string} setId - The set ID (required)
   * @returns {Promise<Array>} Array of card objects
   */
  async getCardsForSet(setCode, setId) {
    try {
      if (!setId) {
        console.error('Set ID is required to fetch cards');
        return [];
      }
      
      // Log any potential issues with set code
      if (!setCode) {
        console.warn('Set code is null or undefined, using fallback key for cache');
        // Use setId as fallback cache key if setCode is missing
        setCode = `id_${setId}`;
      }
      
      // Try to get from cache first
      const cachedCards = await dbService.getCardsForSet(setCode);
      if (cachedCards && cachedCards.length > 0) {
        console.log(`Using cached cards for set ${setCode}: ${cachedCards.length} cards`);
        return cachedCards;
      }
      
      console.log(`Fetching cards for set ${setCode} (ID: ${setId}) from API...`);
      
      // If not in cache, fetch from API using set_id
      const url = API_CONFIG.buildCardsForSetUrl(setId);
      console.log(`API URL for cards: ${url}`);
      
      const response = await fetchWithProxy(url, {
        headers: API_CONFIG.getHeaders()
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to get error details');
        console.error(`API error for set ${setCode}: ${response.status} - ${errorText}`);
        throw new Error(`API error: ${response.status}. Details: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`API response for set ${setCode}:`, data);
      
      // Process the cards data
      let cards = [];
      
      // Check if we have a cards property in the response
      if (data && data.cards && Array.isArray(data.cards)) {
        console.log(`Found cards array with ${data.cards.length} items`);
        cards = data.cards;
      }
      // If no cards property, check if the response itself is an array of cards
      else if (data && Array.isArray(data)) {
        console.log(`Response is a direct array with ${data.length} items`);
        cards = data;
      }
      // If we have a data property with an array
      else if (data && data.data && Array.isArray(data.data)) {
        console.log(`Response has a data array with ${data.data.length} items`);
        cards = data.data;
      }
      // If we have a results property with an array
      else if (data && data.results && Array.isArray(data.results)) {
        console.log(`Response has a results array with ${data.results.length} items`);
        cards = data.results;
      }
      else {
        console.warn('Unexpected data format:', data);
        // Try to extract cards from any array property as a last resort
        for (const key in data) {
          if (Array.isArray(data[key]) && data[key].length > 0) {
            console.log(`Found potential cards array in property '${key}' with ${data[key].length} items`);
            cards = data[key];
            break;
          }
        }
      }
      
      // If we found any cards, log the first one as a sample
      if (cards.length > 0) {
        console.log('First card sample:', cards[0]);
      }
      
      // Log the number of cards found
      console.log(`Found ${cards.length} cards for set ${setCode}`);
      
      // Cache the results if we have cards
      if (cards.length > 0) {
        await dbService.saveCardsForSet(setCode, cards);
      }
      
      return cards;
    } catch (error) {
      console.error(`Error fetching cards for set ${setCode}:`, error);
      return [];
    }
  },
  
  /**
   * Get pricing data for a specific card
   * @param {string} cardId - The card ID
   * @returns {Promise<Object>} Card pricing data
   */
  async getCardPricing(cardId) {
    try {
      if (!cardId) {
        throw new Error('Card ID is required to fetch pricing data');
      }

      console.log(`Getting pricing data for card ID: ${cardId}`);
      
      // Try to get from cache first
      const cachedPricing = await dbService.getCardPricing(cardId);
      if (cachedPricing) {
        console.log(`Using cached pricing for card ${cardId}`);
        return cachedPricing;
      }
      
      // If not in cache, fetch from API
      const url = API_CONFIG.buildPricingUrl(cardId);
      console.log(`API URL for pricing: ${url}`);
      
      const response = await fetchWithProxy(url, {
        headers: API_CONFIG.getHeaders()
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to get error details');
        console.error(`API error for pricing ${cardId}: ${response.status} - ${errorText}`);
        throw new Error(`API error: ${response.status}. Details: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Pricing API response for card ${cardId}:`, data);
      
      // Process the pricing data based on the API response format
      let pricingData = data;
      
      // Check if the API returns a data wrapper object
      if (data && data.data && typeof data.data === 'object') {
        console.log('Found data wrapper in pricing response');
        pricingData = data.data;
      }
      
      // Cache the results
      if (pricingData) {
        await dbService.saveCardPricing(cardId, pricingData);
      }
      
      return pricingData;
    } catch (error) {
      console.error(`Error fetching pricing for card ${cardId}:`, error);
      throw error;
    }
  },
  
  /**
   * Load mock data for testing when API is unavailable
   * @param {string} setName - The set name
   * @param {string} cardName - The card name
   * @returns {Promise<Object>} Mock card pricing data
   */
  async loadMockData(setName, cardName) {
    try {
      const response = await fetch('./mock/pricing-response.json');
      const mockData = await response.json();
      
      // Customize the mock data
      mockData.name = cardName || 'Charizard';
      mockData.set_name = setName || 'Base Set';
      
      return mockData;
    } catch (error) {
      console.error('Error loading mock data:', error);
      
      // Return minimal mock data if JSON file fails to load
      return {
        id: 'mock-id',
        name: cardName || 'Charizard',
        set_name: setName || 'Base Set',
        num: '4/102',
        rarity: 'Rare Holo',
        pricing: {
          'market': { value: 299.99, currency: 'USD' },
          'tcgplayer': { value: 305.42, currency: 'USD' }
        }
      };
    }
  }
};

/* src\components\SearchableSelect.svelte generated by Svelte v3.38.3 */

const { console: console_1 } = globals;
const file = "src\\components\\SearchableSelect.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[26] = list[i];
	child_ctx[28] = i;
	return child_ctx;
}

// (180:2) {#if showDropdown}
function create_if_block(ctx) {
	let div;

	function select_block_type(ctx, dirty) {
		if (/*filteredItems*/ ctx[4].length === 0) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();
			attr_dev(div, "class", "dropdown svelte-1o6pv8x");
			add_location(div, file, 180, 4, 5251);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_block.m(div, null);
			/*div_binding*/ ctx[20](div);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block.d();
			/*div_binding*/ ctx[20](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(180:2) {#if showDropdown}",
		ctx
	});

	return block;
}

// (184:6) {:else}
function create_else_block(ctx) {
	let each_1_anchor;
	let each_value = /*filteredItems*/ ctx[4];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*highlightedIndex, handleItemSelect, filteredItems, secondaryField, labelField*/ 2198) {
				each_value = /*filteredItems*/ ctx[4];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(184:6) {:else}",
		ctx
	});

	return block;
}

// (182:6) {#if filteredItems.length === 0}
function create_if_block_1(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "No results found";
			attr_dev(div, "class", "no-results svelte-1o6pv8x");
			add_location(div, file, 182, 8, 5351);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(182:6) {#if filteredItems.length === 0}",
		ctx
	});

	return block;
}

// (193:14) {#if secondaryField && item[secondaryField]}
function create_if_block_2(ctx) {
	let span;
	let t0;
	let t1_value = /*item*/ ctx[26][/*secondaryField*/ ctx[2]] + "";
	let t1;
	let t2;

	const block = {
		c: function create() {
			span = element("span");
			t0 = text("(");
			t1 = text(t1_value);
			t2 = text(")");
			attr_dev(span, "class", "secondary svelte-1o6pv8x");
			add_location(span, file, 193, 16, 5834);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t0);
			append_dev(span, t1);
			append_dev(span, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*filteredItems, secondaryField*/ 20 && t1_value !== (t1_value = /*item*/ ctx[26][/*secondaryField*/ ctx[2]] + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(193:14) {#if secondaryField && item[secondaryField]}",
		ctx
	});

	return block;
}

// (185:8) {#each filteredItems as item, index}
function create_each_block(ctx) {
	let div;
	let span;
	let t0_value = /*item*/ ctx[26][/*labelField*/ ctx[1]] + "";
	let t0;
	let t1;
	let t2;
	let div_class_value;
	let mounted;
	let dispose;
	let if_block = /*secondaryField*/ ctx[2] && /*item*/ ctx[26][/*secondaryField*/ ctx[2]] && create_if_block_2(ctx);

	function click_handler() {
		return /*click_handler*/ ctx[18](/*item*/ ctx[26]);
	}

	function mouseover_handler() {
		return /*mouseover_handler*/ ctx[19](/*index*/ ctx[28]);
	}

	const block = {
		c: function create() {
			div = element("div");
			span = element("span");
			t0 = text(t0_value);
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			attr_dev(span, "class", "label svelte-1o6pv8x");
			add_location(span, file, 190, 12, 5702);

			attr_dev(div, "class", div_class_value = "item item-" + /*index*/ ctx[28] + " " + (/*highlightedIndex*/ ctx[7] === /*index*/ ctx[28]
			? "highlighted"
			: "") + " svelte-1o6pv8x");

			add_location(div, file, 185, 10, 5470);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, span);
			append_dev(span, t0);
			append_dev(span, t1);
			if (if_block) if_block.m(span, null);
			append_dev(div, t2);

			if (!mounted) {
				dispose = [
					listen_dev(div, "click", click_handler, false, false, false),
					listen_dev(div, "mouseover", mouseover_handler, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*filteredItems, labelField*/ 18 && t0_value !== (t0_value = /*item*/ ctx[26][/*labelField*/ ctx[1]] + "")) set_data_dev(t0, t0_value);

			if (/*secondaryField*/ ctx[2] && /*item*/ ctx[26][/*secondaryField*/ ctx[2]]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					if_block.m(span, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*highlightedIndex*/ 128 && div_class_value !== (div_class_value = "item item-" + /*index*/ ctx[28] + " " + (/*highlightedIndex*/ ctx[7] === /*index*/ ctx[28]
			? "highlighted"
			: "") + " svelte-1o6pv8x")) {
				attr_dev(div, "class", div_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(185:8) {#each filteredItems as item, index}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div1;
	let div0;
	let input;
	let t0;
	let span;
	let t1_value = (/*showDropdown*/ ctx[6] ? "▲" : "▼") + "";
	let t1;
	let t2;
	let mounted;
	let dispose;
	let if_block = /*showDropdown*/ ctx[6] && create_if_block(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			input = element("input");
			t0 = space();
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			if (if_block) if_block.c();
			attr_dev(input, "type", "text");
			attr_dev(input, "placeholder", /*placeholder*/ ctx[0]);
			attr_dev(input, "autocomplete", "off");
			attr_dev(input, "class", "svelte-1o6pv8x");
			add_location(input, file, 166, 4, 4893);
			attr_dev(span, "class", "dropdown-icon svelte-1o6pv8x");
			add_location(span, file, 176, 4, 5148);
			attr_dev(div0, "class", "input-wrapper svelte-1o6pv8x");
			add_location(div0, file, 165, 2, 4860);
			attr_dev(div1, "class", "searchable-select svelte-1o6pv8x");
			add_location(div1, file, 164, 0, 4825);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, input);
			/*input_binding*/ ctx[16](input);
			set_input_value(input, /*searchText*/ ctx[3]);
			append_dev(div0, t0);
			append_dev(div0, span);
			append_dev(span, t1);
			append_dev(div1, t2);
			if (if_block) if_block.m(div1, null);

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*input_input_handler*/ ctx[17]),
					listen_dev(input, "input", /*handleInput*/ ctx[12], false, false, false),
					listen_dev(input, "focus", /*handleFocus*/ ctx[9], false, false, false),
					listen_dev(input, "keydown", /*handleKeydown*/ ctx[10], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*placeholder*/ 1) {
				attr_dev(input, "placeholder", /*placeholder*/ ctx[0]);
			}

			if (dirty & /*searchText*/ 8 && input.value !== /*searchText*/ ctx[3]) {
				set_input_value(input, /*searchText*/ ctx[3]);
			}

			if (dirty & /*showDropdown*/ 64 && t1_value !== (t1_value = (/*showDropdown*/ ctx[6] ? "▲" : "▼") + "")) set_data_dev(t1, t1_value);

			if (/*showDropdown*/ ctx[6]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div1, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			/*input_binding*/ ctx[16](null);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("SearchableSelect", slots, []);
	let { items = [] } = $$props;
	let { placeholder = "Search..." } = $$props;
	let { labelField = "name" } = $$props;
	let { secondaryField = null } = $$props;
	let { value = null } = $$props;

	// State
	let searchText = "";

	let showDropdown = false;
	let filteredItems = [];
	let highlightedIndex = -1;
	let inputElement;
	let dropdownElement;
	const dispatch = createEventDispatcher();

	function handleFocus() {
		console.log("Input focused");
		$$invalidate(6, showDropdown = true);
	}

	function closeDropdown() {
		$$invalidate(6, showDropdown = false);
	}

	function handleKeydown(event) {
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				if (!showDropdown) $$invalidate(6, showDropdown = true);
				$$invalidate(7, highlightedIndex = Math.min(highlightedIndex + 1, filteredItems.length - 1));
				scrollToHighlighted();
				break;
			case "ArrowUp":
				event.preventDefault();
				if (!showDropdown) $$invalidate(6, showDropdown = true);
				$$invalidate(7, highlightedIndex = Math.max(highlightedIndex - 1, -1));
				scrollToHighlighted();
				break;
			case "Enter":
				if (showDropdown && highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
					handleItemSelect(filteredItems[highlightedIndex]);
				}
				break;
			case "Escape":
				closeDropdown();
				break;
		}
	}

	function scrollToHighlighted() {
		if (highlightedIndex >= 0 && dropdownElement) {
			const highlightedEl = dropdownElement.querySelector(`.item-${highlightedIndex}`);

			if (highlightedEl) {
				highlightedEl.scrollIntoView({ block: "nearest" });
			}
		}
	}

	function handleItemSelect(item) {
		if (!item) return;

		// Update the internal value and search text
		$$invalidate(13, value = item);

		$$invalidate(3, searchText = getDisplayText(item));

		// Close dropdown
		closeDropdown();

		// Dispatch the select event
		dispatch("select", item);
	}

	function getDisplayText(item) {
		if (!item) return "";

		if (secondaryField && item[secondaryField]) {
			return `${item[labelField]} (${item[secondaryField]})`;
		}

		return item[labelField];
	}

	function handleInput() {
		// Open dropdown when typing
		$$invalidate(6, showDropdown = true);

		// If text changed and user had a selection, clear it
		if (value && searchText !== getDisplayText(value)) {
			console.log("Text changed, clearing selection");
			$$invalidate(13, value = null);
			dispatch("select", null);
		}
	}

	function clearSelection() {
		console.log("Clearing selection programmatically");
		$$invalidate(13, value = null);
		$$invalidate(3, searchText = "");
		$$invalidate(6, showDropdown = true);
		$$invalidate(4, filteredItems = [...items]);
		dispatch("select", null);

		// Focus the input
		if (inputElement) {
			inputElement.focus();
		}
	}

	// Handle clicks outside the component to close the dropdown
	function handleOutsideClick(event) {
		if (showDropdown && inputElement && !dropdownElement.contains(event.target) && !inputElement.contains(event.target)) {
			closeDropdown();
		}
	}

	// Set up event listeners on mount
	onMount(() => {
		document.addEventListener("click", handleOutsideClick);

		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	});

	const writable_props = ["items", "placeholder", "labelField", "secondaryField", "value"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<SearchableSelect> was created with unknown prop '${key}'`);
	});

	function input_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			inputElement = $$value;
			$$invalidate(5, inputElement);
		});
	}

	function input_input_handler() {
		searchText = this.value;
		(($$invalidate(3, searchText), $$invalidate(13, value)), $$invalidate(5, inputElement));
	}

	const click_handler = item => handleItemSelect(item);
	const mouseover_handler = index => $$invalidate(7, highlightedIndex = index);

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			dropdownElement = $$value;
			$$invalidate(8, dropdownElement);
		});
	}

	$$self.$$set = $$props => {
		if ("items" in $$props) $$invalidate(14, items = $$props.items);
		if ("placeholder" in $$props) $$invalidate(0, placeholder = $$props.placeholder);
		if ("labelField" in $$props) $$invalidate(1, labelField = $$props.labelField);
		if ("secondaryField" in $$props) $$invalidate(2, secondaryField = $$props.secondaryField);
		if ("value" in $$props) $$invalidate(13, value = $$props.value);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		onMount,
		items,
		placeholder,
		labelField,
		secondaryField,
		value,
		searchText,
		showDropdown,
		filteredItems,
		highlightedIndex,
		inputElement,
		dropdownElement,
		dispatch,
		handleFocus,
		closeDropdown,
		handleKeydown,
		scrollToHighlighted,
		handleItemSelect,
		getDisplayText,
		handleInput,
		clearSelection,
		handleOutsideClick
	});

	$$self.$inject_state = $$props => {
		if ("items" in $$props) $$invalidate(14, items = $$props.items);
		if ("placeholder" in $$props) $$invalidate(0, placeholder = $$props.placeholder);
		if ("labelField" in $$props) $$invalidate(1, labelField = $$props.labelField);
		if ("secondaryField" in $$props) $$invalidate(2, secondaryField = $$props.secondaryField);
		if ("value" in $$props) $$invalidate(13, value = $$props.value);
		if ("searchText" in $$props) $$invalidate(3, searchText = $$props.searchText);
		if ("showDropdown" in $$props) $$invalidate(6, showDropdown = $$props.showDropdown);
		if ("filteredItems" in $$props) $$invalidate(4, filteredItems = $$props.filteredItems);
		if ("highlightedIndex" in $$props) $$invalidate(7, highlightedIndex = $$props.highlightedIndex);
		if ("inputElement" in $$props) $$invalidate(5, inputElement = $$props.inputElement);
		if ("dropdownElement" in $$props) $$invalidate(8, dropdownElement = $$props.dropdownElement);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*value, inputElement*/ 8224) {
			// Update searchText when value changes and user is not typing
			 if (value) {
				if (!inputElement || !inputElement.matches(":focus")) {
					$$invalidate(3, searchText = getDisplayText(value));
				}
			}
		}

		if ($$self.$$.dirty & /*searchText, items, value, labelField, secondaryField, filteredItems*/ 24606) {
			// Update filtered items when items or searchText changes
			 {
				console.log("Filtering items with searchText:", searchText);

				if (items && Array.isArray(items)) {
					// Only filter if there's search text, otherwise show all items
					if (searchText && searchText.trim() !== "" && (!value || searchText !== getDisplayText(value))) {
						const searchLower = searchText.toLowerCase();

						$$invalidate(4, filteredItems = items.filter(item => {
							if (!item || !item[labelField]) return false;
							const primaryMatch = item[labelField].toLowerCase().includes(searchLower);
							const secondaryMatch = secondaryField && item[secondaryField] && item[secondaryField].toLowerCase().includes(searchLower);
							return primaryMatch || secondaryMatch;
						}));
					} else {
						$$invalidate(4, filteredItems = [...items]);
					}

					console.log(`Filtered to ${filteredItems.length} items`);
				} else {
					$$invalidate(4, filteredItems = []);
				}

				// Reset highlighted index whenever items change
				$$invalidate(7, highlightedIndex = -1);
			}
		}
	};

	return [
		placeholder,
		labelField,
		secondaryField,
		searchText,
		filteredItems,
		inputElement,
		showDropdown,
		highlightedIndex,
		dropdownElement,
		handleFocus,
		handleKeydown,
		handleItemSelect,
		handleInput,
		value,
		items,
		clearSelection,
		input_binding,
		input_input_handler,
		click_handler,
		mouseover_handler,
		div_binding
	];
}

class SearchableSelect extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			items: 14,
			placeholder: 0,
			labelField: 1,
			secondaryField: 2,
			value: 13,
			clearSelection: 15
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SearchableSelect",
			options,
			id: create_fragment.name
		});
	}

	get items() {
		throw new Error("<SearchableSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set items(value) {
		throw new Error("<SearchableSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get placeholder() {
		throw new Error("<SearchableSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set placeholder(value) {
		throw new Error("<SearchableSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get labelField() {
		throw new Error("<SearchableSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set labelField(value) {
		throw new Error("<SearchableSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get secondaryField() {
		throw new Error("<SearchableSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set secondaryField(value) {
		throw new Error("<SearchableSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<SearchableSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<SearchableSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get clearSelection() {
		return this.$$.ctx[15];
	}

	set clearSelection(value) {
		throw new Error("<SearchableSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\components\CardSearchSelect.svelte generated by Svelte v3.38.3 */

const { console: console_1$1 } = globals;
const file$1 = "src\\components\\CardSearchSelect.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[24] = list[i];
	child_ctx[26] = i;
	return child_ctx;
}

// (218:2) {#if showDropdown}
function create_if_block$1(ctx) {
	let div;

	function select_block_type(ctx, dirty) {
		if (/*filteredCards*/ ctx[2].length === 0) return create_if_block_1$1;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();
			attr_dev(div, "class", "dropdown svelte-ii44bh");
			add_location(div, file$1, 218, 4, 6365);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_block.m(div, null);
			/*div_binding*/ ctx[19](div);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block.d();
			/*div_binding*/ ctx[19](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(218:2) {#if showDropdown}",
		ctx
	});

	return block;
}

// (222:6) {:else}
function create_else_block$1(ctx) {
	let each_1_anchor;
	let each_value = /*filteredCards*/ ctx[2];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*highlightedIndex, handleSelect, filteredCards*/ 548) {
				each_value = /*filteredCards*/ ctx[2];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(222:6) {:else}",
		ctx
	});

	return block;
}

// (220:6) {#if filteredCards.length === 0}
function create_if_block_1$1(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "No matching cards found";
			attr_dev(div, "class", "no-results svelte-ii44bh");
			add_location(div, file$1, 220, 8, 6465);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(220:6) {#if filteredCards.length === 0}",
		ctx
	});

	return block;
}

// (232:16) {#if card.num}
function create_if_block_2$1(ctx) {
	let span;
	let t0;
	let t1_value = /*card*/ ctx[24].num + "";
	let t1;
	let t2;

	const block = {
		c: function create() {
			span = element("span");
			t0 = text("(");
			t1 = text(t1_value);
			t2 = text(")");
			attr_dev(span, "class", "card-num svelte-ii44bh");
			add_location(span, file$1, 232, 18, 6973);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t0);
			append_dev(span, t1);
			append_dev(span, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*filteredCards*/ 4 && t1_value !== (t1_value = /*card*/ ctx[24].num + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(232:16) {#if card.num}",
		ctx
	});

	return block;
}

// (223:8) {#each filteredCards as card, index}
function create_each_block$1(ctx) {
	let div1;
	let div0;
	let span;
	let t0_value = /*card*/ ctx[24].name + "";
	let t0;
	let t1;
	let t2;
	let div1_class_value;
	let mounted;
	let dispose;
	let if_block = /*card*/ ctx[24].num && create_if_block_2$1(ctx);

	function click_handler() {
		return /*click_handler*/ ctx[17](/*card*/ ctx[24]);
	}

	function mouseover_handler() {
		return /*mouseover_handler*/ ctx[18](/*index*/ ctx[26]);
	}

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			span = element("span");
			t0 = text(t0_value);
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			attr_dev(span, "class", "card-name svelte-ii44bh");
			add_location(span, file$1, 229, 14, 6868);
			attr_dev(div0, "class", "card-info svelte-ii44bh");
			add_location(div0, file$1, 228, 12, 6829);

			attr_dev(div1, "class", div1_class_value = "card-item card-item-" + /*index*/ ctx[26] + " " + (/*highlightedIndex*/ ctx[5] === /*index*/ ctx[26]
			? "highlighted"
			: "") + " svelte-ii44bh");

			add_location(div1, file$1, 223, 10, 6591);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, span);
			append_dev(span, t0);
			append_dev(span, t1);
			if (if_block) if_block.m(span, null);
			append_dev(div1, t2);

			if (!mounted) {
				dispose = [
					listen_dev(div1, "click", click_handler, false, false, false),
					listen_dev(div1, "mouseover", mouseover_handler, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*filteredCards*/ 4 && t0_value !== (t0_value = /*card*/ ctx[24].name + "")) set_data_dev(t0, t0_value);

			if (/*card*/ ctx[24].num) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2$1(ctx);
					if_block.c();
					if_block.m(span, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*highlightedIndex*/ 32 && div1_class_value !== (div1_class_value = "card-item card-item-" + /*index*/ ctx[26] + " " + (/*highlightedIndex*/ ctx[5] === /*index*/ ctx[26]
			? "highlighted"
			: "") + " svelte-ii44bh")) {
				attr_dev(div1, "class", div1_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(223:8) {#each filteredCards as card, index}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let div1;
	let div0;
	let input;
	let t0;
	let span;
	let t1_value = (/*showDropdown*/ ctx[4] ? "▲" : "▼") + "";
	let t1;
	let t2;
	let mounted;
	let dispose;
	let if_block = /*showDropdown*/ ctx[4] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			input = element("input");
			t0 = space();
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			if (if_block) if_block.c();
			attr_dev(input, "type", "text");
			attr_dev(input, "placeholder", /*placeholder*/ ctx[0]);
			attr_dev(input, "autocomplete", "off");
			attr_dev(input, "class", "svelte-ii44bh");
			add_location(input, file$1, 204, 4, 6016);
			attr_dev(span, "class", "icon svelte-ii44bh");
			add_location(span, file$1, 214, 4, 6271);
			attr_dev(div0, "class", "input-wrapper svelte-ii44bh");
			add_location(div0, file$1, 203, 2, 5983);
			attr_dev(div1, "class", "card-search svelte-ii44bh");
			add_location(div1, file$1, 202, 0, 5954);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, input);
			/*input_binding*/ ctx[15](input);
			set_input_value(input, /*searchText*/ ctx[1]);
			append_dev(div0, t0);
			append_dev(div0, span);
			append_dev(span, t1);
			append_dev(div1, t2);
			if (if_block) if_block.m(div1, null);

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*input_input_handler*/ ctx[16]),
					listen_dev(input, "input", /*handleInput*/ ctx[7], false, false, false),
					listen_dev(input, "focus", /*handleFocus*/ ctx[8], false, false, false),
					listen_dev(input, "keydown", /*handleKeydown*/ ctx[10], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*placeholder*/ 1) {
				attr_dev(input, "placeholder", /*placeholder*/ ctx[0]);
			}

			if (dirty & /*searchText*/ 2 && input.value !== /*searchText*/ ctx[1]) {
				set_input_value(input, /*searchText*/ ctx[1]);
			}

			if (dirty & /*showDropdown*/ 16 && t1_value !== (t1_value = (/*showDropdown*/ ctx[4] ? "▲" : "▼") + "")) set_data_dev(t1, t1_value);

			if (/*showDropdown*/ ctx[4]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(div1, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			/*input_binding*/ ctx[15](null);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function getCardDisplayText(card) {
	if (!card) return "";
	return card.num ? `${card.name} (${card.num})` : card.name;
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("CardSearchSelect", slots, []);
	let { cards = [] } = $$props; // This will be the list of cards from the selected set
	let { placeholder = "Search for a card..." } = $$props;
	let { selectedCard = null } = $$props; // Two-way binding

	// Local state
	let searchText = "";

	let showDropdown = false;
	let filteredCards = [];
	let highlightedIndex = -1;
	let inputElement;
	let dropdownElement;

	// Set up event dispatcher
	const dispatch = createEventDispatcher();

	// Handle input changes
	function handleInput() {
		console.log("Input changed:", searchText);
		$$invalidate(4, showDropdown = true);

		// If text no longer matches the selected card, clear the selection immediately
		if (selectedCard && searchText !== getCardDisplayText(selectedCard)) {
			console.log("Text doesn't match selected card, clearing selection");
			$$invalidate(11, selectedCard = null);
			dispatch("select", null);
		}
	}

	// Handle focus on the input
	function handleFocus() {
		console.log("Input focused");
		$$invalidate(4, showDropdown = true);
	}

	// Handle selection of a card
	function handleSelect(card) {
		console.log("Card selected:", card?.name);
		if (!card) return;
		$$invalidate(11, selectedCard = card);
		$$invalidate(1, searchText = getCardDisplayText(card));

		// Close dropdown
		closeDropdown();

		dispatch("select", card);
	}

	// Close the dropdown
	function closeDropdown() {
		$$invalidate(4, showDropdown = false);
	}

	// Handle keyboard navigation
	function handleKeydown(event) {
		if (!showDropdown) return;

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				$$invalidate(5, highlightedIndex = Math.min(highlightedIndex + 1, filteredCards.length - 1));
				scrollToHighlighted();
				break;
			case "ArrowUp":
				event.preventDefault();
				$$invalidate(5, highlightedIndex = Math.max(highlightedIndex - 1, -1));
				scrollToHighlighted();
				break;
			case "Enter":
				if (highlightedIndex >= 0 && highlightedIndex < filteredCards.length) {
					handleSelect(filteredCards[highlightedIndex]);
				}
				break;
			case "Escape":
				closeDropdown();
				break;
			case "Backspace":
				// Special case for backspace - ensure dropdown stays open
				if (searchText.length <= 1) {
					setTimeout(
						() => {
							$$invalidate(4, showDropdown = true);
						},
						0
					);
				}
				break;
		}
	}

	// Scroll to highlighted item in the dropdown
	function scrollToHighlighted() {
		if (highlightedIndex >= 0 && dropdownElement) {
			const highlightedEl = dropdownElement.querySelector(`.card-item-${highlightedIndex}`);

			if (highlightedEl) {
				highlightedEl.scrollIntoView({ block: "nearest" });
			}
		}
	}

	function clearSelection() {
		console.log("Clearing card selection");
		$$invalidate(11, selectedCard = null);
		$$invalidate(1, searchText = "");
		dispatch("select", null);

		// Keep dropdown closed after clear unless user focuses the input
		$$invalidate(4, showDropdown = false);

		// Optional: focus the input after clearing
		if (inputElement) {
			inputElement.focus();
		}
	}

	function clearAndFocus() {
		clearSelection();

		// Focus the input
		if (inputElement) {
			inputElement.focus();

			// Ensure dropdown is shown
			setTimeout(
				() => {
					$$invalidate(4, showDropdown = true);

					// Force refilter with empty search
					$$invalidate(1, searchText = "");

					$$invalidate(2, filteredCards = [...cards].slice(0, 100));
				},
				10
			);
		}
	}

	// Handle clicks outside the component to close the dropdown
	function handleOutsideClick(event) {
		if (showDropdown && inputElement && !dropdownElement.contains(event.target) && !inputElement.contains(event.target)) {
			closeDropdown();
		}
	}

	// Set up event listeners on mount
	onMount(() => {
		document.addEventListener("click", handleOutsideClick);

		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	});

	const writable_props = ["cards", "placeholder", "selectedCard"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<CardSearchSelect> was created with unknown prop '${key}'`);
	});

	function input_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			inputElement = $$value;
			$$invalidate(3, inputElement);
		});
	}

	function input_input_handler() {
		searchText = this.value;
		(($$invalidate(1, searchText), $$invalidate(11, selectedCard)), $$invalidate(3, inputElement));
	}

	const click_handler = card => handleSelect(card);
	const mouseover_handler = index => $$invalidate(5, highlightedIndex = index);

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			dropdownElement = $$value;
			$$invalidate(6, dropdownElement);
		});
	}

	$$self.$$set = $$props => {
		if ("cards" in $$props) $$invalidate(12, cards = $$props.cards);
		if ("placeholder" in $$props) $$invalidate(0, placeholder = $$props.placeholder);
		if ("selectedCard" in $$props) $$invalidate(11, selectedCard = $$props.selectedCard);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		onMount,
		cards,
		placeholder,
		selectedCard,
		searchText,
		showDropdown,
		filteredCards,
		highlightedIndex,
		inputElement,
		dropdownElement,
		dispatch,
		getCardDisplayText,
		handleInput,
		handleFocus,
		handleSelect,
		closeDropdown,
		handleKeydown,
		scrollToHighlighted,
		clearSelection,
		clearAndFocus,
		handleOutsideClick
	});

	$$self.$inject_state = $$props => {
		if ("cards" in $$props) $$invalidate(12, cards = $$props.cards);
		if ("placeholder" in $$props) $$invalidate(0, placeholder = $$props.placeholder);
		if ("selectedCard" in $$props) $$invalidate(11, selectedCard = $$props.selectedCard);
		if ("searchText" in $$props) $$invalidate(1, searchText = $$props.searchText);
		if ("showDropdown" in $$props) $$invalidate(4, showDropdown = $$props.showDropdown);
		if ("filteredCards" in $$props) $$invalidate(2, filteredCards = $$props.filteredCards);
		if ("highlightedIndex" in $$props) $$invalidate(5, highlightedIndex = $$props.highlightedIndex);
		if ("inputElement" in $$props) $$invalidate(3, inputElement = $$props.inputElement);
		if ("dropdownElement" in $$props) $$invalidate(6, dropdownElement = $$props.dropdownElement);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*selectedCard, inputElement*/ 2056) {
			// Watch for changes to selectedCard and update searchText only when input doesn't have focus
			 if (selectedCard && selectedCard.name && inputElement && !inputElement.matches(":focus")) {
				$$invalidate(1, searchText = getCardDisplayText(selectedCard));
			}
		}

		if ($$self.$$.dirty & /*cards, searchText, inputElement, filteredCards*/ 4110) {
			// Update filtered cards when cards or searchText changes
			 {
				console.log(`Filtering ${cards.length} cards with search: "${searchText}"`);

				if (searchText && searchText.trim() !== "") {
					const search = searchText.toLowerCase().trim();

					$$invalidate(2, filteredCards = cards.filter(card => {
						// Skip cards without a name
						if (!card || !card.name) return false;

						// Match on name
						const nameMatch = card.name.toLowerCase().includes(search);

						// Also match on card number if available
						const numMatch = card.num && card.num.toLowerCase().includes(search);

						return nameMatch || numMatch;
					}));

					// Always show dropdown when searching
					if (inputElement && inputElement.matches(":focus")) {
						$$invalidate(4, showDropdown = true);
					}
				} else {
					// When empty, show all cards (up to a reasonable limit)
					$$invalidate(2, filteredCards = [...cards].slice(0, 100));
				}

				// Reset highlight when results change
				$$invalidate(5, highlightedIndex = -1);

				console.log(`Filtered to ${filteredCards.length} cards`);
			}
		}
	};

	return [
		placeholder,
		searchText,
		filteredCards,
		inputElement,
		showDropdown,
		highlightedIndex,
		dropdownElement,
		handleInput,
		handleFocus,
		handleSelect,
		handleKeydown,
		selectedCard,
		cards,
		clearSelection,
		clearAndFocus,
		input_binding,
		input_input_handler,
		click_handler,
		mouseover_handler,
		div_binding
	];
}

class CardSearchSelect extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			cards: 12,
			placeholder: 0,
			selectedCard: 11,
			clearSelection: 13,
			clearAndFocus: 14
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CardSearchSelect",
			options,
			id: create_fragment$1.name
		});
	}

	get cards() {
		throw new Error("<CardSearchSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set cards(value) {
		throw new Error("<CardSearchSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get placeholder() {
		throw new Error("<CardSearchSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set placeholder(value) {
		throw new Error("<CardSearchSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get selectedCard() {
		throw new Error("<CardSearchSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set selectedCard(value) {
		throw new Error("<CardSearchSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get clearSelection() {
		return this.$$.ctx[13];
	}

	set clearSelection(value) {
		throw new Error("<CardSearchSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get clearAndFocus() {
		return this.$$.ctx[14];
	}

	set clearAndFocus(value) {
		throw new Error("<CardSearchSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\components\CardVariantSelector.svelte generated by Svelte v3.38.3 */
const file$2 = "src\\components\\CardVariantSelector.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	return child_ctx;
}

// (36:0) {#if isVisible && variants.length > 0}
function create_if_block$2(ctx) {
	let div5;
	let div4;
	let div0;
	let h3;
	let t1;
	let button0;
	let t3;
	let div2;
	let p;
	let t4;
	let t5_value = /*variants*/ ctx[0][0]?.name + "";
	let t5;
	let t6;
	let t7;
	let div1;
	let t8;
	let div3;
	let button1;
	let t9;
	let button1_disabled_value;
	let t10;
	let button2;
	let mounted;
	let dispose;
	let each_value = /*variants*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div5 = element("div");
			div4 = element("div");
			div0 = element("div");
			h3 = element("h3");
			h3.textContent = "Multiple Variants Found";
			t1 = space();
			button0 = element("button");
			button0.textContent = "×";
			t3 = space();
			div2 = element("div");
			p = element("p");
			t4 = text("Multiple versions of \"");
			t5 = text(t5_value);
			t6 = text("\" were found in this set. Please select the specific variant:");
			t7 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t8 = space();
			div3 = element("div");
			button1 = element("button");
			t9 = text("Select Variant");
			t10 = space();
			button2 = element("button");
			button2.textContent = "Cancel";
			attr_dev(h3, "class", "svelte-1j7g73e");
			add_location(h3, file$2, 39, 8, 900);
			attr_dev(button0, "class", "close-button svelte-1j7g73e");
			add_location(button0, file$2, 40, 8, 942);
			attr_dev(div0, "class", "modal-header svelte-1j7g73e");
			add_location(div0, file$2, 38, 6, 864);
			add_location(p, file$2, 44, 8, 1068);
			attr_dev(div1, "class", "variants-list svelte-1j7g73e");
			add_location(div1, file$2, 46, 8, 1197);
			attr_dev(div2, "class", "modal-body svelte-1j7g73e");
			add_location(div2, file$2, 43, 6, 1034);
			attr_dev(button1, "class", "confirm-button svelte-1j7g73e");
			button1.disabled = button1_disabled_value = !/*selectedVariant*/ ctx[2];
			add_location(button1, file$2, 75, 8, 2309);
			attr_dev(button2, "class", "cancel-button svelte-1j7g73e");
			add_location(button2, file$2, 87, 8, 2628);
			attr_dev(div3, "class", "modal-footer svelte-1j7g73e");
			add_location(div3, file$2, 74, 6, 2273);
			attr_dev(div4, "class", "modal svelte-1j7g73e");
			add_location(div4, file$2, 37, 4, 812);
			attr_dev(div5, "class", "overlay svelte-1j7g73e");
			add_location(div5, file$2, 36, 2, 768);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div5, anchor);
			append_dev(div5, div4);
			append_dev(div4, div0);
			append_dev(div0, h3);
			append_dev(div0, t1);
			append_dev(div0, button0);
			append_dev(div4, t3);
			append_dev(div4, div2);
			append_dev(div2, p);
			append_dev(p, t4);
			append_dev(p, t5);
			append_dev(p, t6);
			append_dev(div2, t7);
			append_dev(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div4, t8);
			append_dev(div4, div3);
			append_dev(div3, button1);
			append_dev(button1, t9);
			append_dev(div3, t10);
			append_dev(div3, button2);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*close*/ ctx[5], false, false, false),
					listen_dev(button1, "click", /*click_handler_2*/ ctx[9], false, false, false),
					listen_dev(button2, "click", /*close*/ ctx[5], false, false, false),
					listen_dev(div4, "click", stop_propagation(/*click_handler*/ ctx[7]), false, false, true),
					listen_dev(div5, "click", /*close*/ ctx[5], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*variants*/ 1 && t5_value !== (t5_value = /*variants*/ ctx[0][0]?.name + "")) set_data_dev(t5, t5_value);

			if (dirty & /*isSelected, variants, selectVariant*/ 81) {
				each_value = /*variants*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*selectedVariant*/ 4 && button1_disabled_value !== (button1_disabled_value = !/*selectedVariant*/ ctx[2])) {
				prop_dev(button1, "disabled", button1_disabled_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div5);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(36:0) {#if isVisible && variants.length > 0}",
		ctx
	});

	return block;
}

// (57:18) {#if variant.rarity}
function create_if_block_3(ctx) {
	let span;
	let t_value = /*variant*/ ctx[10].rarity + "";
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(t_value);
			attr_dev(span, "class", "variant-rarity svelte-1j7g73e");
			add_location(span, file$2, 57, 20, 1713);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*variants*/ 1 && t_value !== (t_value = /*variant*/ ctx[10].rarity + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(57:18) {#if variant.rarity}",
		ctx
	});

	return block;
}

// (60:18) {#if variant.variant}
function create_if_block_2$2(ctx) {
	let span;
	let t_value = /*variant*/ ctx[10].variant + "";
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(t_value);
			attr_dev(span, "class", "variant-type svelte-1j7g73e");
			add_location(span, file$2, 60, 20, 1853);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*variants*/ 1 && t_value !== (t_value = /*variant*/ ctx[10].variant + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(60:18) {#if variant.variant}",
		ctx
	});

	return block;
}

// (64:16) {#if variant.image_url}
function create_if_block_1$2(ctx) {
	let div;
	let img;
	let img_src_value;
	let img_alt_value;

	const block = {
		c: function create() {
			div = element("div");
			img = element("img");
			if (img.src !== (img_src_value = /*variant*/ ctx[10].image_url)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*variant*/ ctx[10].name);
			attr_dev(img, "class", "svelte-1j7g73e");
			add_location(img, file$2, 65, 20, 2067);
			attr_dev(div, "class", "variant-thumbnail svelte-1j7g73e");
			add_location(div, file$2, 64, 18, 2014);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, img);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*variants*/ 1 && img.src !== (img_src_value = /*variant*/ ctx[10].image_url)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*variants*/ 1 && img_alt_value !== (img_alt_value = /*variant*/ ctx[10].name)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(64:16) {#if variant.image_url}",
		ctx
	});

	return block;
}

// (48:10) {#each variants as variant}
function create_each_block$2(ctx) {
	let div3;
	let div2;
	let div0;
	let t0_value = /*variant*/ ctx[10].name + "";
	let t0;
	let t1;
	let div1;
	let span;
	let t2;
	let t3_value = /*variant*/ ctx[10].num + "";
	let t3;
	let t4;
	let t5;
	let t6;
	let t7;
	let div3_class_value;
	let mounted;
	let dispose;
	let if_block0 = /*variant*/ ctx[10].rarity && create_if_block_3(ctx);
	let if_block1 = /*variant*/ ctx[10].variant && create_if_block_2$2(ctx);
	let if_block2 = /*variant*/ ctx[10].image_url && create_if_block_1$2(ctx);

	function click_handler_1() {
		return /*click_handler_1*/ ctx[8](/*variant*/ ctx[10]);
	}

	const block = {
		c: function create() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			span = element("span");
			t2 = text("#");
			t3 = text(t3_value);
			t4 = space();
			if (if_block0) if_block0.c();
			t5 = space();
			if (if_block1) if_block1.c();
			t6 = space();
			if (if_block2) if_block2.c();
			t7 = space();
			attr_dev(div0, "class", "variant-name svelte-1j7g73e");
			add_location(div0, file$2, 53, 16, 1491);
			attr_dev(span, "class", "variant-number svelte-1j7g73e");
			add_location(span, file$2, 55, 18, 1601);
			attr_dev(div1, "class", "variant-info svelte-1j7g73e");
			add_location(div1, file$2, 54, 16, 1555);
			attr_dev(div2, "class", "variant-details svelte-1j7g73e");
			add_location(div2, file$2, 52, 14, 1444);

			attr_dev(div3, "class", div3_class_value = "variant-item " + (/*isSelected*/ ctx[6](/*variant*/ ctx[10])
			? "selected"
			: "") + " svelte-1j7g73e");

			add_location(div3, file$2, 48, 12, 1277);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);
			append_dev(div2, div0);
			append_dev(div0, t0);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div1, span);
			append_dev(span, t2);
			append_dev(span, t3);
			append_dev(div1, t4);
			if (if_block0) if_block0.m(div1, null);
			append_dev(div1, t5);
			if (if_block1) if_block1.m(div1, null);
			append_dev(div2, t6);
			if (if_block2) if_block2.m(div2, null);
			append_dev(div3, t7);

			if (!mounted) {
				dispose = listen_dev(div3, "click", click_handler_1, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*variants*/ 1 && t0_value !== (t0_value = /*variant*/ ctx[10].name + "")) set_data_dev(t0, t0_value);
			if (dirty & /*variants*/ 1 && t3_value !== (t3_value = /*variant*/ ctx[10].num + "")) set_data_dev(t3, t3_value);

			if (/*variant*/ ctx[10].rarity) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(div1, t5);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*variant*/ ctx[10].variant) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_2$2(ctx);
					if_block1.c();
					if_block1.m(div1, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*variant*/ ctx[10].image_url) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_1$2(ctx);
					if_block2.c();
					if_block2.m(div2, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (dirty & /*variants*/ 1 && div3_class_value !== (div3_class_value = "variant-item " + (/*isSelected*/ ctx[6](/*variant*/ ctx[10])
			? "selected"
			: "") + " svelte-1j7g73e")) {
				attr_dev(div3, "class", div3_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(48:10) {#each variants as variant}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let if_block_anchor;
	let if_block = /*isVisible*/ ctx[1] && /*variants*/ ctx[0].length > 0 && create_if_block$2(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*isVisible*/ ctx[1] && /*variants*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("CardVariantSelector", slots, []);
	let { variants = [] } = $$props;
	let { isVisible = false } = $$props;

	// State
	let selectedVariant = null;

	const dispatch = createEventDispatcher();

	// Functions
	function selectVariant(variant) {
		$$invalidate(2, selectedVariant = variant);
		dispatch("select", variant);
	}

	function close() {
		dispatch("close");
	}

	// Determine if a variant is selected
	function isSelected(variant) {
		return selectedVariant && selectedVariant.id === variant.id;
	}

	const writable_props = ["variants", "isVisible"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CardVariantSelector> was created with unknown prop '${key}'`);
	});

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	const click_handler_1 = variant => selectVariant(variant);

	const click_handler_2 = () => {
		if (selectedVariant) {
			dispatch("confirm", selectedVariant);
			close();
		}
	};

	$$self.$$set = $$props => {
		if ("variants" in $$props) $$invalidate(0, variants = $$props.variants);
		if ("isVisible" in $$props) $$invalidate(1, isVisible = $$props.isVisible);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		variants,
		isVisible,
		selectedVariant,
		dispatch,
		selectVariant,
		close,
		isSelected
	});

	$$self.$inject_state = $$props => {
		if ("variants" in $$props) $$invalidate(0, variants = $$props.variants);
		if ("isVisible" in $$props) $$invalidate(1, isVisible = $$props.isVisible);
		if ("selectedVariant" in $$props) $$invalidate(2, selectedVariant = $$props.selectedVariant);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*variants*/ 1) {
			// Reset selected variant when variants change
			 {
				if (variants && variants.length) {
					$$invalidate(2, selectedVariant = null);
				}
			}
		}
	};

	return [
		variants,
		isVisible,
		selectedVariant,
		dispatch,
		selectVariant,
		close,
		isSelected,
		click_handler,
		click_handler_1,
		click_handler_2
	];
}

class CardVariantSelector extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { variants: 0, isVisible: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CardVariantSelector",
			options,
			id: create_fragment$2.name
		});
	}

	get variants() {
		throw new Error("<CardVariantSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set variants(value) {
		throw new Error("<CardVariantSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isVisible() {
		throw new Error("<CardVariantSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isVisible(value) {
		throw new Error("<CardVariantSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\App.svelte generated by Svelte v3.38.3 */

const { Error: Error_1, Object: Object_1, console: console_1$2 } = globals;
const file$3 = "src\\App.svelte";

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[27] = list[i][0];
	child_ctx[28] = list[i][1];
	return child_ctx;
}

// (378:4) {#if !isProduction}
function create_if_block_7(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "DEVELOPMENT";
			attr_dev(div, "class", "env-indicator development svelte-l2g1ci");
			add_location(div, file$3, 378, 6, 12854);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_7.name,
		type: "if",
		source: "(378:4) {#if !isProduction}",
		ctx
	});

	return block;
}

// (413:6) {:else}
function create_else_block_1(ctx) {
	let cardsearchselect;
	let updating_selectedCard;
	let current;

	function cardsearchselect_selectedCard_binding(value) {
		/*cardsearchselect_selectedCard_binding*/ ctx[20](value);
	}

	let cardsearchselect_props = { cards: /*cardsInSet*/ ctx[6] };

	if (/*selectedCard*/ ctx[8] !== void 0) {
		cardsearchselect_props.selectedCard = /*selectedCard*/ ctx[8];
	}

	cardsearchselect = new CardSearchSelect({
			props: cardsearchselect_props,
			$$inline: true
		});

	/*cardsearchselect_binding*/ ctx[19](cardsearchselect);
	binding_callbacks.push(() => bind(cardsearchselect, "selectedCard", cardsearchselect_selectedCard_binding));
	cardsearchselect.$on("select", /*handleCardSelect*/ ctx[13]);

	const block = {
		c: function create() {
			create_component(cardsearchselect.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(cardsearchselect, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const cardsearchselect_changes = {};
			if (dirty & /*cardsInSet*/ 64) cardsearchselect_changes.cards = /*cardsInSet*/ ctx[6];

			if (!updating_selectedCard && dirty & /*selectedCard*/ 256) {
				updating_selectedCard = true;
				cardsearchselect_changes.selectedCard = /*selectedCard*/ ctx[8];
				add_flush_callback(() => updating_selectedCard = false);
			}

			cardsearchselect.$set(cardsearchselect_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cardsearchselect.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cardsearchselect.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			/*cardsearchselect_binding*/ ctx[19](null);
			destroy_component(cardsearchselect, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(413:6) {:else}",
		ctx
	});

	return block;
}

// (409:40) 
function create_if_block_6(ctx) {
	let div;
	let input;

	const block = {
		c: function create() {
			div = element("div");
			input = element("input");
			input.disabled = true;
			attr_dev(input, "placeholder", "No cards found for this set");
			attr_dev(input, "class", "svelte-l2g1ci");
			add_location(input, file$3, 410, 10, 13842);
			attr_dev(div, "class", "error-select svelte-l2g1ci");
			add_location(div, file$3, 409, 8, 13804);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, input);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_6.name,
		type: "if",
		source: "(409:40) ",
		ctx
	});

	return block;
}

// (405:31) 
function create_if_block_5(ctx) {
	let div;
	let input;

	const block = {
		c: function create() {
			div = element("div");
			input = element("input");
			input.disabled = true;
			attr_dev(input, "placeholder", "Loading cards...");
			attr_dev(input, "class", "svelte-l2g1ci");
			add_location(input, file$3, 406, 10, 13689);
			attr_dev(div, "class", "loading-select svelte-l2g1ci");
			add_location(div, file$3, 405, 8, 13649);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, input);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_5.name,
		type: "if",
		source: "(405:31) ",
		ctx
	});

	return block;
}

// (401:6) {#if !selectedSet}
function create_if_block_4(ctx) {
	let div;
	let input;

	const block = {
		c: function create() {
			div = element("div");
			input = element("input");
			input.disabled = true;
			attr_dev(input, "placeholder", "Select a set first");
			attr_dev(input, "class", "svelte-l2g1ci");
			add_location(input, file$3, 402, 10, 13541);
			attr_dev(div, "class", "disabled-select svelte-l2g1ci");
			add_location(div, file$3, 401, 8, 13500);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, input);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4.name,
		type: "if",
		source: "(401:6) {#if !selectedSet}",
		ctx
	});

	return block;
}

// (427:4) {#if error}
function create_if_block_3$1(ctx) {
	let p;
	let t;

	const block = {
		c: function create() {
			p = element("p");
			t = text(/*error*/ ctx[4]);
			attr_dev(p, "class", "error svelte-l2g1ci");
			add_location(p, file$3, 427, 6, 14322);
		},
		m: function mount(target, anchor) {
			insert_dev(target, p, anchor);
			append_dev(p, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*error*/ 16) set_data_dev(t, /*error*/ ctx[4]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(p);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$1.name,
		type: "if",
		source: "(427:4) {#if error}",
		ctx
	});

	return block;
}

// (432:4) {#if priceData !== null && priceData !== undefined && typeof priceData === 'object'}
function create_if_block$3(ctx) {
	let div;
	let h2;
	let t0_value = (/*priceData*/ ctx[2]?.name || /*selectedCard*/ ctx[8] && /*selectedCard*/ ctx[8].name || "Card") + "";
	let t0;
	let t1;
	let p0;
	let strong0;
	let t3;
	let t4_value = (/*priceData*/ ctx[2]?.set_name || /*selectedSet*/ ctx[1] && /*selectedSet*/ ctx[1].name || "Unknown") + "";
	let t4;
	let t5;
	let p1;
	let strong1;
	let t7;
	let t8_value = (/*priceData*/ ctx[2]?.num || /*selectedCard*/ ctx[8] && /*selectedCard*/ ctx[8].num || "Unknown") + "";
	let t8;
	let t9;
	let t10;
	let h3;
	let t12;
	let show_if;
	let if_block0 = (/*priceData*/ ctx[2] && /*priceData*/ ctx[2].rarity || /*selectedCard*/ ctx[8] && /*selectedCard*/ ctx[8].rarity) && create_if_block_2$3(ctx);

	function select_block_type_1(ctx, dirty) {
		if (show_if == null || dirty & /*priceData*/ 4) show_if = !!(!/*priceData*/ ctx[2]?.pricing || Object.keys(/*priceData*/ ctx[2].pricing || {}).length === 0);
		if (show_if) return create_if_block_1$3;
		return create_else_block$2;
	}

	let current_block_type = select_block_type_1(ctx, -1);
	let if_block1 = current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			h2 = element("h2");
			t0 = text(t0_value);
			t1 = space();
			p0 = element("p");
			strong0 = element("strong");
			strong0.textContent = "Set:";
			t3 = space();
			t4 = text(t4_value);
			t5 = space();
			p1 = element("p");
			strong1 = element("strong");
			strong1.textContent = "Number:";
			t7 = space();
			t8 = text(t8_value);
			t9 = space();
			if (if_block0) if_block0.c();
			t10 = space();
			h3 = element("h3");
			h3.textContent = "Prices:";
			t12 = space();
			if_block1.c();
			attr_dev(h2, "class", "svelte-l2g1ci");
			add_location(h2, file$3, 434, 8, 14634);
			add_location(strong0, file$3, 435, 11, 14722);
			add_location(p0, file$3, 435, 8, 14719);
			add_location(strong1, file$3, 436, 11, 14832);
			add_location(p1, file$3, 436, 8, 14829);
			attr_dev(h3, "class", "svelte-l2g1ci");
			add_location(h3, file$3, 443, 8, 15244);
			attr_dev(div, "class", "results svelte-l2g1ci");
			add_location(div, file$3, 432, 6, 14528);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h2);
			append_dev(h2, t0);
			append_dev(div, t1);
			append_dev(div, p0);
			append_dev(p0, strong0);
			append_dev(p0, t3);
			append_dev(p0, t4);
			append_dev(div, t5);
			append_dev(div, p1);
			append_dev(p1, strong1);
			append_dev(p1, t7);
			append_dev(p1, t8);
			append_dev(div, t9);
			if (if_block0) if_block0.m(div, null);
			append_dev(div, t10);
			append_dev(div, h3);
			append_dev(div, t12);
			if_block1.m(div, null);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*priceData, selectedCard*/ 260 && t0_value !== (t0_value = (/*priceData*/ ctx[2]?.name || /*selectedCard*/ ctx[8] && /*selectedCard*/ ctx[8].name || "Card") + "")) set_data_dev(t0, t0_value);
			if (dirty & /*priceData, selectedSet*/ 6 && t4_value !== (t4_value = (/*priceData*/ ctx[2]?.set_name || /*selectedSet*/ ctx[1] && /*selectedSet*/ ctx[1].name || "Unknown") + "")) set_data_dev(t4, t4_value);
			if (dirty & /*priceData, selectedCard*/ 260 && t8_value !== (t8_value = (/*priceData*/ ctx[2]?.num || /*selectedCard*/ ctx[8] && /*selectedCard*/ ctx[8].num || "Unknown") + "")) set_data_dev(t8, t8_value);

			if (/*priceData*/ ctx[2] && /*priceData*/ ctx[2].rarity || /*selectedCard*/ ctx[8] && /*selectedCard*/ ctx[8].rarity) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2$3(ctx);
					if_block0.c();
					if_block0.m(div, t10);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div, null);
				}
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block0) if_block0.d();
			if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(432:4) {#if priceData !== null && priceData !== undefined && typeof priceData === 'object'}",
		ctx
	});

	return block;
}

// (440:8) {#if (priceData && priceData.rarity) || (selectedCard && selectedCard.rarity)}
function create_if_block_2$3(ctx) {
	let p;
	let strong;
	let t1;
	let t2_value = (/*priceData*/ ctx[2] && /*priceData*/ ctx[2].rarity || /*selectedCard*/ ctx[8] && /*selectedCard*/ ctx[8].rarity || "Unknown") + "";
	let t2;

	const block = {
		c: function create() {
			p = element("p");
			strong = element("strong");
			strong.textContent = "Rarity:";
			t1 = space();
			t2 = text(t2_value);
			add_location(strong, file$3, 440, 13, 15093);
			add_location(p, file$3, 440, 10, 15090);
		},
		m: function mount(target, anchor) {
			insert_dev(target, p, anchor);
			append_dev(p, strong);
			append_dev(p, t1);
			append_dev(p, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*priceData, selectedCard*/ 260 && t2_value !== (t2_value = (/*priceData*/ ctx[2] && /*priceData*/ ctx[2].rarity || /*selectedCard*/ ctx[8] && /*selectedCard*/ ctx[8].rarity || "Unknown") + "")) set_data_dev(t2, t2_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(p);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$3.name,
		type: "if",
		source: "(440:8) {#if (priceData && priceData.rarity) || (selectedCard && selectedCard.rarity)}",
		ctx
	});

	return block;
}

// (448:8) {:else}
function create_else_block$2(ctx) {
	let ul;
	let each_value = Object.entries(/*priceData*/ ctx[2].pricing || {});
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(ul, "class", "svelte-l2g1ci");
			add_location(ul, file$3, 448, 10, 15512);
		},
		m: function mount(target, anchor) {
			insert_dev(target, ul, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*Object, priceData, formatPrice*/ 4) {
				each_value = Object.entries(/*priceData*/ ctx[2].pricing || {});
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(ul);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(448:8) {:else}",
		ctx
	});

	return block;
}

// (446:8) {#if !priceData?.pricing || Object.keys(priceData.pricing || {}).length === 0}
function create_if_block_1$3(ctx) {
	let p;

	const block = {
		c: function create() {
			p = element("p");
			p.textContent = "No pricing data available for this card.";
			attr_dev(p, "class", "no-prices svelte-l2g1ci");
			add_location(p, file$3, 446, 10, 15418);
		},
		m: function mount(target, anchor) {
			insert_dev(target, p, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(p);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(446:8) {#if !priceData?.pricing || Object.keys(priceData.pricing || {}).length === 0}",
		ctx
	});

	return block;
}

// (450:12) {#each Object.entries(priceData.pricing || {}) as [market, price]}
function create_each_block$3(ctx) {
	let li;
	let span0;
	let t0_value = /*market*/ ctx[27] + "";
	let t0;
	let t1;
	let t2;
	let span1;
	let t3;
	let t4_value = formatPrice(/*price*/ ctx[28]?.value) + "";
	let t4;
	let t5;
	let span2;
	let t6_value = (/*price*/ ctx[28]?.currency || "USD") + "";
	let t6;
	let t7;

	const block = {
		c: function create() {
			li = element("li");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = text(":");
			t2 = space();
			span1 = element("span");
			t3 = text("$");
			t4 = text(t4_value);
			t5 = space();
			span2 = element("span");
			t6 = text(t6_value);
			t7 = space();
			attr_dev(span0, "class", "market svelte-l2g1ci");
			add_location(span0, file$3, 451, 16, 15634);
			attr_dev(span1, "class", "price svelte-l2g1ci");
			add_location(span1, file$3, 452, 16, 15690);
			attr_dev(span2, "class", "currency svelte-l2g1ci");
			add_location(span2, file$3, 453, 16, 15764);
			attr_dev(li, "class", "svelte-l2g1ci");
			add_location(li, file$3, 450, 14, 15612);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, span0);
			append_dev(span0, t0);
			append_dev(span0, t1);
			append_dev(li, t2);
			append_dev(li, span1);
			append_dev(span1, t3);
			append_dev(span1, t4);
			append_dev(li, t5);
			append_dev(li, span2);
			append_dev(span2, t6);
			append_dev(li, t7);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*priceData*/ 4 && t0_value !== (t0_value = /*market*/ ctx[27] + "")) set_data_dev(t0, t0_value);
			if (dirty & /*priceData*/ 4 && t4_value !== (t4_value = formatPrice(/*price*/ ctx[28]?.value) + "")) set_data_dev(t4, t4_value);
			if (dirty & /*priceData*/ 4 && t6_value !== (t6_value = (/*price*/ ctx[28]?.currency || "USD") + "")) set_data_dev(t6, t6_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(450:12) {#each Object.entries(priceData.pricing || {}) as [market, price]}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let main;
	let header;
	let h1;
	let t1;
	let t2;
	let div2;
	let div0;
	let label0;
	let t4;
	let searchableselect;
	let updating_value;
	let t5;
	let div1;
	let label1;
	let t7;
	let current_block_type_index;
	let if_block1;
	let t8;
	let button;
	let t9_value = (/*isLoading*/ ctx[3] ? "Loading..." : "Get Price") + "";
	let t9;
	let button_disabled_value;
	let t10;
	let t11;
	let t12;
	let cardvariantselector;
	let current;
	let mounted;
	let dispose;
	let if_block0 = !/*isProduction*/ ctx[10] && create_if_block_7(ctx);

	function searchableselect_value_binding(value) {
		/*searchableselect_value_binding*/ ctx[18](value);
	}

	let searchableselect_props = {
		items: /*availableSets*/ ctx[5],
		labelField: "name",
		secondaryField: "code",
		placeholder: "Search for a set..."
	};

	if (/*selectedSet*/ ctx[1] !== void 0) {
		searchableselect_props.value = /*selectedSet*/ ctx[1];
	}

	searchableselect = new SearchableSelect({
			props: searchableselect_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(searchableselect, "value", searchableselect_value_binding));
	searchableselect.$on("select", /*handleSetSelect*/ ctx[12]);
	const if_block_creators = [create_if_block_4, create_if_block_5, create_if_block_6, create_else_block_1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (!/*selectedSet*/ ctx[1]) return 0;
		if (/*isLoadingCards*/ ctx[7]) return 1;
		if (/*cardsInSet*/ ctx[6].length === 0) return 2;
		return 3;
	}

	current_block_type_index = select_block_type(ctx);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	let if_block2 = /*error*/ ctx[4] && create_if_block_3$1(ctx);
	let if_block3 = /*priceData*/ ctx[2] !== null && /*priceData*/ ctx[2] !== undefined && typeof /*priceData*/ ctx[2] === "object" && create_if_block$3(ctx);

	cardvariantselector = new CardVariantSelector({
			props: {
				variants: /*cardVariants*/ ctx[11],
				isVisible: /*showVariantSelector*/ ctx[9]
			},
			$$inline: true
		});

	cardvariantselector.$on("select", /*handleVariantSelect*/ ctx[14]);
	cardvariantselector.$on("confirm", /*handleVariantConfirm*/ ctx[15]);
	cardvariantselector.$on("close", /*closeVariantSelector*/ ctx[16]);

	const block = {
		c: function create() {
			main = element("main");
			header = element("header");
			h1 = element("h1");
			h1.textContent = "Pokémon Card Price Checker";
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			div2 = element("div");
			div0 = element("div");
			label0 = element("label");
			label0.textContent = "Select Set:";
			t4 = space();
			create_component(searchableselect.$$.fragment);
			t5 = space();
			div1 = element("div");
			label1 = element("label");
			label1.textContent = "Card Name:";
			t7 = space();
			if_block1.c();
			t8 = space();
			button = element("button");
			t9 = text(t9_value);
			t10 = space();
			if (if_block2) if_block2.c();
			t11 = space();
			if (if_block3) if_block3.c();
			t12 = space();
			create_component(cardvariantselector.$$.fragment);
			attr_dev(h1, "class", "svelte-l2g1ci");
			add_location(h1, file$3, 376, 4, 12786);
			attr_dev(header, "class", "svelte-l2g1ci");
			add_location(header, file$3, 375, 2, 12772);
			attr_dev(label0, "for", "setSelect");
			attr_dev(label0, "class", "svelte-l2g1ci");
			add_location(label0, file$3, 385, 6, 13022);
			attr_dev(div0, "class", "form-group svelte-l2g1ci");
			add_location(div0, file$3, 384, 4, 12990);
			attr_dev(label1, "for", "cardName");
			attr_dev(label1, "class", "svelte-l2g1ci");
			add_location(label1, file$3, 397, 6, 13354);
			attr_dev(div1, "class", "form-group svelte-l2g1ci");
			add_location(div1, file$3, 396, 4, 13322);
			button.disabled = button_disabled_value = /*isLoading*/ ctx[3] || !/*selectedCard*/ ctx[8];
			attr_dev(button, "class", "svelte-l2g1ci");
			add_location(button, file$3, 422, 4, 14160);
			attr_dev(div2, "class", "form-container svelte-l2g1ci");
			add_location(div2, file$3, 383, 2, 12956);
			attr_dev(main, "class", "svelte-l2g1ci");
			add_location(main, file$3, 374, 0, 12762);
		},
		l: function claim(nodes) {
			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, header);
			append_dev(header, h1);
			append_dev(header, t1);
			if (if_block0) if_block0.m(header, null);
			append_dev(main, t2);
			append_dev(main, div2);
			append_dev(div2, div0);
			append_dev(div0, label0);
			append_dev(div0, t4);
			mount_component(searchableselect, div0, null);
			append_dev(div2, t5);
			append_dev(div2, div1);
			append_dev(div1, label1);
			append_dev(div1, t7);
			if_blocks[current_block_type_index].m(div1, null);
			append_dev(div2, t8);
			append_dev(div2, button);
			append_dev(button, t9);
			append_dev(div2, t10);
			if (if_block2) if_block2.m(div2, null);
			append_dev(div2, t11);
			if (if_block3) if_block3.m(div2, null);
			append_dev(main, t12);
			mount_component(cardvariantselector, main, null);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button, "click", /*fetchCardPrice*/ ctx[17], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			const searchableselect_changes = {};
			if (dirty & /*availableSets*/ 32) searchableselect_changes.items = /*availableSets*/ ctx[5];

			if (!updating_value && dirty & /*selectedSet*/ 2) {
				updating_value = true;
				searchableselect_changes.value = /*selectedSet*/ ctx[1];
				add_flush_callback(() => updating_value = false);
			}

			searchableselect.$set(searchableselect_changes);
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block1 = if_blocks[current_block_type_index];

				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				} else {
					if_block1.p(ctx, dirty);
				}

				transition_in(if_block1, 1);
				if_block1.m(div1, null);
			}

			if ((!current || dirty & /*isLoading*/ 8) && t9_value !== (t9_value = (/*isLoading*/ ctx[3] ? "Loading..." : "Get Price") + "")) set_data_dev(t9, t9_value);

			if (!current || dirty & /*isLoading, selectedCard*/ 264 && button_disabled_value !== (button_disabled_value = /*isLoading*/ ctx[3] || !/*selectedCard*/ ctx[8])) {
				prop_dev(button, "disabled", button_disabled_value);
			}

			if (/*error*/ ctx[4]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_3$1(ctx);
					if_block2.c();
					if_block2.m(div2, t11);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (/*priceData*/ ctx[2] !== null && /*priceData*/ ctx[2] !== undefined && typeof /*priceData*/ ctx[2] === "object") {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block$3(ctx);
					if_block3.c();
					if_block3.m(div2, null);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			const cardvariantselector_changes = {};
			if (dirty & /*showVariantSelector*/ 512) cardvariantselector_changes.isVisible = /*showVariantSelector*/ ctx[9];
			cardvariantselector.$set(cardvariantselector_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(searchableselect.$$.fragment, local);
			transition_in(if_block1);
			transition_in(cardvariantselector.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(searchableselect.$$.fragment, local);
			transition_out(if_block1);
			transition_out(cardvariantselector.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			if (if_block0) if_block0.d();
			destroy_component(searchableselect);
			if_blocks[current_block_type_index].d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			destroy_component(cardvariantselector);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function formatPrice(value) {
	if (value === undefined || value === null) return "0.00";
	return parseFloat(value).toFixed(2);
}

// Function to filter out zero or null price values with safety
function filterValidPrices(pricing) {
	// Safety check for null/undefined input
	if (!pricing || typeof pricing !== "object") return {};

	// Create a new object with only valid price entries
	const filteredPricing = {};

	try {
		Object.entries(pricing).forEach(([market, priceInfo]) => {
			// Skip null values entirely
			if (priceInfo === null || priceInfo === undefined) return;

			// Handle different pricing formats
			if (typeof priceInfo === "object" && priceInfo.value !== undefined && priceInfo.value !== null && parseFloat(priceInfo.value) > 0) {
				// Object format with value property
				filteredPricing[market] = priceInfo;
			} else if (typeof priceInfo === "number" && priceInfo > 0) {
				// Direct number format
				filteredPricing[market] = { value: priceInfo, currency: "USD" };
			} else if (typeof priceInfo === "string" && parseFloat(priceInfo) > 0) {
				// String that can be parsed as a number
				filteredPricing[market] = {
					value: parseFloat(priceInfo),
					currency: "USD"
				};
			}
		});
	} catch(err) {
		console.error("Error filtering prices:", err);
		return {}; // Return empty object on error
	}

	return filteredPricing;
}

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("App", slots, []);
	const buildTime = "2025-04-16T20:03:00.640Z" ;
	const isProduction = ENVIRONMENT === "production";

	// Reference to CardSearchSelect component
	let cardSearchComponent;

	let selectedSet = null;
	let cardName = "";
	let priceData = null;
	let isLoading = false;
	let error = null;
	let availableSets = [];

	// New state variables for cards
	let cardsInSet = [];

	let isLoadingCards = false;
	let selectedCard = null;

	// Variables for handling card variants
	let cardVariants = [];

	let showVariantSelector = false;
	let selectedVariant = null;

	// Handle set selection
	async function handleSetSelect(event) {
		$$invalidate(1, selectedSet = event.detail);
		console.log("Selected set:", selectedSet);

		// Verify we have the set ID before loading cards
		if (selectedSet && selectedSet.id) {
			loadCardsForSet(selectedSet);
		} else {
			console.error("Selected set does not have an ID property:", selectedSet);
			$$invalidate(4, error = "Invalid set data. Please select a different set.");
		}
	}

	// Load cards for a selected set
	async function loadCardsForSet(set) {
		if (!set) return;

		if (!set.id) {
			console.error("Set ID is required but not available:", set);
			$$invalidate(4, error = "Selected set is missing required data.");
			return;
		}

		try {
			// Clear all card-related state first
			$$invalidate(2, priceData = null);

			$$invalidate(8, selectedCard = null);
			cardName = "";
			$$invalidate(6, cardsInSet = []);

			// Show loading state
			$$invalidate(7, isLoadingCards = true);

			$$invalidate(4, error = null);
			console.log(`Loading cards for set ${set.name} (code: ${set.code}, id: ${set.id})...`);

			// Get cards for the selected set using the pokeDataService
			let cards = await pokeDataService.getCardsForSet(set.code, set.id);

			// If no cards returned, try to use fallback data for certain sets
			if (!cards || cards.length === 0) {
				console.log(`No cards returned from API for set ${set.code}, trying fallback data`);

				// Use fallback data for Prismatic Evolutions set
				if (set.code === "PRE") {
					console.log("Using fallback data for Prismatic Evolutions");
					cards = prismaticEvolutionsCards;
				} else {
					// Generate some dummy cards for other sets
					console.log(`Generating dummy cards for set ${set.code}`);

					cards = Array.from({ length: 20 }, (_, i) => ({
						id: `dummy-${set.code}-${i + 1}`,
						name: `${set.name} Card ${i + 1}`,
						num: `${i + 1}/${100}`,
						set_code: set.code,
						set_name: set.name
					}));
				}
			}

			console.log(`Received ${cards ? cards.length : 0} cards from API/cache`);

			if (!cards || cards.length === 0) {
				console.log("No cards returned for this set");
				$$invalidate(7, isLoadingCards = false);
				return;
			}

			// Check if cards have the expected properties
			const sampleCard = cards[0];

			console.log("Sample card structure:", sampleCard);
			console.log(`Received ${cards.length} cards for set ${set.name}`);

			// Transform the cards into a format suitable for the SearchableSelect component
			$$invalidate(6, cardsInSet = cards.map(card => ({
				id: card.id || `fallback-${card.num || Math.random()}`,
				name: card.name || "Unknown Card",
				num: card.num || "",
				rarity: card.rarity || "",
				variant: card.variant || "",
				image_url: card.image_url || ""
			})));

			console.log(`Transformed ${cardsInSet.length} cards for display`);

			// Check if any cards lack name property
			const invalidCards = cards.filter(card => !card.name);

			if (invalidCards.length > 0) {
				console.warn(`Found ${invalidCards.length} cards without names!`);
				console.warn("Sample invalid card:", invalidCards[0]);
			}

			$$invalidate(7, isLoadingCards = false);
			$$invalidate(7, isLoadingCards = false);
		} catch(err) {
			console.error("Error loading cards for set:", err);
			$$invalidate(7, isLoadingCards = false);
			$$invalidate(6, cardsInSet = []); // Reset to empty array in case of error
		}
	}

	// Function to handle card selection changes
	function handleCardSelect(event) {
		console.log("Card selection event:", event.detail);

		// Clear price data first to prevent reference errors
		$$invalidate(2, priceData = null);

		// Update the selected card state
		$$invalidate(8, selectedCard = event.detail);

		cardName = selectedCard ? selectedCard.name : "";

		// Clear any previous error
		$$invalidate(4, error = null);

		// Validate the selection
		if (selectedCard && !selectedCard.id) {
			console.error("Selected card does not have an ID property:", selectedCard);
			$$invalidate(4, error = "Invalid card data. Please select a different card.");
		}
	}

	// Functions for handling variant selection
	function handleVariantSelect(event) {
		selectedVariant = event.detail;
	}

	function handleVariantConfirm(event) {
		selectedVariant = event.detail;
		loadPricingForVariant(selectedVariant);
	}

	function closeVariantSelector() {
		$$invalidate(9, showVariantSelector = false);
	}

	// Get the selected card ID
	function getSelectedCardId() {
		return selectedCard ? selectedCard.id : null;
	}

	// Load pricing data for a specific variant
	async function loadPricingForVariant(variant) {
		try {
			if (!variant || !variant.id) {
				throw new Error("Invalid card variant");
			}

			$$invalidate(3, isLoading = true);
			$$invalidate(4, error = null);

			// Get pricing data for the selected variant
			const rawPriceData = await pokeDataService.getCardPricing(variant.id);

			// Filter out zero or null price values
			if (rawPriceData && rawPriceData.pricing) {
				rawPriceData.pricing = filterValidPrices(rawPriceData.pricing);
			}

			$$invalidate(2, priceData = rawPriceData);
			$$invalidate(3, isLoading = false);
		} catch(err) {
			console.error("Error loading pricing for variant:", err);
			$$invalidate(4, error = err.message);
			$$invalidate(3, isLoading = false);

			// For development: Use mock data if API fails
			try {
				console.log("Attempting to load mock data for variant...");
				const mockData = await pokeDataService.loadMockData(selectedSet.name, cardName);

				// Filter the mock data too
				if (mockData && mockData.pricing) {
					mockData.pricing = filterValidPrices(mockData.pricing);
				}

				if (variant) {
					// Update mock data to match the selected variant
					mockData.name = variant.name;

					mockData.num = variant.num;

					if (variant.rarity) {
						mockData.rarity = variant.rarity;
					}
				}

				$$invalidate(2, priceData = mockData);
				$$invalidate(4, error = "Using mock data (API unavailable). This is for demonstration purposes only.");
			} catch(mockErr) {
				console.error("Failed to load mock data:", mockErr);
			}
		}
	}

	async function fetchCardPrice() {
		if (!selectedSet) {
			$$invalidate(4, error = "Please select a set");
			return;
		}

		if (!selectedCard) {
			$$invalidate(4, error = "Please select a card");
			return;
		}

		$$invalidate(3, isLoading = true);
		$$invalidate(4, error = null);

		try {
			// Get the card ID from the selected card
			const cardId = getSelectedCardId();

			if (!cardId) {
				throw new Error("Invalid card selection - missing ID");
			}

			console.log(`Fetching price data for card ID: ${cardId}`);

			// Load pricing data directly using the card ID
			const rawPriceData = await pokeDataService.getCardPricing(cardId);

			console.log("Received price data:", rawPriceData);

			// Filter out zero or null price values
			if (rawPriceData && rawPriceData.pricing) {
				rawPriceData.pricing = filterValidPrices(rawPriceData.pricing);
				console.log("Filtered pricing data:", rawPriceData.pricing);
			} else {
				console.warn("No pricing data found in the response:", rawPriceData);
			}

			$$invalidate(2, priceData = rawPriceData);
		} catch(err) {
			console.error("API Error:", err);
			$$invalidate(4, error = err.message);

			// For development: Use mock data if API fails
			try {
				console.log("Attempting to load mock data...");
				const mockData = await pokeDataService.loadMockData(selectedSet.name, cardName);

				// Filter the mock data too
				if (mockData && mockData.pricing) {
					mockData.pricing = filterValidPrices(mockData.pricing);
				}

				$$invalidate(2, priceData = mockData);
				$$invalidate(4, error = "Using mock data (API unavailable). This is for demonstration purposes only.");
			} catch(mockErr) {
				console.error("Failed to load mock data:", mockErr);
			}
		} finally {
			$$invalidate(3, isLoading = false);
		}
	}

	onMount(async () => {
		try {
			console.log("Initializing app and loading set list...");

			// Get the set list with caching
			const sets = await pokeDataService.getSetList();

			console.log(`Loaded ${sets.length} sets`);

			// Verify all sets have an ID property
			const setsWithoutIds = sets.filter(set => !set.id);

			if (setsWithoutIds.length > 0) {
				console.warn(`Found ${setsWithoutIds.length} sets without IDs`);

				// Add IDs to the sets that don't have them
				let maxId = Math.max(...sets.filter(set => set.id).map(set => set.id), 0);

				setsWithoutIds.forEach(set => {
					maxId++;
					set.id = maxId;
				});

				console.log("Added IDs to sets that were missing them");
			}

			// Check for any missing set codes
			const setsWithoutCodes = sets.filter(set => !set.code);

			if (setsWithoutCodes.length > 0) {
				console.warn(`Found ${setsWithoutCodes.length} sets without codes`);
			}

			$$invalidate(5, availableSets = sets);
		} catch(error) {
			console.error("Error loading set list:", error);

			// Fallback to imported data
			console.log("Using fallback set list");

			const { setList } = await import('./setList-f1a2e7a1.js');
			$$invalidate(5, availableSets = setList);
		}

		// Add debugging log to verify sets are loaded
		console.log(`Available sets: ${availableSets.length}`);

		if (availableSets.length > 0) {
			console.log("First few sets:", availableSets.slice(0, 3));
		}
	});

	const writable_props = [];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<App> was created with unknown prop '${key}'`);
	});

	function searchableselect_value_binding(value) {
		selectedSet = value;
		$$invalidate(1, selectedSet);
	}

	function cardsearchselect_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			cardSearchComponent = $$value;
			$$invalidate(0, cardSearchComponent);
		});
	}

	function cardsearchselect_selectedCard_binding(value) {
		selectedCard = value;
		$$invalidate(8, selectedCard);
	}

	$$self.$capture_state = () => ({
		onMount,
		API_CONFIG,
		ENVIRONMENT,
		pokeDataService,
		dbService,
		SearchableSelect,
		CardSearchSelect,
		CardVariantSelector,
		buildTime,
		isProduction,
		cardSearchComponent,
		selectedSet,
		cardName,
		priceData,
		isLoading,
		error,
		availableSets,
		cardsInSet,
		isLoadingCards,
		selectedCard,
		cardVariants,
		showVariantSelector,
		selectedVariant,
		formatPrice,
		handleSetSelect,
		loadCardsForSet,
		handleCardSelect,
		handleVariantSelect,
		handleVariantConfirm,
		closeVariantSelector,
		getSelectedCardId,
		filterValidPrices,
		loadPricingForVariant,
		fetchCardPrice
	});

	$$self.$inject_state = $$props => {
		if ("cardSearchComponent" in $$props) $$invalidate(0, cardSearchComponent = $$props.cardSearchComponent);
		if ("selectedSet" in $$props) $$invalidate(1, selectedSet = $$props.selectedSet);
		if ("cardName" in $$props) cardName = $$props.cardName;
		if ("priceData" in $$props) $$invalidate(2, priceData = $$props.priceData);
		if ("isLoading" in $$props) $$invalidate(3, isLoading = $$props.isLoading);
		if ("error" in $$props) $$invalidate(4, error = $$props.error);
		if ("availableSets" in $$props) $$invalidate(5, availableSets = $$props.availableSets);
		if ("cardsInSet" in $$props) $$invalidate(6, cardsInSet = $$props.cardsInSet);
		if ("isLoadingCards" in $$props) $$invalidate(7, isLoadingCards = $$props.isLoadingCards);
		if ("selectedCard" in $$props) $$invalidate(8, selectedCard = $$props.selectedCard);
		if ("cardVariants" in $$props) $$invalidate(11, cardVariants = $$props.cardVariants);
		if ("showVariantSelector" in $$props) $$invalidate(9, showVariantSelector = $$props.showVariantSelector);
		if ("selectedVariant" in $$props) selectedVariant = $$props.selectedVariant;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		cardSearchComponent,
		selectedSet,
		priceData,
		isLoading,
		error,
		availableSets,
		cardsInSet,
		isLoadingCards,
		selectedCard,
		showVariantSelector,
		isProduction,
		cardVariants,
		handleSetSelect,
		handleCardSelect,
		handleVariantSelect,
		handleVariantConfirm,
		closeVariantSelector,
		fetchCardPrice,
		searchableselect_value_binding,
		cardsearchselect_binding,
		cardsearchselect_selectedCard_binding
	];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment$3.name
		});
	}
}

// Environment Variables Debug Script
// Include this file in your application to debug environment variables
// IMPORTANT: Remove this file before deploying to production!

(function() {
  console.log('=== Environment Variables Debug ===');
  console.log('Running debug check at:', new Date().toISOString());
  
  // Check Node environment
  console.log('NODE_ENV:', "development" );
  
  // Check API configuration
  console.log('API_BASE_URL exists:', !!"https://maber-apim-test.azure-api.net/pokedata-api/v0");
  {
    console.log('API_BASE_URL:', "https://maber-apim-test.azure-api.net/pokedata-api/v0");
  }
  
  // Safely check API credentials
  console.log('API_KEY exists:', !!"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczNzMxNzE0MiwianRpIjoiNjJkNWU1ZjktNTI5ZC00NGIyLTlkMTgtOTY3NWQ3ZTU3NWMwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjJlZGY1N2Y2LWU5OTYtNGNhMy1iZDk5LTFlZDY3MDRkMzJhOSIsIm5iZiI6MTczNzMxNzE0MiwidG9rZW5fdHlwZSI6ImFwaSJ9.y4JduoyU_gG1aiBy4w6frD3h3m-AEoxw_7f6vExYay4");
  {
    console.log('API_KEY length:', process.env.API_KEY.length);
    console.log('API_KEY first 4 chars:', process.env.API_KEY.substring(0, 4) + '...');
  }
  
  console.log('API_SUBSCRIPTION_KEY exists:', !!"1c3e73f4352b415c98eb89f91541c4e4");
  {
    console.log('API_SUBSCRIPTION_KEY length:', process.env.API_SUBSCRIPTION_KEY.length);
    console.log('API_SUBSCRIPTION_KEY first 4 chars:', process.env.API_SUBSCRIPTION_KEY.substring(0, 4) + '...');
  }
  
  // Check build information
  console.log('BUILD_TIME:', "2025-04-16T20:03:00.640Z" );
  
  console.log('=== End Environment Debug ===');
})();

console.log('Application starting...');
console.log('Build environment:', "development" );
console.log('Build timestamp:', "2025-04-16T20:03:00.640Z" );

const app = new App({
  target: document.body
});

export default app;
//# sourceMappingURL=main.js.map
