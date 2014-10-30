/*global describe,it, xit, assert, expect */
'use strict';
var chai = require('chai'),
    sinonChai = require("sinon-chai"),
    stringcalculator = require('../lib/stringcalculator.js');

global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = require('sinon');
chai.use(sinonChai);
/*jshint expr:true */

function checkAddition(numberString, expectedResult) {
    expect(stringcalculator.add(numberString)).to.equal(expectedResult);
}

function getAddFunctionReference(numberString) {
    return function() {
        stringcalculator.add(numberString);
    };
}

describe('stringcalculator node module.', function() {

    describe('existence', function() {
        it('should define the add function', function() {
            expect(stringcalculator.add).to.exist;
            assert.isDefined(stringcalculator.add, "Add is defined");
            assert.isFunction(stringcalculator.add, "Add is function");
        });
    });

    describe('Single number addition', function() {
        it('it should return 0 for emtpy string', function() {
            checkAddition('', 0);
        });

        it('it should return the number for single number string', function() {
            checkAddition('1', 1);
            checkAddition('3', 3);
            checkAddition('0', 0);
        });
    });

    describe('Standard , separator multinumber addition', function() {
        it('should return the sum of a two numbers string', function() {
            checkAddition('1,1', 2);
            checkAddition('2,3', 5);
        });

        // TODO: susbstitute all for checkAddition
        it('shuld be able to sum as many numbers as provided', function() {
            expect(stringcalculator.add('1,1,1')).to.equal(3);
            expect(stringcalculator.add('1,2,3,4,5')).to.equal(15);
        });

    });

    describe('add \\n as valid separator', function() {
        it('should allow \\n as operand separator', function() {
            expect(stringcalculator.add('1\n1,1')).to.equal(3);
            expect(stringcalculator.add('1\n1\n1')).to.equal(3);
            expect(stringcalculator.add('1,1\n1')).to.equal(3);
        });

        it('shuld not accept delimiters to nothing', function() {
            var fn = getAddFunctionReference('1,1,1,');        
            expect(fn).to.throw(Error);

            fn = getAddFunctionReference('1\n1\n1\n');
            expect(fn).to.throw(Error);
        });
    });

    describe('provided delimiters', function() {
        it('should allow to provide the delimiter', function() {
            expect(stringcalculator.add('//,\n1,2')).to.equal(3);
            expect(stringcalculator.add('//;\n1;2')).to.equal(3);
            expect(stringcalculator.add('//_\n1_2')).to.equal(3);
            expect(stringcalculator.add('//&\n1&2')).to.equal(3);
        });

        it('Delimiters can be of any length with the following format:  “//[delimiter]\\n” for example: “//[,,,]\\n1,,,2,,,3” should return 6', function() {
            expect(stringcalculator.add('//[;;;]\n999;;;2')).to.equal(1001);
        });

        it('should allow multiple delimiters like this:  “//[delim1][delim2]\\n” for example “//[*][%]\\n1*2%3” should return 6.', function() {
            expect(stringcalculator.add('//[*][%]\n1*2%3')).to.equal(6);
        });

        it('should allow multiple delimiters with length longer than one char', function() {
            expect(stringcalculator.add('//[*][%]\n5**6%7')).to.equal(18);
        });


    });

    describe('Reject bad operands', function() {
        it('should throw exceptions if one element not a number', function() {
            var fn = getAddFunctionReference('1,a,1');
            expect(fn).to.throw(Error);
            expect(fn).to.throw(/One operand is not a valid number/);
        });

        it('should throw an exception for negative operands', function() {
            var fn = getAddFunctionReference('120,-1');
            expect(fn).to.throw(Error);
            expect(fn).to.throw(/There are negative operands/);
            expect(fn).to.throw(/-1/);
            
            fn = getAddFunctionReference('-120,1');
            expect(fn).to.throw(Error);
            expect(fn).to.throw(/-120/);

            fn = getAddFunctionReference('-130,-4');
            expect(fn).to.throw(Error);
            expect(fn).to.throw(/-130/);
            //TODO: should return all negative values not just the first one
            // expect(fn).to.throw(/-4/);

        });

        it('Numbers bigger than 1000 should be ignored, so adding 2 + 1001  = 2', function() {
            expect(stringcalculator.add('//:\n1001:2')).to.equal(2);
            expect(stringcalculator.add('//.\n1000.1002')).to.equal(1000);
        });

    });

    describe('Logging all additions to ILogger.write()', function() {

    });


    xit('expectation', function() {});

});