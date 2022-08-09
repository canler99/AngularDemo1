import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FriendEditComponent} from './friend-edit.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialCommonModule} from '../../../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FriendsService} from '../../services/friends.service';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom, of, ReplaySubject, zip} from 'rxjs';
import {Friend} from '../../models/friends.types';
import {
  defaultEmptyFriend,
  fiveFriendsList,
  friendsFourAndFiveList,
  singleFriend,
  twoFriendsList,
} from '../../models/friends.mocks';

describe('FriendEditComponent', () => {
  let component: FriendEditComponent;
  let fixture: ComponentFixture<FriendEditComponent>;
  let mockFriendsService: any;
  const routeParams = new ReplaySubject(1);
  let navigateSpy: any;

  beforeEach(async () => {
    mockFriendsService = jasmine.createSpyObj([
      'getFriendsList$',
      'getChildren$',
      'getFriendById$',
      'updateFriend$',
      'addFriend$',
    ]);

    mockFriendsService.getFriendById$.calls.reset();
    mockFriendsService.getFriendsList$.calls.reset();
    mockFriendsService.getChildren$.calls.reset();

    navigateSpy = jasmine.createSpy('navigate');

    await TestBed.configureTestingModule({
      declarations: [FriendEditComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MaterialCommonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: FriendsService,
          useValue: mockFriendsService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: routeParams.asObservable(),
          },
        },
        {
          provide: Router,
          useClass: class {
            navigate = navigateSpy;
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', async () => {
    fixture = TestBed.createComponent(FriendEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('When id param is present in the route', () => {
    it('should return the corresponding friend and Edit tittle', async () => {
      routeParams.next({id: '1'});
      mockFriendsService.getFriendById$.and.returnValue(
          of({id: '1'} as Friend)
      );

      fixture = TestBed.createComponent(FriendEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const res = await firstValueFrom(
          zip([component.friend$, component.tittle$])
      );

      expect(res[0]).toEqual({id: '1'} as any);
      expect(res[1]).toEqual('Edit');
      expect(mockFriendsService.getFriendById$).toHaveBeenCalledWith('1');
    });
  });

  describe('When id param is not present in the route', () => {
    it('should return the default empty friend and Add tittle', async () => {
      routeParams.next({});
      fixture = TestBed.createComponent(FriendEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const res = await firstValueFrom(
          zip([component.friend$, component.tittle$])
      );
      expect(res[0]).toEqual(defaultEmptyFriend);
      expect(res[1]).toEqual('Add');
      expect(mockFriendsService.getFriendById$).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('When retrieving the list of available friends', () => {
    it('current item and its children should be excluded', async () => {
      routeParams.next({id: '1'});

      mockFriendsService.getFriendById$.and.returnValue(of(singleFriend));

      mockFriendsService.getFriendsList$.and.returnValue(of(fiveFriendsList));

      mockFriendsService.getChildren$.and.returnValue(of(twoFriendsList));

      fixture = TestBed.createComponent(FriendEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const res = await firstValueFrom(component.availableFriends$);
      expect(res).toEqual(friendsFourAndFiveList);
    });
  });
});
