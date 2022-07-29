import {createAction, props} from '@ngrx/store';
import {Friend} from '../../models/friends.types';

export const loadFriendListNextPage = createAction(
    '[Friends Component] load page',
    props<{ page: number, pageSize: number }>()
);

export const loadFriendListNextPageSuccess = createAction(
    '[Friends Component] load page success',
    props<{ currentPage: number, pageSize: number, pageCount: number, friendsReceived: Friend[] }>()
);

export const loadFriendListNextPageError = createAction(
    '[Friends Component] load page fail',
    props<{ code: string, description: string }>()
);
