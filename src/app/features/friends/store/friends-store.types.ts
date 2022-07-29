import {Friend} from '../models/friends.types';

export const friendsFeatureKey = 'friendsState';

export interface ListContext {
    currentPage: number,
    pageSize: number,
    loading: boolean,
    pageCount: number,
    error?: {
        code: string,
        description: string
    }
}

export interface FriendsState {
    listContext: ListContext,
    friends: Friend[],
}
