"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parliment = function () {
	function Parliment() {
		_classCallCheck(this, Parliment);

		this.delegates = [];
		this.floor = new Floor();
		this.procedures = [];
		this.specialInterests = [];
	}

	_createClass(Parliment, [{
		key: "addDelegate",
		value: function addDelegate(delegate) {
			this.delegates.push(delegate);
		}
	}]);

	return Parliment;
}();

var Floor = function () {
	function Floor() {
		_classCallCheck(this, Floor);

		this.bills = [];
		this.docket = new Docket();
	}

	_createClass(Floor, [{
		key: "addBill",
		value: function addBill(bill) {
			this.bills.push(bill);
		}
	}]);

	return Floor;
}();

var Delegate = function Delegate(name, specialInterestName) {
	_classCallCheck(this, Delegate);

	this.name = name;
	this.specialInterest = new SpecialInterest(specialInterestName);
};

var SpecialInterest = function SpecialInterest(name) {
	_classCallCheck(this, SpecialInterest);

	this.name = name;
};

var Party = function () {
	function Party(name) {
		_classCallCheck(this, Party);

		this.name = name;
		this.delegates = [];
	}

	_createClass(Party, [{
		key: "addDelegate",
		value: function addDelegate(delegate) {
			delegate.party = this;
			this.delegates.push(delegate);
		}
	}]);

	return Party;
}();

var Bill = function Bill(name) {
	_classCallCheck(this, Bill);

	this.name = name;
	this.no = Bill.nBills++;
};

Bill.nBills = 1;

var Docket = function () {
	function Docket() {
		_classCallCheck(this, Docket);

		this.items = [];
	}

	_createClass(Docket, [{
		key: "peek",
		value: function peek() {
			return this.items[0];
		}
	}, {
		key: "shift",
		value: function shift() {
			return this.items.shift();
		}
	}, {
		key: "push",
		value: function push(item) {
			this.items.push(item);
		}
	}, {
		key: "vote",
		value: function vote(item, ayes, nays) {
			//STUB
			return true;
		}
	}]);

	return Docket;
}();

var Item = function Item(introducee) {
	_classCallCheck(this, Item);

	this.introducee = introducee;
};

var Recess = function (_Item) {
	_inherits(Recess, _Item);

	function Recess(introducee, length) {
		_classCallCheck(this, Recess);

		var _this = _possibleConstructorReturn(this, (Recess.__proto__ || Object.getPrototypeOf(Recess)).call(this, introducee));

		_this.length = length;
		return _this;
	}

	return Recess;
}(Item);

var Vote = function (_Item2) {
	_inherits(Vote, _Item2);

	function Vote(introducee, bill) {
		_classCallCheck(this, Vote);

		var _this2 = _possibleConstructorReturn(this, (Vote.__proto__ || Object.getPrototypeOf(Vote)).call(this, introducee));

		_this2.bill = bill;
		return _this2;
	}

	return Vote;
}(Item);

var parliment = new Parliment();
var d1 = new Delegate("Dane", "Legalised Whaling");
var d2 = new Delegate("Cole", "Graymatter Removal");

var p1 = new Party("Demoshits");
p1.addDelegate(d1);

var p2 = new Party("Republiturds");
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

var v1 = new Recess(d2, 10);

var b1 = new Bill("Give every whale an easily spotted home.");
parliment.floor.addBill(b1);
var v2 = new Vote(d1, b1);

parliment.floor.docket.push(v1);
parliment.floor.docket.push(v2);

var item;
while (item = parliment.floor.docket.shift()) {
	console.log("Next on the docket...");
	if (item instanceof Recess) {
		console.log("A recess for %d minutes introduced by Representative %s.", item.length, item.introducee.name);
	} else if (item instanceof Vote) {
		console.log("Vote on HB%d: \"%s\", introduced by Representative %s", item.bill.no, item.bill.name, item.introducee.name);
	}

	console.log("All in favor say \"Aye\".");
	console.log("All opposed say \"Nay\".");
	if (parliment.floor.docket.vote(item, 1, 1)) {
		console.log("The Ayes have it.");
	} else {
		console.log("The Nays have it.");
	}
}