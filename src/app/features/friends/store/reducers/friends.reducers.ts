import {createReducer, on} from '@ngrx/store';
import {FriendsState} from '../friends-store.types';
import * as actions from '../actions/friends.actions';

export const initialState: FriendsState = {
    friends: [],
    listContext: {
        currentPage: 0,
        pageSize: 0,
        loading: false,
        pageCount: 0,
    }
};

export const friendsReducer = createReducer(
    initialState,
    on(actions.loadFriendListNextPage, (state) => ({
        ...state,
        listContext: {...state.listContext, loading: true, error: undefined},
    })),
    on(actions.loadFriendListNextPageSuccess, (state, {currentPage, pageSize, pageCount, friendsReceived}) => ({
        ...state,
        listContext: {currentPage, pageSize, pageCount, loading: false},
        friends: [...state.friends, ...friendsReceived],
    })),
    on(actions.loadFriendListDone, state => ({
        ...state,
        listContext: {...state.listContext, loading: false},
    })),
    on(actions.loadFriendListNextPageError, (state, error) => ({
        ...state,
        listContext: {...state.listContext, loading: false, error},
        loading: false,
    })),
);
