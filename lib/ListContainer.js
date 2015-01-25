/**
 * @class ListContainer - simple evented container for collection/array storage. fires events when list changes or
 * when a contained model changes.
 *
 * @author: darryl.west@roundpeg.com
 * @created: 12/4/14 8:49 AM
 */
var dash = require('lodash'),
    util = require('util'),
    events = require('events');

var ListContainer = function(options) {
    'use strict';

    var container = this,
        list,
        sorter;

    if (!options) options = {};

    if (dash.isArray( options )) {
        list = options;
    } else if (dash.isArray( options.list )) {
        list = options.list;
    } else if (options instanceof ListContainer) {
        list = options.getList();
    } else {
        list = [];
    }

    if (options.lastRefresh && dash.isString( options.lastRefresh )) {
        options.lastRefresh = new Date( options.lastRefresh );
    }

    if (options.lastUpdate && dash.isString( options.lastUpdate )) {
        options.lastUpdate = new Date( options.lastUpdate );
    }

    this.push = function(obj) {
        list.push( obj );
        fireListChangeEvent(obj);
    };

    this.pop = function() {
        var obj = list.pop();
        fireListChangeEvent( obj );

        return obj;
    };

    this.shift = function() {
        var obj = list.shift();
        fireListChangeEvent( obj );

        return obj;
    };

    this.unshift = function(obj) {
        list.unshift( obj );
        fireListChangeEvent( obj );
    };

    this.forEach = function(fn) {
        list.forEach( fn );
    };

    /**
     * an iterator that increments an index;
     *
     * use: container.forEachIndex(function(item, idx) {
     *      if (idx === 3) doSomething( item );
     * }, 1);
     *
     * @param fn - the iterator callback
     * @param idx - the initial index, defaults to 0 (zero)
     */
    this.forEachIndex = function(fn, idx) {
        if (!idx) idx = 0;

        list.forEach(function(item) {
            fn( item, idx++ );
        });
    };

    /**
     * sort the internal array in place, i.e. modify the original array
     *
     * @param fn - the sorter
     * @returns sorted list
     */
    this.sort = function(fn) {
        if (fn) {
            list.sort( fn );
        } else if (typeof sorter === 'function') {
            list.sort( sorter );
        } else {
            list.sort();
        }

        return list;
    };

    /**
     * enables the primary sorter to be assigned to the object
     *
     * @param fn - the sorter
     */
    this.setSorter = function(fn) {
        sorter = fn;
    };

    this.getList = function() {
        return list;
    };

    this.setList = function(collection) {
        list = collection;
    };

    /**
     * clear all contents from the current array
     */
    this.clear = function() {
        if (list.length > 0) {
            fireListChangeEvent( list );
        }

        list.splice( 0 );
    };

    /**
     * return the lenght of the current array
     *
     * @returns the array length
     */
    this.size = function() {
        return list.length;
    };

    /**
     * serialize this object
     *
     * @returns the json string
     */
    this.stringify = function() {
        var obj = {
            lastRefresh:container.lastRefresh,
            list:list
        };

        return JSON.stringify( obj );
    };

    // events

    this.onListChange = function(fn) {
        container.on( ListContainer.LIST_CHANGE_EVENT, fn );
    };

    this.onDataChange = function(fn) {
        container.on( ListContainer.MODEL_CHANGE_EVENT, fn );
    };

    this.updateModel = function(oldValue, newValue) {

    };

    // private methods
    var fireListChangeEvent = function(obj) {
        list.lastUpdate = new Date();
        if (container.listeners( ListContainer.LIST_CHANGE_EVENT ).length > 0) {
            dash.defer(function() {
                container.emit( ListContainer.LIST_CHANGE_EVENT, obj );
            });
        }
    };

    var fireDataChangeEvent = function(olddata, newdata) {
        list.lastUpdate = new Date();


    };

    /**
     * manually track the last date/time this collection was refreshed
     */
    this.lastRefresh = options.lastRefresh;

    this.lastUpdate = options.lastUpdate;

    events.EventEmitter.call( this );
};

util.inherits( ListContainer, events.EventEmitter );

ListContainer.LIST_CHANGE_EVENT = 'listContainer.listChangeEvent';
ListContainer.MODEL_CHANGE_EVENT = 'listContainer'

/**
 * extent methods of this object to a child object
 *
 * @param child - the extending object
 * @param options - opts passed to constructor
 */
ListContainer.extend = function(child, options) {
    'use strict';

    var parent = new ListContainer( options );

    dash.methods( parent ).forEach( function( method ) {
        child[ method ] = parent[ method ];
    } );

    return parent;
};

ListContainer.parse = function(json) {
    'use strict';

    var obj = JSON.parse( json ),
        container = new ListContainer( obj );

    return container;
};

module.exports = ListContainer;