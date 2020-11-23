function toDecimals(num, dec) {
	if (num === null || num === undefined) {
		return '-';
	}
	return num.toFixed(dec);
}

function isPositive(el) {
	if (el.textContent === null || el.textContent === undefined) {
		return;
	}
	// Check if number in an element is positive/negative
	const float = parseFloat(el.textContent);
	if (float > 0) {
		el.classList.add('positive');
	}
	else if (float == 0) {
		el.classList.add('neutral');
	}
	else {
		el.classList.add('negative');
	}
	return;
}

function separateThousands(x) {
	if (x === null || x === undefined) {
		return '-';
	}
	return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

function addLeadingZero(num) {
	return (num < 10 ? '0' + num : num);
}

// CHANGE CURRENCY
const currencyChoices = document.querySelectorAll('.currency-choice');
currencyChoices.forEach((currencyChoice) => {
	currencyChoice.addEventListener('click', () => {
		currencySign = currencyChoice.dataset.symbol;
		currency = currencyChoice.dataset.code;
		table.innerHTML = '';
		page = 1;
		getCoins();
	});
});
