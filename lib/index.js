"use strict";

var _classes = require("./classes");

var parliment = new _classes.Parliment();
var d1 = new _classes.Delegate("Dane", "Legalised Whaling");
var d2 = new _classes.Delegate("Cole", "Graymatter Removal");

var p1 = new _classes.Party("Demoshits");
p1.addDelegate(d1);

var p2 = new _classes.Party("Republiturds");
p2.addDelegate(d2);

parliment.addDelegate(d1);
parliment.addDelegate(d2);

console.log("Roll Call!");
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
	for (var _iterator = parliment.delegates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		var d = _step.value;

		console.log("Representative %s of the %s party, secretly here supporting %s", d.name, d.party.name, d.specialInterest.name);
	}
} catch (err) {
	_didIteratorError = true;
	_iteratorError = err;
} finally {
	try {
		if (!_iteratorNormalCompletion && _iterator.return) {
			_iterator.return();
		}
	} finally {
		if (_didIteratorError) {
			throw _iteratorError;
		}
	}
}

var v1 = new _classes.Recess(d2, 10);

var b1 = new _classes.Bill("Give every whale an easily spotted home.", [d1], []);
parliment.floor.addBill(b1);
var v2 = new _classes.Vote(d1, b1);

parliment.floor.docket.push(v1);
parliment.floor.docket.push(v2);

var item;
while (item = parliment.floor.docket.shift()) {
	console.log("Next on the docket...");
	if (item instanceof _classes.Recess) {
		console.log("A recess for %d minutes introduced by Representative %s.", item.length, item.introducee.name);
	} else if (item instanceof _classes.Vote) {
		console.log("Vote on HB%d: \"%s\", introduced by Representative %s", item.bill.no, item.bill.name, item.introducee.name);
	}

	console.log("All in favor say \"Aye\".");
	console.log("All opposed say \"Nay\".");
	if (parliment.floor.docket.vote(item, 1, 1)) {
		console.log("The Ayes have it.");
		if (item instanceof _classes.Vote) {
			var authors = item.bill.authors.map(function (a) {
				return a.name;
			}).reduce(function (a, b) {
				return a + ", " + b;
			});
			console.log("The bill is authored by %s", authors);
		}
	} else {
		console.log("The Nays have it.");
	}
}