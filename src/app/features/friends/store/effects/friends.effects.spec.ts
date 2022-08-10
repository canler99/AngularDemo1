import { fiveFriendsList, listContextObj } from '../../models/friends.mocks';
import { firstValueFrom, of, ReplaySubject, switchMap, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FriendsEffects } from './friends.effects';
import * as actions from '../actions/friends.actions';
import { Store } from '@ngrx/store';
import { FriendsApiService } from '../../services/friends-api.service';

describe('Friend Effects Tests', () => {
  describe('When loading a page of friends, through the loadFriends$ effect', () => {
    let actions$ = new ReplaySubject(1);
    const storeSelectSubject = new ReplaySubject(1);
    const getFriendListPageResSubject = new ReplaySubject(1);
    let effects: FriendsEffects;

    const mockFriendsService = jasmine.createSpyObj(['getFriendListPage$']);

    mockFriendsService.getFriendListPage$.and.returnValue(
      getFriendListPageResSubject.asObservable().pipe(switchMap((v: any) => v))
    );

    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          provideMockActions(() => actions$),
          {
            provide: FriendsApiService,
            useValue: mockFriendsService,
          },
          {
            provide: Store,
            useValue: {
              select: () => storeSelectSubject.asObservable(),
            },
          },
          {
            provide: FriendsEffects,
            useClass: FriendsEffects,
          },
        ],
      });

      effects = TestBed.inject(FriendsEffects);
    });

    describe('When the page is successfully loaded', () => {
      it('should return a loadFriendListNextPageSuccess action with the data', async () => {
        actions$.next(actions.loadFriendListNextPage({ pageSize: 10 }));
        storeSelectSubject.next(listContextObj);
        getFriendListPageResSubject.next(
          of({
            friends: fiveFriendsList,
            pageCount: 3,
          })
        );
        const res: any = await firstValueFrom(effects.loadFriends$);
        expect(res.friendsReceived.length).toEqual(5);
        expect(res.pageSize).toEqual(10);
        expect(res.pageCount).toEqual(3);
      });
    });

    describe('When the api call fails', () => {
      it('should return a loadFriendListNextPageFail action', async () => {
        actions$.next(actions.loadFriendListNextPage({ pageSize: 10 }));
        storeSelectSubject.next(listContextObj);

        getFriendListPageResSubject.next(
          throwError(() => ({ code: '001', description: 'I' }))
        );
        const res: any = await firstValueFrom(effects.loadFriends$);
        const expected = actions.loadFriendListNextPageError({
          code: '001',
          description: 'I',
        });

        expect(res).toEqual(expected);
      });
    });
  });
});
