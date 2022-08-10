import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { FriendsService } from './friends.service';
import {
  defaultEmptyFriend,
  fiveFriendsList,
  listContextObj,
} from '../models/friends.mocks';
import { firstValueFrom, take } from 'rxjs';
import { friendsFeatureKey } from '../store/friends-store.types';
import * as actions from '../store/actions/friends.actions';

describe('FriendsService', () => {
  let service: FriendsService;
  let store: MockStore;
  let initialState: { [k: string]: any } = {};
  initialState[friendsFeatureKey] = {};

  const friendAdded = { ...defaultEmptyFriend, id: '130' };

  const stateWithData = { ...initialState };
  stateWithData[friendsFeatureKey] = {
    friends: fiveFriendsList,
    listContext: listContextObj,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    });

    store = TestBed.inject(MockStore);
    service = TestBed.inject(FriendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the list of friends from the store', async () => {
    store.setState({ ...stateWithData });

    const res = await firstValueFrom(service.getFriendsList$().pipe(take(1)));
    expect(res).toEqual(fiveFriendsList);
  });

  it('should return the list context from the store', async () => {
    store.setState({ ...stateWithData });

    const res = await firstValueFrom(
      service.getFriendsListContext$().pipe(take(1))
    );
    expect(res).toEqual(listContextObj);
  });

  it('should dispatch an action to load the next page', async () => {
    const spyDispatch = spyOn(store, 'dispatch');
    service.loadFriendListNextPage();
    expect(spyDispatch).toHaveBeenCalled();
  });

  describe('When adding a new friend', () => {
    it('should call the api service and dispatch an action', async () => {
      const spyDispatchAdd = spyOn(store, 'dispatch');
      store.setState({ ...stateWithData });
      const res = await firstValueFrom(service.addFriend$(defaultEmptyFriend));
      expect(res).toEqual(friendAdded);
      expect(spyDispatchAdd).toHaveBeenCalledWith(
        actions.friendAdded({ friend: friendAdded })
      );
    });
  });
});
