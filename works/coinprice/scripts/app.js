const table = document.querySelector('.table-body');
let currencySign = '$';
let currency = 'usd';
const perPage = '50';
let page = 1;
let currentCoin, currentId;

//GET COINS FROM API
async function getCoins() {
	//fetch coinlist
	const coinList = await axios
		.get(
			`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_rank_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`
		)
		.catch((err) => {
			if (err.response.status === 404) {
				return null;
			}
			throw err;
		});
	//print data
	printCoins(coinList.data);
}

//PRINT COINS TO TABLE
function printCoins(coins) {
	for (let coin of coins) {
		// Create table row for coin and table data for each data point
		const row = document.createElement('tr');
		const rank = document.createElement('td');
		const rankT = document.createTextNode(coin.market_cap_rank);
		const name = document.createElement('td');
		const nameT = document.createTextNode(coin.name);
		const tick = document.createElement('td');
		const tickT = document.createTextNode(coin.symbol.toUpperCase());
		const cap = document.createElement('td');
		const capT = document.createTextNode(
			`${currencySign}${separateThousands(coin.market_cap)}`
		);
		const price = document.createElement('td');
		const priceT = document.createTextNode(
			`${currencySign}${separateThousands(coin.current_price)}`
		);
		const vol = document.createElement('td');
		const volT = document.createTextNode(
			`${currencySign}${separateThousands(coin.total_volume)}`
		);
		const supply = document.createElement('td');
		const supplyT = document.createTextNode(
			separateThousands(toDecimals(parseFloat(coin.circulating_supply), 0))
		);
		const change = document.createElement('td');
		const changeT = document.createTextNode(
			`${toDecimals(coin.price_change_percentage_24h_in_currency, 2)}%`
		);
		row.classList.add('table-row');
		name.classList.add('table-bold');
		name.classList.add('coin-id');
		name.dataset.id = `${coin.id}`
		name.addEventListener('click', () => {
			getSingleCoin(name.dataset.id);
			getCoinChart(name.dataset.id, coin.name);
		})

		//append textNode to td
		rank.appendChild(rankT);
		name.appendChild(nameT);
		tick.appendChild(tickT);
		cap.appendChild(capT);
		price.appendChild(priceT);
		vol.appendChild(volT);
		supply.appendChild(supplyT);
		change.appendChild(changeT);

		isPositive(change);
		//append td's to tr
		row.appendChild(rank);
		row.appendChild(name);
		row.appendChild(tick);
		row.appendChild(cap);
		row.appendChild(price);
		row.appendChild(vol);
		row.appendChild(supply);
		row.appendChild(change);
		//append row to table
		table.appendChild(row);
	}
}

// LOAD COINS
const loadBtn = document.querySelector('.btn--load');
loadBtn.addEventListener('click', () => {
	page++;
	getCoins();
	//Sort coins after rank
	sortTable(0, "reverse");
});

// CHANGE PAGE
const prevPage = document.querySelector('#prev-page');
const nextPage = document.querySelector('#next-page');
prevPage.addEventListener('click', () => {
	if (page === 1) {
		return;
	}
	page--;
	table.innerHTML = '';
	getCoins();
});
nextPage.addEventListener('click', () => {
	page++;
	table.innerHTML = '';
	getCoins();
});

//LOAD INITIAL TABLE (TOP 50)
getCoins();