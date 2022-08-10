import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  friendsFeatureKey,
  FriendsState,
  ListContext,
} from '../friends-store.types';
import { Friend } from '../../models/friends.types';

export const selectFeature =
  createFeatureSelector<FriendsState>(friendsFeatureKey);
export const selectFriends = createSelector(
  selectFeature,
  (state: FriendsState) => state.friends
);

export const selectFriend = createSelector(
  selectFriends,
  (friends: Friend[], props: { friendId: string }) => {
    const searchRes = friends.filter(
      friend => friend.id === (props.friendId ?? -1)
    );
    if (searchRes.length > 0) {
      return { ...searchRes[0] };
    }
    throw { code: '002', description: 'Friend not found in the store' };
  }
);

export const selectFriendListContext = createSelector(
  selectFeature,
  (state: FriendsState) => state.listContext
);

export const selectFriendListCurrentPage = createSelector(
  selectFriendListContext,
  (context: ListContext) => context.currentPage
);
