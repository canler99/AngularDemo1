import {Injectable} from '@angular/core';
import {delay, Observable, of, tap} from 'rxjs';
import {Friend} from '../models/friends.types';

export interface getFriendsPageAPIResponse {
    friends: Friend[];
    pageCount: number;
}

@Injectable({
    providedIn: 'root'
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
                friends: []
            });
        }
    }

    getFriendListPage$(page: number = 0, pageSize: number = 10): Observable<getFriendsPageAPIResponse> {
        const pageCount = this._friendsRoot.length / pageSize;

        if (page > pageCount) {
            throw {code: '001', description: 'Invalid page number requested'}
        }

        return of({
            friends: this._friendsRoot.slice((page - 1) * pageSize, page * pageSize),
            pageCount
        }).pipe(
            delay(1000),
        );
    }

    updateFriend(friend: Friend): Observable<boolean> {
        const itemIndex = this._friendsRoot.findIndex((item: Friend) => item.id === friend.id);
        if (itemIndex < 0) {
            throw {code: '003', description: 'Error trying to update a friend that was not found.'};
        }

        return of(true).pipe(
            delay(1000),
            tap(() => {
                this._friendsRoot[itemIndex] = friend;
            })
        );
    }
}
