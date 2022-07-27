import {createAction, props} from '@ngrx/store';
import {Friend} from '../../models/friends.types';

export const loadFriendPage = createAction(
    '[Friends Component] load page',
    props<{ page: number, pageSize: number }>()
);

export const loadFriendPageSucess = createAction(
    '[Friends Component] load page success',
    props<{ page: number, pageSize: number, friendsReceived: Friend[] }>()
);

export const loadFriendPageError = createAction(
    '[Friends Component] load page fail',
    props<{ code: string, description: string }>()
);
