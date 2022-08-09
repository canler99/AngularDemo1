import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FriendDetailsComponent} from './friend-details.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {MaterialCommonModule} from '../../../../material.module';

describe('FriendDetailsComponent', () => {
  let component: FriendDetailsComponent;
  let fixture: ComponentFixture<FriendDetailsComponent>;
  let store: MockStore;
  const initialState = {friendState: {}};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendDetailsComponent],
      imports: [RouterTestingModule, MaterialCommonModule],
      providers: [provideMockStore({initialState})],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
