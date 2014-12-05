/**
 * @class ListContainer
 *
 * @author: darryl.west@roundpeg.com
 * @created: 12/4/14 8:49 AM
 */
var dash = require('lodash');

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

    this.push = function(obj) {
        list.push( obj );
    };

    this.pop = function() {
        return list.pop();
    };

    this.shift = function() {
        return list.shift();
    };

    this.unshift = function(obj) {
        list.unshift( obj );
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

    /**
     * manually track the last date/time this collection was refreshed
     */
    this.lastRefresh = options.lastRefresh;
};

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