/**
 * @class ListContainerTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 12/4/14 8:51 AM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    items = require('./fixtures/test-list.json' ),
    ListContainer = require('../lib/ListContainer' );

describe('ListContainer', function() {
    'use strict';

    var getList = function() {
        return dash.clone( items );
    };

    var methods = [
        'forEach',
        'forEachIndex',
        'push',
        'pop',
        'shift',
        'unshift',
        'sort',
        'setSorter',
        'getList',
        'setList',
        'size',
        'clear',
        'stringify'
    ];

    describe('#instance', function() {
        var container = new ListContainer();

        it('should create an instance of ListContainer', function() {
            should.exist( container );

            container.should.be.instanceof( ListContainer );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( container ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                container[ method ].should.be.a( 'function' );
            });
        });

        it('should accept a named array in constructor and assign to list', function() {
            var list = getList(),
                container = new ListContainer( { list:list } );

            should.exist( container );
            container.getList().length.should.equal( list.length );
        });

        it('should accept a ListContainer on construction', function() {
            var list = getList(),
                dt = new Date(),
                ref = new ListContainer( { list:list, lastRefresh:dt }),
                container = new ListContainer( ref );

            should.exist( container );
            container.getList().length.should.equal( ref.getList().length );
            container.lastRefresh.should.equal( dt );
        });
    });

    describe('#methods', function() {
        it('should push/pop items like an array', function() {
            var ref = { id:1 },
                item,
                container = new ListContainer();

            container.getList().length.should.equal( 0 );
            container.push( ref );
            container.getList().length.should.equal( 1 );

            item = container.pop();
            container.getList().length.should.equal( 0 );
            item.should.equal( ref );
        });

        it('should shift/unshift items list an array', function() {
            var ref = { id:1 },
                item,
                container = new ListContainer();

            container.getList().length.should.equal( 0 );
            container.unshift( ref );
            container.getList().length.should.equal( 1 );

            item = container.shift();
            container.getList().length.should.equal( 0 );
            item.should.equal( ref );
        });

        it('should iterate over list like an array', function() {
            var list = getList(),
                dt = new Date(),
                container = new ListContainer( { list:list, lastRefresh:dt } ),
                idx = 0;

            container.forEach(function(item) {
                item.id.should.equal( list[ idx ].id );

                idx++;
            });
        });

        it('should clear an array', function() {
            var list = getList(),
                container = new ListContainer( { list:list } );

            container.getList().length.should.equal( list.length );
            container.clear();
            container.getList().length.should.equal( 0 );
        });

        it('should return the length of the current array', function() {
            var list = getList(),
                container = new ListContainer( { list:list } );

            container.size().should.equal( list.length );
        });
    });

    describe('forEachIndex', function() {
        it('should iterate over an array and increment an index', function() {
            var list = getList(),
                container = new ListContainer( { list:list } ),
                callback,
                i = 0;

            callback = function(item, idx) {
                should.exist( item );
                should.exist( idx );

                idx.should.equal( i );

                i++;
            };

            container.forEachIndex( callback );
        });
    });

    describe('#serialize', function() {
        var list = getList(),
            dt = new Date(),
            ref = new ListContainer( { list:list, lastRefresh:dt } );

        it('should serialize and deserialize the list container', function() {
            var json = ref.stringify(),
                container;

            should.exist( json );
            container = ListContainer.parse( json );

            container.lastRefresh.should.be.a('date');

            container.lastRefresh.getTime().should.equal( ref.lastRefresh.getTime() );
            container.getList().length.should.equal( ref.getList().length );
        });
    });

    describe('extend', function() {
        it('should extend a child object with list container methods', function() {
            var list = getList(),
                dt = new Date(),
                child,
                opts = {
                    list:list,
                    lastRefresh:dt
                };

            var Child = function(options) {
                var child = this;

                ListContainer.extend( this, options );

                this.getItem = function(idx) {
                    var list = child.getList();

                    return list[ idx ];
                };
            };

            child = new Child( opts );

            should.exist( child );
            dash.methods( child ).length.should.equal( methods.length + 1 );

            child.getItem( 3 ).id.should.equal( 'e52c77a0f41365572b1386351d51becf4c3ded83' );
        });
    });
});