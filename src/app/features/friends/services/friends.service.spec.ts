import {TestBed} from '@angular/core/testing';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import {FriendsService} from './friends.service';

describe('FriendsService', () => {
  let service: FriendsService;
  let store: MockStore;
  const initialState = {friendState: {}};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({initialState})],
    });
    service = TestBed.inject(FriendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
