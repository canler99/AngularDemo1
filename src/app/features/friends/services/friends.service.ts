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
/**
 * This service is used to separate components' logic from the logic to read and transform data
 * from the back-end. It also hides the Store from the components.
 */
export class FriendsService {
  constructor(
      private readonly friendsApiService: FriendsApiService,
      private readonly store: Store
  ) {
  }

  /**
   * Returns the main list of friends from the store
   */
  getFriendsList$(): Observable<Friend[]> {
    return this.store.select(selectors.selectFriends);
  }

  /**
   * Returns the context of the main list of friends from the store.
   * The context provides pagination and list size info.
   */
  getFriendsListContext$(): Observable<ListContext> {
    return this.store.select(selectors.selectFriendListContext);
  }

  /**
   * Dispatches the action to load the next available friend list page
   * @param pageSize
   */
  loadFriendListNextPage(pageSize: number = 10) {
    this.store.dispatch(actions.loadFriendListNextPage({pageSize}));
  }

  /**
   * Returns a friend given its id from the store.
   * @param friendId
   */
  getFriendById$(friendId: string): Observable<Friend> {
    return this.store.select(selectors.selectFriend, {friendId});
  }

  /**
   * Adds a new friend to the main list. Calls the API directly and updates the store.
   * @param newFriend: friend to add
   */
  addFriend$(newFriend: Friend): Observable<boolean> {
    return this.friendsApiService.addFriend$(newFriend).pipe(
        tap(friend => this.store.dispatch(actions.friendAdded({friend}))),
        map(() => true)
    );
  }

  /**
   * Updates an existing friend. Calls the API directly and updates the store.
   * @param friend: friend to update
   */
  updateFriend$(friend: Friend): Observable<boolean> {
    return this.friendsApiService
        .updateFriend$(friend)
        .pipe(tap(() => this.store.dispatch(actions.friendUpdated({friend}))));
  }

  /**
   * Deletes an existing friend from the main list. Calls the API directly and updates the store.
   * @param friend: friend to delete
   */
  deleteFriend$(friend: Friend): Observable<boolean> {
    return this.friendsApiService
        .deleteFriend$(friend)
        .pipe(tap(() => this.store.dispatch(actions.friendDeleted({friend}))));
  }

  /**
   * Returns the list of friend of an existing friend. Calls the API directly.
   * @param friend
   */
  getChildren$(friend: Friend): Observable<Friend[]> {
    return this.friendsApiService.getChildren$(friend);
  }
}
