/* 
* @Author: caoke
* @Date:   2015-09-18 14:22:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-09-21 17:39:01
*/

var should = require('should');
var i18n = require('../index');

describe('find key', function() {

    it('found', function() {

        i18n({ key: 'hello' })('key').should.eql('hello');
    });

    it('not found', function() {

        i18n()('key').should.eql('key');

        i18n({})('key').should.eql('key');

        i18n({ key1: 'hello' })('key').should.eql('key');

        i18n({ key1: 'hello' })('key').should.eql('key');

        var h = i18n({ key1: 'hello' });
        h.keyNotFound = function(key) {
            return '【`' + key + '` is not found!】';
        };
        h('key').should.eql('【`key` is not found!】')
    });

    it('resource merge', function() {

        i18n(
            { key: 'hello' },
            { key: 'bye' }
        )('key').should.eql('bye');

        i18n(
            { key1: 'hello' },
            { key: 'bye' }
        )('key').should.eql('bye');

        i18n(
            { key: 'hello' },
            { key1: 'bye' }
        )('key').should.eql('hello');
    });
});

describe('template', function() {

    it('params', function() {

        i18n({
            key: 'hello {1}'
        })('key').should.eql('hello ');

        i18n({
            key: 'hello {1}'
        })('key', 'world1', 'world2').should.eql('hello world1');

        i18n({
            key: 'hello {1}, {2}'
        })('key', 'world1', 'world2').should.eql('hello world1, world2');

        i18n({
            key: 'hello {1}, {1}'
        })('key', 'world1', 'world2').should.eql('hello world1, world1');

        i18n({
            key: 'hello {2}, {1}'
        })('key', 'world1', 'world2').should.eql('hello world2, world1');
    });

    it('escape', function() {

        i18n({
            key: 'hello {name}'
        })('key').should.eql('hello {name}');

        i18n({
            key: 'hello {1+1}'
        })('key').should.eql('hello {1+1}');
    });
});
