import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import {FriendsListComponent} from './friends-list.component';
import {MaterialCommonModule} from '../../../../material.module';
import {FriendsService} from '../../services/friends.service';
import {firstValueFrom, of} from 'rxjs';
import {singleFriendList} from '../../models/friends.mocks';

describe('FriendsListComponent', () => {
  let component: FriendsListComponent;
  let fixture: ComponentFixture<FriendsListComponent>;
  let store: MockStore;
  const initialState = {friendState: {}};
  let mockFriendsService: any;

  beforeEach(async () => {
    mockFriendsService = jasmine.createSpyObj([
      'getFriendsList$',
      'getChildren$',
      'getFriendById$',
      'updateFriend$',
      'addFriend$',
      'getFriendsListContext$',
    ]);

    mockFriendsService.getFriendsListContext$.and.returnValue(
        of({
          currentPage: 0,
          pageSize: 10,
          loading: false,
          pageCount: 0,
        })
    );

    mockFriendsService.getFriendsList$.and.returnValue(of(singleFriendList));

    await TestBed.configureTestingModule({
      declarations: [FriendsListComponent],
      imports: [MaterialCommonModule],
      providers: [
        provideMockStore({initialState}),
        {
          provide: FriendsService,
          useValue: mockFriendsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should automatically load the first page of the list of friends', async () => {
    const res = await firstValueFrom(component.friends$);
    expect(res).toEqual(singleFriendList);
  });
});
