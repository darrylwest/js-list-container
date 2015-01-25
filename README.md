#List Container
- - - 

An evented array list container that augments the standard javascript array without altering the array prototype. Events fire when the array changes or when a contained value or model changes.

[![NPM version](https://badge.fury.io/js/js-list-container.svg)](http://badge.fury.io/js/js-list-container) [![Build Status](https://travis-ci.org/darrylwest/js-list-container.svg?branch=master)](https://travis-ci.org/darrylwest/js-list-container) [![Dependency Status](https://david-dm.org/darrylwest/js-list-container.svg)](https://david-dm.org/darrylwest/js-list-container)

## Overview

A simple wrapper/container for array lists that provides a base class to extend without modifying the javascript Array prototype.

## Installation

~~~
	npm install js-list-container --save
~~~

## API

### Instance Methods
* push/pop
* shift/unshift
* forEach
* forEachIndex - iterator with index
* size
* clear
* getList / setList
* sort
* setSorter
* stringify
* updateModel - will trigger data model change event

### Instance Attributes

* lastRefresh
* lastUpdate

### Class Methods

* extend
* parse

### Events

* onListChange - whenever the list size changes
* onDataChange - when a contained object changed through updateModel()

## Use

Simple use without extension...

~~~
var ListContainer = require('js-list-container'),
	options = {},
	container;
	
options.list = require('./list.json');
options.lastRefresh = new Date();
	
container = new ListContainer( options );
	
container.size() === options.list.length;
	
container.forEach(function(item) {
	console.log( item );
});
~~~

Simple extension use case...

~~~
var MyCollection = function(options) {
	var container = this;
	
	ListContainer.extend( this, options );
	
	this.getItem = function(index) {
		var list = container.getList();
		
		return list[ index ];
	};
};

var collection = new MyCollection( opts );
	
collection.push( { id:1, created:new Date() } );
collection.push( { id:2, created:new Date() } );
	
collection.size() === 2;
	
var item = collection.getItem( 1 );
item.id === 2;	
~~~

Evented Example

~~~
var dash = require('lodash'),
	ListContainer = require('js-list-container'),
	options = {},
	container;
	
options.list = require('./list.json');
options.lastRefresh = new Date();
	
container = new ListContainer( options );

container.onListChange(function() {
    console.log( 'list changed: ', container.lastChangeDate );
});

container.onDataChange(function(oldValue, newValue) {
	console.log( 'data changed: ', container.lastChangeDate );
});

// copy of one of the contained models
var originalModel = container.getList()[ 3 ],
	changeModel = dash.clone( original );

changeModel.title = 'My New Title';

// do the change will file a data change event and return true
container.updateModel( originalModel, changeModel ) === true;

// this will fire a list change event
var popped = container.pop();

// this will also fire a list change event
container.clear();

// this will not fire a data change event
container.updateModel( originalModel, changeModel ) === false;
~~~


## Tests

All objects are tested using gulp and mocha.  You can run tests by doing this:

~~~
	make test

    // or
    
    make watch
    
    // or

    gulp test

    // or

    npm test
~~~

- - -
<p><small><em>copyright © 2014-2015 rain city software | version 0.90.16</em></small></p>
