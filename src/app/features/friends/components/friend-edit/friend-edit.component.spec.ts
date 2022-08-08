import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FriendEditComponent} from './friend-edit.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

describe('FriendEditComponent', () => {
  let component: FriendEditComponent;
  let fixture: ComponentFixture<FriendEditComponent>;
  let store: MockStore;
  const initialState = {friendState: {}};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendEditComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [provideMockStore({initialState})],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
