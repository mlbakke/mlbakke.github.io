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

//Get global statistics for header
getGlobal();