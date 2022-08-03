import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {FriendsApiService} from './friends-api.service';
import {Observable, tap} from 'rxjs';
import {Friend} from '../models/friends.types';
import * as actions from '../store/actions/friends.actions';
import * as selectors from '../store/selectors/friends.selectors';
import {ListContext} from '../store/friends-store.types';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(
      private readonly friendsApiService: FriendsApiService,
      private readonly store: Store
  ) {
  }

  getFriendsList$(): Observable<Friend[]> {
    return this.store.select(selectors.selectFriends);
  }

  getFriendsListContext$(): Observable<ListContext> {
    return this.store.select(selectors.selectFriendListContext);
  }

  loadFriendListNextPage(pageSize: number = 10) {
    this.store.dispatch(actions.loadFriendListNextPage({pageSize}));
  }

  getFriendById$(friendId: string): Observable<Friend> {
    return this.store.select(selectors.selectFriend, {friendId});
  }

  addFriend$(newFriend: Friend): Observable<boolean> {
    return this.friendsApiService.addFriend$(newFriend).pipe(
        tap(friend => this.store.dispatch(actions.friendAdded({friend}))),
        map(() => true)
    );
  }

  updateFriend$(friend: Friend): Observable<boolean> {
    return this.friendsApiService
        .updateFriend$(friend)
        .pipe(tap(() => this.store.dispatch(actions.friendUpdated({friend}))));
  }

  deleteFriend$(friend: Friend): Observable<boolean> {
    return this.friendsApiService
        .deleteFriend$(friend)
        .pipe(tap(() => this.store.dispatch(actions.friendDeleted({friend}))));
  }
}
