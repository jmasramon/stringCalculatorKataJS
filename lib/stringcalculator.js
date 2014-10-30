/*
 *
 * https://github.com/jmasramon/stringcalculator
 *
 * Copyright (c) 2014 Jordi Masramon
 * Licensed under the MIT license.
 */

'use strict';

/*jshint unused: true, node: true */
function operandsAreEmpty(operands) {
    return !operands[0];
}

function operandIsNaN(operand) {
    return isNaN(parseInt(operand, 10));
}

function operandIsNegative(operand) {
    return (parseInt(operand, 10) < 0);
}

function operandIsWithinRange(operand) {
    return (parseInt(operand, 10) <= 1000);
}

function addEachOperand(operands) {
    var result = 0;
    for (var operand in operands) {
        if (operandIsNaN(operands[operand])) {
            throw new Error('One operand is not a valid number');
        } else if (operandIsNegative(operands[operand])) {
            throw new Error('There are negative operands: [' + operands[operand] + ']');
        } else if (operandIsWithinRange(operands[operand])) {
            result += parseInt(operands[operand], 10);
        }
    }
    return result;
}

function thereIsProvidedDelimiter(numbersString) {
    return (numbersString.slice(0, 2) === '//');
}

function thereIsLenghtyDelimiter(numbersString) {
    return (numbersString.slice(0, 3) === '//[');
}

function thereIsMultipleDelimiters(numbersString) {
    return (numbersString.indexOf('][') !== -1);
}

function createValidSeparators (newSeparators) {
    var validSeparators;

    validSeparators = new RegExp('[,' + newSeparators + '\\n]+', 'i');

    return validSeparators;
}

function extractMultipleDelimiters(numbersString) {
    var validSeparators,
        onlyNumbersString;
    
    var re = new RegExp('\\[(.*)\\]');
    var res = numbersString.match(re);

    validSeparators = createValidSeparators(res[0][1] + res[0][4]);
    onlyNumbersString = numbersString.slice(9);

    return {
        valid_separators: validSeparators,
        only_numbers_string: onlyNumbersString
    };
}

function extractElements(numbersString, separatorStart, separatorStop, numbersStart) {
    var validSeparators,
        onlyNumbersString;

    validSeparators = createValidSeparators(numbersString.slice(separatorStart, separatorStop));
    onlyNumbersString = numbersString.slice(numbersStart);

    return {
        valid_separators: validSeparators,
        only_numbers_string: onlyNumbersString
    };
}

function parseDelimiter(numbersString) {
    var validSeparators = /[,\n]/;

    if (thereIsProvidedDelimiter(numbersString)) {
        if (thereIsLenghtyDelimiter(numbersString)) {
            if (thereIsMultipleDelimiters(numbersString)) {
                return extractMultipleDelimiters(numbersString);
            } else {
                return extractElements(numbersString, 3, 4, numbersString.indexOf(']') + 2);
            }
        } else {
            return extractElements(numbersString, 2, 3, 4);
        }
    } else {
        return {
            valid_separators: validSeparators,
            only_numbers_string: numbersString
        };
    }
}

function parseOperators(numbersString) {
    var resObj;

    resObj = parseDelimiter(numbersString);

    return resObj.only_numbers_string.split(resObj.valid_separators);
}

exports.add = function(numbers) {
    var operands, result;

    operands = parseOperators(numbers);
    result = 0;

    if (operandsAreEmpty(operands)) {
        return 0;
    } else {
        return addEachOperand(operands);
    }
};