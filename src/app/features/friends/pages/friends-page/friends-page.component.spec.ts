import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FriendsPageComponent} from './friends-page.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('FriendsComponent', () => {
  let component: FriendsPageComponent;
  let fixture: ComponentFixture<FriendsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendsPageComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
