import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, of, withLatestFrom} from 'rxjs';
import * as FriendsActions from '../actions/friends.actions';
import {FriendsApiService, getFriendsPageAPIResponse,} from '../../services/friends-api.service';
import {Store} from '@ngrx/store';
import * as selectors from '../selectors/friends.selectors';

@Injectable()
export class FriendsEffects {
    loadFriends$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FriendsActions.loadFriendListNextPage),
            withLatestFrom(this.store.select(selectors.selectFriendListContext)),
            mergeMap(([action, {currentPage, pageCount}]) =>
                currentPage === 0 || currentPage < pageCount
                    ? this.friendsApiService
                        .getFriendListPage$(currentPage + 1, action.pageSize)
                        .pipe(
                            map((apiResult: getFriendsPageAPIResponse) =>
                                FriendsActions.loadFriendListNextPageSuccess({
                                    currentPage: currentPage + 1,
                                    pageSize: action.pageSize,
                                    friendsReceived: apiResult.friends,
                                    pageCount: apiResult.pageCount,
                                })
                            ),
                            catchError(({code, description}) =>
                                of(
                                    FriendsActions.loadFriendListNextPageError({
                                        code,
                                        description,
                                    })
                                )
                            )
                        )
                    : of(FriendsActions.loadFriendListDone())
            )
        )
    );

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly friendsApiService: FriendsApiService
    ) {
    }
}
