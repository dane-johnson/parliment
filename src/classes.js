export class Parliment
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

export class Floor
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

export class Delegate
{
	constructor(name, specialInterestName)
	{
		this.name = name;
		this.specialInterest = new SpecialInterest(specialInterestName);
	}
}

export class SpecialInterest
{
	constructor(name)
	{
		this.name = name;
	}
}

export class Party
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

export class Bill
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

export class Docket
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

export class Item
{
	constructor(introducee)
	{
		this.introducee = introducee;
	}
}

export class Recess extends Item
{
	constructor(introducee, length)
	{
		super(introducee);
		this.length = length;
	}
}

export class Vote extends Item
{
	constructor(introducee, bill)
	{
		super(introducee);
		this.bill = bill;
	}
}