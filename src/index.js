function eval() {
    // Do not use eval!!!
    return;
}

const exprPattern = /(\d+\.?\d*?)\s*(\+|-|\/|\*)\s*(\d+)/;
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

function expressionCalculator(expr) {
	const isZeroDivision = expr.match(zeroDivisionPattern)

	if (isZeroDivision) {
		throw new TypeError('TypeError: Division by zero.');
	}

    const exp = getExpression(expr);

    if (!exp) {
    	return parseFloat(expr);
    }

    if (!calculator[exp[2]]) return;



    let result = calculator[exp[2]](+exp[1], +exp[3]);
    
    expr = expr.replace(exprPattern, result);
    
    console.log(expr)

    return expressionCalculator(expr);
}

const expr = " 59 - 13 + (  25 * 22 / (  47 / 38 * (  64 / 93 - 91 + 72  ) * 66  ) + 43 - 5  ) * 39 / 55 "
console.log('72.6846 = ', expressionCalculator(expr))

/*module.exports = {
    expressionCalculator
}*/