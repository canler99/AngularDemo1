import {createFeatureSelector, createSelector} from "@ngrx/store";
import {friendsFeatureKey, FriendsState} from '../friends-store.types';

export const selectFeature = createFeatureSelector<FriendsState>(friendsFeatureKey);
export const selectFeatureOrders = createSelector(
    selectFeature,
    (state: FriendsState) => state.friends
);
