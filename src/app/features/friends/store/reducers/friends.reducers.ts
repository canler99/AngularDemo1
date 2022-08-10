import { createReducer, on } from '@ngrx/store';
import { FriendsState } from '../friends-store.types';
import * as actions from '../actions/friends.actions';
import { Friend } from '../../models/friends.types';

export const initialState: FriendsState = {
  friends: [],
  listContext: {
    currentPage: 0,
    pageSize: 0,
    loading: false,
    pageCount: 0,
  },
};

export const friendsReducer = createReducer(
  initialState,
  on(actions.loadFriendListNextPage, state => ({
    ...state,
    listContext: { ...state.listContext, loading: true, error: undefined },
  })),
  on(
    actions.loadFriendListNextPageSuccess,
    (state, { currentPage, pageSize, pageCount, friendsReceived }) => ({
      ...state,
      listContext: { currentPage, pageSize, pageCount, loading: false },
      friends: [...state.friends, ...friendsReceived],
    })
  ),
  on(actions.loadFriendListDone, state => ({
    ...state,
    listContext: { ...state.listContext, loading: false },
  })),
  on(actions.loadFriendListNextPageError, (state, error) => ({
    ...state,
    listContext: { ...state.listContext, loading: false, error },
    loading: false,
  })),
  on(actions.friendAdded, (state, { friend }) => {
    let newFriendList = [...state.friends];
    newFriendList.push({ ...friend });

    return { ...state, friends: newFriendList };
  }),
  on(actions.friendUpdated, (state, { friend }) => {
    const itemIndex = state.friends.findIndex(
      (item: Friend) => item.id === friend.id
    );
    let newFriendList = [...state.friends];
    if (itemIndex >= 0) {
      newFriendList[itemIndex] = friend;
    }

    return { ...state, friends: newFriendList };
  }),
  on(actions.friendDeleted, (state, { friend }) => {
    const itemIndex = state.friends.findIndex(
      (item: Friend) => item.id === friend.id
    );
    let newFriendList = [...state.friends];
    newFriendList.splice(itemIndex, 1);

    return { ...state, friends: newFriendList };
  })
);
