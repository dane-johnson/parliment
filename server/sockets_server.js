//Server side socket communications here
var parliment = {
	docket: [],
	delegates: [],
	bills: [],
	nextUID: 0,
	nextBID: 1,
	votes: {
		yeas: [],
		nays: []
	}
}

//Server responses to client commands
module.exports.initSockets = function(socket, clients, ioAccess)
{
	socket.on('joinGame', function(data){
		var uid = parliment.nextUID++;
		var delegate = {username: data.username, uid: uid};
		parliment.delegates.push(delgate);
		socket.emit("deliverUID", {uid: uid});
		ioAccess.emit("updatePlayers", {deligates: parliment.delegates});
	});
	socket.on('authorBill', function(data){
		var bid = parliment.nextBID++;
		var bill = data.bill;
		bill.bid = bid;
		parliment.bills.push(bill);
		ioAccess.emit("updateBills", {bills: parliment.bills});
	});
	socket.on('cosignBill', function(data){
		parliment.bills.find((bill)=>bill.bid==data.bid).cosigners.push(data.uid);
		ioAccess.emit("updateBills", {bills: parliment.bills});
	});
	socket.on('addToDocket', function(data){
		item = data.item;
		parliment.docket.push(item);
		ioAccess.emit("updateDocket", {docket: parliement.docket});
	});
	socket.on('castVote', function(data){
		if(data.vote == "yea")
		{
			parliement.votes.yeas.push(data.uid);
		} else
		{
			parliment.votes.nays.push(data.uid);
		}

		ioAccess.emit("updateVotes", {votes: parliment.votes});
	});
}