import {SET_UID, UPDATE_PLAYERS, UPDATE_DOCKET, UPDATE_BILLS, UPDATE_VOTES} from '../sockets_client';
export default function(state = {
	uid: -1,
	players: [],
	docket: [],
	bills: [],
	votes: []
}, action)
{
	switch (action.type)
	{
		case SET_UID:
			return {...state, uid: action.uid}
		case UPDATE_PLAYERS:
			return {...state, players: action.players}
		case UPDATE_DOCKET:
			return {...state, docket: actions.docket}
		case UPDATE_VOTES:
			return {...state, votes: action.votes}
		default:
			return state;
	}
}