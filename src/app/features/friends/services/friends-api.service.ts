import {Injectable} from '@angular/core';
import {delay, Observable, of} from 'rxjs';
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
                id: i.toString(),
                name: `John Smith-${i + 1}`,
                age: 10 + i,
                weight: 80 + i,
                friends: []
            });
        }
    }

    getFriendListNextPage$(page: number = 0, pageSize: number = 10): Observable<getFriendsPageAPIResponse> {
        return of({
            friends: this._friendsRoot.slice(page * pageSize, (page + 1) * pageSize),
            pageCount: this._friendsRoot.length / pageSize
        }).pipe(
            delay(2000),
        );
    }
}
