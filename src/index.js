class Parliment
{
	constructor()
	{
		this.delegates = [];
		this.floor = new Floor();
		this.procedures = [];
		this.specialInterests = [];
	}
	addDelegate(delegate)
	{
		this.delegates.push(delegate)
	}
}

class Floor
{
	constructor()
	{
		this.bills = [];
		this.docket = new Docket();
	}
	addBill(bill)
	{
		this.bills.push(bill);
	}
}

class Delegate
{
	constructor(name, specialInterestName)
	{
		this.name = name;
		this.specialInterest = new SpecialInterest(specialInterestName);
	}
}

class SpecialInterest
{
	constructor(name)
	{
		this.name = name;
	}
}

class Party
{
	constructor(name)
	{
		this.name = name;
		this.delegates = [];
	}
	addDelegate(delegate)
	{
		delegate.party = this;
		this.delegates.push(delegate);
	}
}

class Bill
{
	static nBills = 1;
	constructor(name, authors, cosigners)
	{
		this.name = name;
		this.authors = authors;
		this.cosigners = cosigners;
		this.no = Bill.nBills++;
	}
}

class Docket
{
	constructor()
	{
		this.items = [];
	}
	peek()
	{
		return this.items[0];
	}
	shift()
	{
		return this.items.shift();
	}
	push(item)
	{
		this.items.push(item);
	}
	vote(item, ayes, nays)
	{
		//STUB
		return true;
	}
}

class Item
{
	constructor(introducee)
	{
		this.introducee = introducee;
	}
}

class Recess extends Item
{
	constructor(introducee, length)
	{
		super(introducee);
		this.length = length;
	}
}

class Vote extends Item
{
	constructor(introducee, bill)
	{
		super(introducee);
		this.bill = bill;
	}
}

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
for(var d of parliment.delegates)
{
	console.log("Representative %s of the %s party, secretly here supporting %s", d.name, d.party.name, d.specialInterest.name);
}

var v1 = new Recess(d2, 10);

var b1 = new Bill("Give every whale an easily spotted home.", [d1], []);
parliment.floor.addBill(b1);
var v2 = new Vote(d1, b1);

parliment.floor.docket.push(v1);
parliment.floor.docket.push(v2);

var item;
while(item = parliment.floor.docket.shift())
{
	console.log("Next on the docket...")
	if (item instanceof Recess)
	{
		console.log("A recess for %d minutes introduced by Representative %s.", item.length, item.introducee.name);
	}
	else if (item instanceof Vote)
	{
		console.log("Vote on HB%d: \"%s\", introduced by Representative %s", item.bill.no, item.bill.name, item.introducee.name);
	}

	console.log("All in favor say \"Aye\".");
	console.log("All opposed say \"Nay\".");
	if(parliment.floor.docket.vote(item, 1, 1))
	{
		console.log("The Ayes have it.");
		if (item instanceof Vote)
		{
			var authors = item.bill.authors.map((a) => a.name).reduce((a, b) => a + ", " + b)
			console.log("The bill is authored by %s", authors);
		}
	}
	else
	{
		console.log("The Nays have it.");
	}
}

