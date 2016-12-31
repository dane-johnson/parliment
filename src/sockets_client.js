import io from 'socket.io-client';

var socket = io();

export const SET_UID = 'SET_UID';
export const UPDATE_PLAYERS = 'UPDATE_PLAYERS';
export const UPDATE_BILLS = 'UPDATE_BILLS';
export const UPDATE_DOCKET = 'UPDATE_DOCKET';
export const UPDATE_VOTES = 'UPDATE_VOTES'

export function initSockets(store)
{
	socket.on("deliverUID", function(data)
	{
		const action = {
			type: SET_UID,
			uid: data.uid
		}
		store.dispatch(action);
	});

	socket.on("updatePlayers", function(data)
	{
		const action = {
			type: UPDATE_PLAYERS,
			players: data.players
		}
		store.dispatch(action);
	});

	socket.on("updateBills", function(data)
	{
		const action = {
			type: UPDATE_BILLS,
			bills: data.bills
		}
		store.dispatch(action);
	});

	socket.on("updateDocket", function(data)
	{
		const action = {
			type: UPDATE_DOCKET,
			docket: data.docket
		}
		store.dispatch(action);
	});

	socket.on("updateVotes", function(data)
	{
		const action = {
			type: UPDATE_VOTES,
			votes: data.votes
		}
		store.dispatch(action);
	});
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