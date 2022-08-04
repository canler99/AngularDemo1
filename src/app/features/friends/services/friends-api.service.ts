import {Injectable} from '@angular/core';
import {delay, Observable, of, tap} from 'rxjs';
import {Friend} from '../models/friends.types';

// Simulate api latency (1000ms)
const SIMULATED_API_RESPONSE_TIME = 1000;

export interface getFriendsPageAPIResponse {
  friends: Friend[];
  pageCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class FriendsApiService {
  private _friendsRoot: Friend[] = [];

  constructor() {
    this.generateInitialFriendList();
  }

  generateInitialFriendList() {
    for (let i = 0; i < 30; i++) {
      this._friendsRoot.push({
        id: (i + 100).toString(),
        name: `John Smith-${i + 1}`,
        age: 10 + i,
        weight: 80 + i,
        friendIds: [],
      });
    }

    this._friendsRoot[0].friendIds.push(this._friendsRoot[1].id);
    this._friendsRoot[0].friendIds.push(this._friendsRoot[2].id);
    this._friendsRoot[0].friendIds.push(this._friendsRoot[3].id);
    this._friendsRoot[1].friendIds.push(this._friendsRoot[4].id);
    this._friendsRoot[1].friendIds.push(this._friendsRoot[0].id);
  }

  getFriendListPage$(
      page: number = 0,
      pageSize: number = 10
  ): Observable<getFriendsPageAPIResponse> {
    const pageCount = Math.ceil(this._friendsRoot.length / pageSize);

    if (page > pageCount) {
      throw {code: '001', description: 'Invalid page number requested'};
    }

    return of({
      friends: this._friendsRoot.slice((page - 1) * pageSize, page * pageSize),
      pageCount,
    }).pipe(delay(SIMULATED_API_RESPONSE_TIME));
  }

  addFriend$(newFriend: Friend): Observable<Friend> {
    const maxId = this._friendsRoot.reduce(
        (prev, curr) => (prev < curr?.id ? curr.id : prev),
        '0'
    );

    return of({...newFriend, id: (+maxId + 1).toString()}).pipe(
        delay(SIMULATED_API_RESPONSE_TIME),
        tap(friend => {
          this._friendsRoot.push(friend);
        })
    );
  }

  updateFriend$(friend: Friend): Observable<boolean> {
    const itemIndex = this._friendsRoot.findIndex(
        (item: Friend) => item.id === friend.id
    );

    if (itemIndex < 0) {
      throw {
        code: '003',
        description: 'Error trying to update a friend that was not found.',
      };
    }

    return of(true).pipe(
        delay(SIMULATED_API_RESPONSE_TIME),
        tap(() => {
          this._friendsRoot[itemIndex] = friend;
        })
    );
  }

  deleteFriend$(friend: Friend): Observable<boolean> {
    const itemIndex = this._friendsRoot.findIndex(
        (item: Friend) => item.id === friend.id
    );
    if (itemIndex < 0) {
      throw {
        code: '005',
        description: 'Error trying to delete a friend that was not found.',
      };
    }

    return of(true).pipe(
        delay(SIMULATED_API_RESPONSE_TIME),
        tap(() => {
          this._friendsRoot.splice(itemIndex, 1);
        })
    );
  }

  getChildren$(friend: Friend): Observable<Friend[]> {
    const res = this._friendsRoot.filter(item =>
        friend.friendIds.some(id => id === item.id)
    );

    return of(res).pipe(delay(SIMULATED_API_RESPONSE_TIME));
  }
}
