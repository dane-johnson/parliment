import io from 'socket.io-client';

var socket = io();

export function initSockets(store)
{
	//TODO
}

//Export client-side socket functions
export function joinGame(username)
{
	socket.emit("joinGame", {username: username});
}
export function authorBill(bill)
{
	socket.emit("authorBill", {bill: bill});
}
export function cosignBill(bill)
{
	socket.emit("cosignBill", {bid: bid, uid: uid});
}
export function addToDocket(item)
{
	socket.emit("addToDocket", {item: item});
}
export function castVote(vote)
{
	socket.emit("castVote", {vote: vote, uid: uid});
}