import {createReducer, on} from '@ngrx/store';
import {FriendsState} from '../friends-store.types';
import * as actions from '../actions/friends.actions';

export const initialState: FriendsState = {
    currentPage: 0,
    pageSize: 0,
    friends: [],
    loading: true
};

export const friendsReducer = createReducer(
    initialState,
    on(actions.loadFriendPage, (state) => ({...state, loading: true})),
    on(actions.loadFriendPageSucess, (state, {page, pageSize, friendsReceived}) => ({
        ...state,
        loading: false,
        friends: [...state.friends, ...friendsReceived],
        currentPage: page,
        pageSize
    })),
    on(actions.loadFriendPageError, (state, error) => ({...state, loading: false, error})),
);
