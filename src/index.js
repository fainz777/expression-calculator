function eval() {
    // Do not use eval!!!
    return;
}

const exprPattern = /(\d+\.?\d*?)\s*(\+|-|\/|\*)\s*(\d+)/gm;
const zeroDivisionPattern = /\/\s*0/;

const calculator = {
	'+': function(a, b) {
		return a + b;
	},
	'-': function(a, b) {
		return a - b;
	},
	'*': function(a, b) {
		return a * b;
	},
	'/': function(a, b) {
		return a / b;
	}
}

function getExpression(expr) {
	return expr.match(exprPattern);
}

function calculateExpression(a, b, operator) {
	if (!calculator[operator]) {
		throw Error('Error');
	}

	return calculator[operator](a, b);
}

function __expressionCalculator(expr) {
	const isZeroDivision = expr.match(zeroDivisionPattern)

	if (isZeroDivision) {
		throw new TypeError('TypeError: Division by zero.');
	}

    const exp = getExpression(expr);

    if (!exp) {
    	return parseFloat(expr);
    }

    /*for (let i = 0; i < ) {

    }*/

    if (!calculator[exp[2]]) return;



    let result = calculator[exp[2]](+exp[1], +exp[3]);
    
    expr = expr.replace(exprPattern, result);
    
    console.log(expr)

    return expressionCalculator(expr);
}

const operators = ['+', '-', '*', '/'];
const operatorsPriority = {
	'+': 2,
	'-': 2,
	'*': 1,
	'/': 1
}

function isDigit(sign) {
	const digitRegexp = /\d|\./;
	return digitRegexp.test(sign);
}

function isSpace(sign) {
	const spaceRegexp = /\s/;
	return spaceRegexp.test(sign);
}

function isOperator(sign) {
	return operators.indexOf(sign) !== -1;
}

function isGreterOperator(oldOperator, newOperator) {
	//debugger;
	return operatorsPriority[newOperator] < operatorsPriority[oldOperator];
}

function removeSpaces(value) {
	return value.replace(/\s/gm, '');
}

function isBracketsPaired(expr) {
	//console.log('expr: ', expr)
	const openBrackets = expr.match(/\(/gm);
	const closedBrackets = expr.match(/\)/gm);

	if (!openBrackets && !closedBrackets) {
		return true;
	}

	if ((!openBrackets && closedBrackets) || (openBrackets && !closedBrackets)) {
		//console.log(openBrackets, closedBrackets)
		return false;
	}

	return openBrackets.length === closedBrackets.length;
}

function getBracketsExpression(expr) {
	//const bracketsPattern = /console.log(openBrackets.length, closedBrackets.length, expr)/;
	//const bracketsPattern = /\(((\d+\.?\d*)(\+|-|\*|\/)\d(\d+\.?\d*)*)+\)/;
	//const bracketsPattern = /\((-)?((\d+\.?\d*)(\+|-|\*|\/)\d(\d+\.?\d*)*(\+|-|\*|\/)*)+\)/;
	//const bracketsPattern = /\((-)?((\d+\.?\d*)(\+|-|\*|\/)(-)?\d(\d+\.?\d*)*(\+|-|\*|\/)*)+\)/;
	const bracketsPattern = /\((-)?((\d+\.?\d*)(\+|-|\*|\/)(-)?\d+(\.?\d*)*(\+|-|\*|\/)*)+\)/;
	return expr.match(bracketsPattern);
}


function expressionCalculator(expr) {
	expr = removeSpaces(expr);
	//console.log('expr: ', expr);
	const isZeroDivision = expr.match(zeroDivisionPattern);
	let a = '';
	let b = '';
	let replacer = '';
	let operator;

	if (!isBracketsPaired(expr)) {
		// ToDo
		 //throw new ExpressionError('ExpressionError: Brackets must be paired');
		 console.log(expr);
		throw new Error('ExpressionError: Brackets must be paired');
	}

	if (isZeroDivision) {
		throw new TypeError('TypeError: Division by zero.');
	}

	let bracketsExpr = getBracketsExpression(expr);
	

	while(bracketsExpr) {
		//console.log('bracketsExpr while: ', bracketsExpr);
		debugger;
		let result = expressionCalculator(bracketsExpr[0].slice(1, bracketsExpr[0].length - 1));
		expr = expr.replace(bracketsExpr[0], result);
		bracketsExpr = getBracketsExpression(expr);
	}

	for (let i = 0; i < expr.length; i++) {
		let sign = expr[i];
		replacer += sign;
		debugger;

		//console.log('replacer: ', replacer)
		if (sign === '-') {
			if(i === 0) {
				a += sign;
				continue;
			}
			
			if (operator && !b) {
				b += sign;
				continue;
			}
		}

		if (isDigit(sign)) {
			if (a && operator ) {
				b += sign;

				if (i == expr.length - 1) {
					let result = calculator[operator](+a, +b);
					debugger;
					expr = expr.replace(replacer, result);
					debugger;
					return expressionCalculator(expr);
				}
			} else {
				a += sign;
			}

			continue;
		}

		if (isOperator(sign)) {
			if (!operator) {
				debugger;
				operator = sign;
			} else {
				debugger;
				if (isGreterOperator(operator, sign)) {
					debugger;
					replacer = replacer.replace(a, '').replace(operator, '');
					a = b;
					b = '';
					operator = sign;
					//console.log('replacer 2: ', replacer)
					continue;
				} else if (b) {
					let result = calculator[operator](+a, +b);
					debugger;
					replacer = replacer.slice(0, replacer.length - 1);
					expr = expr.replace(replacer, result);
					debugger;
					return expressionCalculator(expr);
				}
			}

			continue;
		}
	}

	return parseFloat(expr);
}

//const expr = '2 + 2 / 2 * 3';
//const expr2 = '84 + 62 / 33 * 10 + 15'
//const expr3 = " 49 * 63 / 58 * 3"
//const expr4 = " 84 + 62 / 33 * 10 + 15 ";
//const expr5 = " 16 + 25 - 92 + 54 / 66 ";
//const expr6 = " 11 - 92 + 48 / (  (  12 / 92 + (  53 / 74 / 22 + (  61 / 24 / 42 - (  13 * 85 + 100 / 77 / 11  ) + 89  ) + 9  ) + 87  ) / 91 * 92  ) ";

//const expr2 = " 59 - 13 + (  25 * 22 / (  47 / 38 * (  64 / 93 - 91 + 72  ) * 66  ) + 43 - 5  ) * 39 / 55 "
//console.log('3 = ', expressionCalculator(expr))
//console.log('117.78787878787878 = ', expressionCalculator(expr2))
//console.log('1916.0690 = ', expressionCalculator(expr3))
//console.log('72.6846 = ', expressionCalculator(expr3))
//console.log('117.7879 = ', expressionCalculator(expr4))
//console.log('-50.1818 = ', expressionCalculator(expr5))
//console.log('-81.0516 = ', expressionCalculator(expr6))

module.exports = {
    expressionCalculator
}