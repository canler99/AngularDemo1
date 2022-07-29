import {createFeatureSelector, createSelector} from "@ngrx/store";
import {friendsFeatureKey, FriendsState, ListContext} from '../friends-store.types';

export const selectFeature = createFeatureSelector<FriendsState>(friendsFeatureKey);
export const selectFriends = createSelector(
    selectFeature,
    (state: FriendsState) => state.friends
);

export const selectFriendListContext = createSelector(
    selectFeature,
    (state: FriendsState) => state.listContext
);

export const selectFriendListCurrentPage = createSelector(
    selectFriendListContext,
    (context: ListContext) => context.currentPage
);
