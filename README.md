#List Container
- - - 

An array list container that augments the standard javascript array without altering the array prototype.

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
* forEachIndex
* size
* clear
* getList / setList
* sort
* setSorter
* stringify

### Instance Attributes

* lastRefresh

### Class Methods

* extend
* parse

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


## Tests

All objects are tested using gulp and mocha.  You can run tests by doing this:

~~~
	make test

    // or

    gulp test

    // or

    npm test
~~~

- - -
<p><small><em>copyright © 2014 rain city software | version 0.90.13</em></small></p>
