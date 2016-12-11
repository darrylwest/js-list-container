#List Container
- - - 

An evented array list container that augments the standard javascript array without altering the array prototype. Events fire when the array changes or when a contained value or model changes.

[![NPM version](https://badge.fury.io/js/js-list-container.svg)](http://badge.fury.io/js/js-list-container) [![Build Status](https://travis-ci.org/darrylwest/js-list-container.svg?branch=master)](https://travis-ci.org/darrylwest/js-list-container) [![Dependency Status](https://david-dm.org/darrylwest/js-list-container.svg)](https://david-dm.org/darrylwest/js-list-container)

## Overview

A simple wrapper/container for array lists that provides a base class to extend without modifying the javascript Array prototype.

## Installation

```
npm install js-list-container --save
```

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
* updateModel - will trigger data model change event
* stringify

### Instance Attributes

* lastRefresh
* lastChangeDate - updated by container with push/pop/etc

### Class Methods

* extend
* parse

### Events

* onListChange - whenever the list size changes
* onDataChange - when a contained object changed through updateModel()

## Use

Simple use without extension...

```
const ListContainer = require('js-list-container');
const options = {
	list:require('./list.json'),
	lastRefresh:new Date()
};
	
const container = new ListContainer( options );
container.size() === options.list.length;
	
container.forEach(item => {
	console.log( item );
});
```

Simple extension use case...

~~~
const MyCollection = function(options) {
	const container = this;
	
	ListContainer.extend( this, options );
	
	this.getItem = function(index) {
		var list = container.getList();
		
		return list[ index ];
	};
};

const collection = new MyCollection( opts );
	
collection.push( { id:1, created:new Date() } );
collection.push( { id:2, created:new Date() } );
	
collection.size() === 2;
	
let item = collection.getItem( 1 );
item.id === 2;	
~~~

Evented Example

~~~
const dash = require('lodash');
const ListContainer = require('js-list-container');
const options = {
	list:require('./list.json'),
	lastRefresh:new Date()
};
	
const container = new ListContainer( options );
container.onListChange(function() {
    console.log( 'list changed: ', container.lastChangeDate );
});

container.onDataChange(function(oldValue, newValue) {
	console.log( 'data changed: ', container.lastChangeDate );
});

// copy of one of the contained models
let originalModel = container.getList()[ 3 ],
	changeModel = dash.clone( original );

changeModel.title = 'My New Title';

// do the change will file a data change event and return true
container.updateModel( originalModel, changeModel ) === true;

// this will fire a list change event
let popped = container.pop();

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

    make test

    // or

    npm test
~~~

- - -
###### copyright © 2014-2016 rain city software | version 0.91.22
