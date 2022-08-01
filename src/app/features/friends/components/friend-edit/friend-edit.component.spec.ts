import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FriendEditComponent} from './friend-edit.component';

describe('FriendEditComponent', () => {
  let component: FriendEditComponent;
  let fixture: ComponentFixture<FriendEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendEditComponent]
    })
        .compileComponents();

    fixture = TestBed.createComponent(FriendEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
