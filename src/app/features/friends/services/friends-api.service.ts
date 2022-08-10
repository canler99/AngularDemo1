import { Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { Friend } from '../models/friends.types';
import { first_names } from '../../../libs/random-name/first-names';
import { last_names } from '../../../libs/random-name/names';

// Simulate api latency (1000ms)
const SIMULATED_API_RESPONSE_TIME = 500;

export interface getFriendsPageAPIResponse {
  friends: Friend[];
  pageCount: number;
}

@Injectable({
  providedIn: 'root',
})
/**
 * This class is used as an API access layer. Additionally, we are simulating the existing of
 * a back end server by keeping and managing the data in memory. Latency is also simulated.
 */
export class FriendsApiService {
  private _friendsRoot: Friend[] = [];

  constructor() {
    // Generate seed data
    this.generateInitialFriendList();
  }

  generateFullName() {
    const first = first_names[Math.trunc(Math.random() * first_names.length)];
    const last = last_names[Math.trunc(Math.random() * last_names.length)];
    return `${first} ${last}`;
  }

  /**
   * Generates seed data for the simulated back-end data storage.
   */
  generateInitialFriendList() {
    for (let i = 0; i < 30; i++) {
      this._friendsRoot.push({
        id: (i + 100).toString(),
        name: this.generateFullName(),
        age: this.getRandomInt(2, 120),
        weight: this.getRandomInt(25, 140),
        friendIds: [],
      });
    }

    // Add children to the first 5 element
    for (let i = 0; i < 9; i++) {
      const children = this._friendsRoot
        .filter(
          (friend: Friend, index) =>
            index !== i && this.getRandomInt(0, 2) === 1
        )
        .map((friend: Friend) => friend.id);

      this._friendsRoot[i].friendIds.push(...children);
    }
  }

  /**
   * Calls (simulates) the API service that returns a page of friends.
   * @param page
   * @param pageSize
   */
  getFriendListPage$(
    page: number = 0,
    pageSize: number = 10
  ): Observable<getFriendsPageAPIResponse> {
    const pageCount = Math.ceil(this._friendsRoot.length / pageSize);

    if (page > pageCount) {
      throw { code: '001', description: 'Invalid page number requested' };
    }

    return of({
      friends: this._friendsRoot.slice((page - 1) * pageSize, page * pageSize),
      pageCount,
    }).pipe(delay(SIMULATED_API_RESPONSE_TIME));
  }

  /**
   * Calls (simulates) the API service that adds a new friend.
   * @param newFriend
   */
  addFriend$(newFriend: Friend): Observable<Friend> {
    const maxId = this._friendsRoot.reduce(
      (prev, curr) => (prev < curr?.id ? curr.id : prev),
      '0'
    );

    return of({ ...newFriend, id: (+maxId + 1).toString() }).pipe(
      delay(SIMULATED_API_RESPONSE_TIME),
      tap(friend => {
        this._friendsRoot.push(friend);
      })
    );
  }

  /**
   * Calls (simulates) the API service that updates an existing friend.
   * @param friend
   */
  updateFriend$(friend: Friend): Observable<Friend> {
    const itemIndex = this._friendsRoot.findIndex(
      (item: Friend) => item.id === friend.id
    );

    if (itemIndex < 0) {
      throw {
        code: '003',
        description: 'Error trying to update a friend that was not found.',
      };
    }

    return of(friend).pipe(
      delay(SIMULATED_API_RESPONSE_TIME),
      tap(() => {
        this._friendsRoot[itemIndex] = friend;
      })
    );
  }

  /**
   * Calls (simulates) the API service that deletes an existing friend.
   * @param friend
   */
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

  /**
   * Calls (simulates) the API service that returns the list of friend of a given friend.
   * @param friend
   */
  getChildren$(friend: Friend): Observable<Friend[]> {
    const res = this._friendsRoot.filter(item =>
      friend.friendIds.some(id => id === item.id)
    );

    return of(res).pipe(delay(SIMULATED_API_RESPONSE_TIME));
  }

  /**
   * Utility function that generates a random number in a given interval.
   * @param min
   * @param max
   * @todo: move this function to a global shared module
   */
  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
