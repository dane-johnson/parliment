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
	socket.emit("cosignBill", {bill: bill});
}
export function addToDocket(item)
{
	socket.emit("addToDocket", {item:item});
}
export function voteOnDocket(vote)
{
	socket.emit("voteOnDocket", {vote: vote});
}
export function voteOnBill(vote)
{
	socket.emit("voteOnBill", {vote: vote});
}