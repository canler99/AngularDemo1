import {Friend} from '../models/friends.types';

export const friendsFeatureKey = 'friendsState';

export interface FriendsState {
    currentPage: number,
    pageSize: number,
    loading: boolean,
    error?: {
        code: string,
        description: string
    }
    friends: Friend[],
}
