import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Friend} from '../models/friends.types';

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

    getFriendsPage$(page: number = 0, pageSize: number = 10): Observable<Friend[]> {
        return of(this._friendsRoot.slice(page * pageSize, (page + 1) * pageSize));
    }
}
