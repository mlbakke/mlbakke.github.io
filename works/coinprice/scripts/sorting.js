// SORTING TABLE
const ths = document.querySelectorAll('th');
// Sort table on th click
ths.forEach((th) => {
	th.addEventListener('click', () => {
		sortTable(th.dataset.key);
	});
});

function sortTable(n, dir = "default") {
	let rows,
		switching,
		i,
		x,
		y,
		shouldSwitch,
		switchcount = 0;
	switching = true;

	// Remove arrows from previous sorting
	ths.forEach(function(element) {
		//get span from th
		const span = element.querySelector(".sorting");
		if (span !== null) {
			//if span exist, remove it
			element.removeChild(span)
		} else {
			//if span doesn't exist, check next th
			return;
		}
	})

	// Loop until no switching has been done
	while (switching) {
		// Start by saying: no switching is done:
		switching = false;
		rows = table.rows;
		// Loop through all table rows
		for (i = 0; i < rows.length - 1; i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			// Compare current row next
			x = rows[i].getElementsByTagName('TD')[n];
			y = rows[i + 1].getElementsByTagName('TD')[n];

			// If rows are name or ticker:
			if (n == 1 || n == 2) {
				// Check if the rows should switch place
				if (dir === 'reverse') {
					if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
						// If so, mark as a switch and break the loop:
						shouldSwitch = true;
						break;
					}
				}
				else if (dir === 'default') {
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						// If so, mark as a switch and break the loop:
						shouldSwitch = true;
						break;
					}
				}
			}
			else {
				// For rows with numbers, create floats without currency sign and commas
				const xNum = parseFloat(x.innerHTML.replace(/[Ξ฿¥€£$,]/g, ''));
				const yNum = parseFloat(y.innerHTML.replace(/[Ξ฿¥€£$,]/g, ''));
				if (dir === 'reverse') {
					if (xNum > yNum) {
						shouldSwitch = true;
						break;
					}
				}
				else if (dir === 'default') {
					if (xNum < yNum) {
						shouldSwitch = true;
						break;
					}
				}
			}
		}
		if (shouldSwitch) {
			/* If a switch has been marked, make the switch
            and mark that a switch has been done: */
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			// Each time a switch is done, increase switchCount by 1
			switchcount++;
		}
		else {
			/* If no switching has been done AND the direction is "default",
            set the direction to "reverse" and run the while loop again. */
			if (switchcount == 0 && dir == 'default') {
				dir = 'reverse';
				switching = true;
			}
		}
	}
	
	// Add arrow next to table header to indicate sorting direction
	if (dir === "default") {
		let span = document.createElement('span');
		span.classList.add('sorting');
		if (n == 1 || n == 2) {
			// If sorting is by name
			span.innerHTML = '&#9650';
		} else {
			// If sorting is by number
			span.innerHTML = '&#9660';
		}
		ths[n].appendChild(span);
	} else {
		let span = document.createElement('span');
		span.classList.add('sorting');
		if (n == 1 || n == 2) {
			// If sorting is by name
			span.innerHTML = '&#9660';
		} else {
			// If sorting is by number
			span.innerHTML = '&#9650';
		}
		ths[n].appendChild(span);
	}
}

//By default, sort table after rank
sortTable(0, "reverse");