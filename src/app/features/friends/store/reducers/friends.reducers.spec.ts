import { friendsReducer } from './friends.reducers';
import * as actions from '../actions/friends.actions';
import { friendsFeatureKey } from '../friends-store.types';
import { fiveFriendsList } from '../../models/friends.mocks';

describe('Friend Reducers Tests', () => {
  let initialState: { [k: string]: any } = {};
  initialState[friendsFeatureKey] = {};

  it('should update state when receiving loadFriendListNextPage action', () => {
    const expected = {
      friends: [],
      listContext: {
        currentPage: 0,
        error: undefined,
        pageSize: 0,
        loading: true,
        pageCount: 0,
      },
    };

    const action = actions.loadFriendListNextPage({ pageSize: 2 });
    const res = friendsReducer(undefined, action);
    expect(res).toEqual(expected);
  });

  it('should update state when receiving loadFriendListNextPageSuccess action', () => {
    const expected = {
      friends: fiveFriendsList,
      listContext: {
        currentPage: 1,
        pageSize: 5,
        loading: false,
        pageCount: 6,
      },
    };

    const action = actions.loadFriendListNextPageSuccess({
      currentPage: 1,
      pageSize: 5,
      pageCount: 6,
      friendsReceived: fiveFriendsList,
    });

    const res = friendsReducer(undefined, action);
    expect(res).toEqual(expected);
  });
});
