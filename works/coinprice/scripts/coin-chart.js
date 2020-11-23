const ctx = document.querySelector('.coin_stats__chart').getContext('2d');

// VERTICAL LINE WHEN HOVERING CHART
Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
   draw: function(ease) {
      Chart.controllers.line.prototype.draw.call(this, ease);

      if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
         var activePoint = this.chart.tooltip._active[0],
             ctx = this.chart.ctx,
             x = activePoint.tooltipPosition().x,
             topY = this.chart.legend.bottom,
             bottomY = this.chart.chartArea.bottom;

         // draw line
         ctx.save();
         ctx.beginPath();
         ctx.moveTo(x, topY);
         ctx.lineTo(x, bottomY);
         ctx.lineWidth = 1;
         ctx.strokeStyle = 'rgba(56, 128, 58, .25)';
         ctx.stroke();
         ctx.restore();
      }
   }
});

// CREATE CHART
const chart = new Chart(ctx, {
	type: 'LineWithLine',
	data: {
		labels: [],
		datasets: [{
			label: 'Price',
			yAxisID: 'right',
			backgroundColor: 'transparent',
			borderColor: 'rgb(56, 128, 58)',
			data: [],
			pointRadius: 0
		},
		{
			label: 'Market Cap',
			yAxisID: 'left',
			backgroundColor: 'transparent',
			borderColor: 'rgb(255, 99, 132)',
			borderWidth: 2,
			data: [],
			pointRadius: 0
		}]
	},
	options: {
		animation: { duration: 0 },
		responsiveAnimationDuration: 0,
		hover: { 
			animationDuration: 0, 
			mode: 'index',
			intersect: false
		},
		elements: { line: { tension: 0 } },
		responsive: true,
        tooltips: {
			mode: 'index',
			intersect: false,
			callbacks: {
				title: function(tooltipItem) {
					//Show time of day on tooltip title
					return this._data.labels[tooltipItem[0].index];
				},
				label: function(tooltipItems) { 
					//Separate thousands
					return separateThousands(tooltipItems.yLabel);
				}
			}
		},
		scales: {
			xAxes: [{
				ticks: {
					maxTicksLimit: 15,
					userCallback: function(time) {
						const key = document.querySelector('.active').dataset.key;
						if (key == 1 || key == 7) {
							//Remove year for charts with short timespan
							return time.slice(0, 7) + time.slice(-5);
						} else {
							// Remove time of day for charts with longer timespan
							return time.slice(0, -6);
						}
					}
				}
			}],
			yAxes: [{
			  	id: 'left',
			  	type: 'linear',
			  	position: 'left',
			  	ticks: {
					userCallback: function(value) {
							return value.toLocaleString();
						}
			  	}
			}, {
			  	id: 'right',
			  	type: 'linear',
			  	position: 'right',
			  	ticks: {
					userCallback: function(value) {
						return value.toLocaleString();
					}
			  	}
			}]
		}
	}
});

// GET COIN CHART DATA
async function getCoinChart(coinId, name, days = 30) {
	//fetch coin information
	const data = await axios
		.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
			params : {
				vs_currency : currency,
				days : days
			}
		})
		.catch((err) => {
			if (err.response.status === 404) {
				return null;
            }
            console.log(err.response);
			throw err;
		});
		
	// If default filter is set, mark btn as active
	if (days === 30) {
		document.querySelector('#default-filter').classList.add('active');
	}
	//update current coin trackers
	currentCoin = name;
	currentId = coinId;

	// PRINT CHART
	const coinChart = data.data;
	// x-axis, labels
	let dates = [];
	// y-axis (right), data / coin prices
    let prices = [];
	// y-axis (left), data / market caps
    let caps = [];
    // extract dates to array
    for (price of coinChart.prices) {
        const newDate = new Date(price[0]);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const year = newDate.getFullYear();
        const month = months[newDate.getMonth()];
        const date = newDate.getDate();
        const hours = addLeadingZero(newDate.getHours());
        const minutes = addLeadingZero(newDate.getMinutes());
        
		let time =  date + '.' + month + ' ' + year + ' ' + hours + ':' + minutes;

        dates.push(time);
	}
    // extract prices to array
    for (price of coinChart.prices) {
		// adjust decimals to price
		if (price[1] >= 1000) {
			prices.push(toDecimals(price[1], 1));
		} else if (price[1] > 10) {
			prices.push(toDecimals(price[1], 3));
		} else if (price[1] > .1) {
			prices.push(toDecimals(price[1], 5));
		} else {
			prices.push(toDecimals(price[1], 8));
		}
	}
	
    // extract market caps to array
    for (cap of coinChart.market_caps) {
		caps.push(cap[1]);
	}
	// Add new data to chart
	chart.data.datasets[0].data = prices;
	chart.data.datasets[0].label = `${name} price`;
	chart.data.datasets[1].data = caps;
	chart.data.datasets[1].label = `${name} market cap`;
	chart.data.labels = dates;
	// Update chart
	chart.update();
}

// FILTER BUTTONS
const filterBtns = document.querySelectorAll('.btn--chart-filter');

filterBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		//remove 'active' class from other btns
		filterBtns.forEach((btn) => btn.classList.remove('active'));
		//add 'active class to pressed btn
		btn.classList.add('active')
		
		// UPDATE CHART
		getCoinChart(currentId, currentCoin, btn.dataset.key);
	});
})