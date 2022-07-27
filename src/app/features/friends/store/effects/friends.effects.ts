import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {map, mergeMap} from "rxjs";
import * as FriendsActions from '../actions/friends.actions';
import {FriendsApiService} from '../../services/friends-api.service';
import {Friend} from '../../models/friends.types';

@Injectable()
export class FriendsEffects {

    loadFriends$ = createEffect(() => this.actions$.pipe(
        ofType(FriendsActions.loadFriendPage),
        mergeMap(action => this.friendsApiService.getFriendsPage$(action.page, action.pageSize).pipe(
            map((friends: Friend[]) => FriendsActions.loadFriendPageSucess({
                page: action.page,
                pageSize: action.pageSize,
                friendsReceived: friends
            })),
            // TODO: implement proper error handling
            //catchError(({ code, description }) => FriendsActions.loadFriendPageError({ code, description }))
        ))
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly friendsApiService: FriendsApiService
    ) {
    }
}
