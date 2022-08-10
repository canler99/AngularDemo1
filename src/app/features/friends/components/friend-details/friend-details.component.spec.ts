import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendDetailsComponent } from './friend-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialCommonModule } from '../../../../material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, of, ReplaySubject } from 'rxjs';
import { FriendsService } from '../../services/friends.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { singleFriend, twoFriendsList } from '../../models/friends.mocks';

describe('FriendDetailsComponent', () => {
  let component: FriendDetailsComponent;
  let fixture: ComponentFixture<FriendDetailsComponent>;
  let mockFriendsService: any;
  const routeParams = new ReplaySubject(1);
  let navigateSpy: any;

  beforeEach(async () => {
    mockFriendsService = jasmine.createSpyObj([
      'getChildren$',
      'getFriendById$',
      'deleteFriend$',
    ]);

    mockFriendsService.getFriendById$.calls.reset();
    mockFriendsService.getChildren$.calls.reset();
    mockFriendsService.deleteFriend$.calls.reset();
    navigateSpy = jasmine.createSpy('navigate');

    mockFriendsService.getFriendById$.and.returnValue(of(singleFriend));

    mockFriendsService.getChildren$.and.returnValue(of(twoFriendsList));

    routeParams.next({ id: '1' });

    await TestBed.configureTestingModule({
      declarations: [FriendDetailsComponent],
      imports: [
        RouterTestingModule,
        MaterialCommonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: routeParams.asObservable(),
          },
        },
        {
          provide: FriendsService,
          useValue: mockFriendsService,
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

  it('should create', () => {
    fixture = TestBed.createComponent(FriendDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('When displaying the details of an element', () => {
    it('should retrieve the children', async () => {
      fixture = TestBed.createComponent(FriendDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const ChildrenBefore = await firstValueFrom(component.children$);
      expect(ChildrenBefore).toEqual(twoFriendsList);
    });
  });

  describe('When deleting the current element', () => {
    it('should navigate back', async () => {
      mockFriendsService.deleteFriend$.and.returnValue(of(true));

      fixture = TestBed.createComponent(FriendDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.deleteCurrentFriend();
      expect(navigateSpy).toHaveBeenCalledWith(['friends']);
    });
  });
});
