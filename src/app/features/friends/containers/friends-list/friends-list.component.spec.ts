import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import {FriendsListComponent} from './friends-list.component';

describe('FriendsListComponent', () => {
  let component: FriendsListComponent;
  let fixture: ComponentFixture<FriendsListComponent>;
  let store: MockStore;
  const initialState = {friendState: {}};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendsListComponent],
      providers: [provideMockStore({initialState})],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
