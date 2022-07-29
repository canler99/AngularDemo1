import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {FriendsApiService} from './friends-api.service';
import {Observable} from 'rxjs';
import {Friend} from '../models/friends.types';
import * as actions from '../store/actions/friends.actions';
import * as selectors from '../store/selectors/friends.selectors';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(
      private readonly friendsApiService: FriendsApiService,
      private readonly store: Store,
  ) {
  }

  getFriendsPage$(page: number = 0, pageSize: number = 10): Observable<Friend[]> {
    this.store.dispatch(actions.loadFriendPage({page, pageSize}));
    return this.store.select(selectors.selectFeatureFriends);
  }
}
