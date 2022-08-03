import {createAction, props} from '@ngrx/store';
import {Friend} from '../../models/friends.types';

export const loadFriendListNextPage = createAction(
    '[Friends Component] load page',
    props<{ pageSize: number }>()
);

export const loadFriendListNextPageSuccess = createAction(
    '[Friends Component] load page success',
    props<{
        currentPage: number;
        pageSize: number;
        pageCount: number;
        friendsReceived: Friend[];
    }>()
);

export const loadFriendListNextPageError = createAction(
    '[Friends Component] load page fail',
    props<{ code: string; description: string }>()
);

export const loadFriendListDone = createAction(
    '[Friends Component] load page list: no more elements to load'
);

export const friendAdded = createAction(
    '[Friends Component] friend added',
    props<{ friend: Friend }>()
);

export const friendUpdated = createAction(
    '[Friends Component] friend updated',
    props<{ friend: Friend }>()
);

export const friendDeleted = createAction(
    '[Friends Component] friend deleted',
    props<{ friend: Friend }>()
);
