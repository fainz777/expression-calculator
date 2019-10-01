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
	return operatorsPriority[newOperator] < operatorsPriority[oldOperator];
}

function removeSpaces(value) {
	return value.replace(/\s/gm, '');
}

function isBracketsPaired(expr) {
	const openBrackets = expr.match(/\(/gm);
	const closedBrackets = expr.match(/\)/gm);

	if (!openBrackets && !closedBrackets) {
		return true;
	}

	if ((!openBrackets && closedBrackets) || (openBrackets && !closedBrackets)) {
		return false;
	}

	return openBrackets.length === closedBrackets.length;
}

function getBracketsExpression(expr) {
	const bracketsPattern = /\((-)?((\d+\.?\d*)(\+|-|\*|\/)(-)?\d+(\.?\d*)*(\+|-|\*|\/)*)+\)/;
	return expr.match(bracketsPattern);
}


function expressionCalculator(expr) {
	expr = removeSpaces(expr);

	const isZeroDivision = expr.match(zeroDivisionPattern);
	let a = '';
	let b = '';
	let replacer = '';
	let operator;
	let bracketsExpr;

	if (!isBracketsPaired(expr)) {
		// ToDo
		//throw new ExpressionError('ExpressionError: Brackets must be paired');
		throw new Error('ExpressionError: Brackets must be paired');
	}

	if (isZeroDivision) {
		throw new TypeError('TypeError: Division by zero.');
	}

	bracketsExpr = getBracketsExpression(expr);

	while(bracketsExpr) {
		let result = expressionCalculator(bracketsExpr[0].slice(1, bracketsExpr[0].length - 1));
		expr = expr.replace(bracketsExpr[0], result);
		bracketsExpr = getBracketsExpression(expr);
	}

	for (let i = 0; i < expr.length; i++) {
		let sign = expr[i];
		replacer += sign;

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
					expr = expr.replace(replacer, result);

					return expressionCalculator(expr);
				}
			} else {
				a += sign;
			}

			continue;
		}

		if (isOperator(sign)) {
			if (!operator) {
				operator = sign;
			} else {
				if (isGreterOperator(operator, sign)) {
					replacer = replacer.replace(a, '').replace(operator, '');
					a = b;
					b = '';
					operator = sign;
				} else if (b) {
					let result = calculator[operator](+a, +b);
					replacer = replacer.slice(0, replacer.length - 1);
					expr = expr.replace(replacer, result);

					return expressionCalculator(expr);
				}
			}

			continue;
		}
	}

	return parseFloat(expr);
}


function expressionCalculator_v2(expr) {
	if (expr.match(/\/(\s)?0(\s?|(\+|-|\*|\/))/)) {
		throw new Error('TypeError: Division by zero.');
	}

	try {
		const result = new Function('return ' + expr)();

		return result;
	} catch (e) {
		if (e.message.match(/Unexpected token (\)|\})/)) {
			throw new Error('ExpressionError: Brackets must be paired');
		}
	}

}

module.exports = {
    expressionCalculator
}