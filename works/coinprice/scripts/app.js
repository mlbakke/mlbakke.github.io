const table = document.querySelector('.table-body');
let currencySign = '$';
let currency = 'usd';
const perPage = '50';
let page = 1;
let currentCoin, currentId;

// Add coins to table
async function addCoinsToTable() {
	//fetch coinlist
	const coinList = await axios
	.get(`https://api.coingecko.com/api/v3/coins/markets`, {
		params : {
			vs_currency : currency,
			order : 'market_cap_rank_desc',
			per_page : perPage,
			page : page,
			sparkline : 'false',
			price_change_percentage : '24h'
		}
	})
	.catch((err) => {
		if (err.response.status === 404) {
			return null;
		}
		throw err;
	});
	//print data
	const coins = coinList.data;

	// Create table row for each coin on page
	for (let coin of coins) {
		const row = document.createElement('tr');
		const rank = document.createElement('td');
		const rankT = document.createTextNode(coin.market_cap_rank);
		const name = document.createElement('td');
		const price = document.createElement('td');
		const priceT = document.createTextNode(
			`${currencySign}${separateThousands(coin.current_price)}`
		);
		const cap = document.createElement('td');
		const capT = document.createTextNode(
			`${currencySign}${separateThousands(coin.market_cap)}`
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

		//append textNodes to td
		rank.appendChild(rankT);
		name.innerHTML = `${coin.name} <span class="coin-id__ticker">${coin.symbol.toUpperCase()}</span>`;
		price.appendChild(priceT);
		cap.appendChild(capT);
		vol.appendChild(volT);
		supply.appendChild(supplyT);
		change.appendChild(changeT);
		// change color of price change based on movement
		isPositive(change);
		//append td's to tr
		row.appendChild(rank);
		row.appendChild(name);
		row.appendChild(price);
		row.appendChild(cap);
		row.appendChild(vol);
		row.appendChild(supply);
		row.appendChild(change);
		//append row to table
		table.appendChild(row);
	}
}
//Show top 50 table on load
addCoinsToTable();

// LOAD MORE COINS TO TABLE
const loadBtn = document.querySelector('.btn--load');
loadBtn.addEventListener('click', () => {
	page++;
	addCoinsToTable();
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
	addCoinsToTable();
});
nextPage.addEventListener('click', () => {
	page++;
	table.innerHTML = '';
	addCoinsToTable();
});

// GET GLOBAL MARKET STATISTICS
async function getGlobal() {
	//fetch global data
	const global = await axios
		.get(`https://api.coingecko.com/api/v3/global`)
		.catch((err) => {
			if (err.response.status === 404) {
				return null;
			}
			throw err;
		});
	//print data
    printGlobal(global.data.data);
}

function printGlobal(data) {
    document.querySelector('#global-cap').innerHTML = `$${separateThousands(toDecimals(data.total_market_cap.usd, 0))}`;
    document.querySelector('#global-change').innerHTML = `${toDecimals(data.market_cap_change_percentage_24h_usd, 2)}%`;
    document.querySelector('#global-volume').innerHTML = `$${separateThousands(toDecimals(data.total_volume.usd, 0))}`;
    document.querySelector('#btc-dominance').innerHTML = `${toDecimals(data.market_cap_percentage.btc, 2)}%`;
}
//Show global stats on load
getGlobal();

// RELOAD PAGE ON H1 CLICK
const primeHeading = document.querySelector('.heading__primary');

primeHeading.addEventListener('click', () => location.reload());