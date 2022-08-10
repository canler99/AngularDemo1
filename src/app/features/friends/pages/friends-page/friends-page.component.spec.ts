import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsPageComponent } from './friends-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialCommonModule } from '../../../../material.module';
import { FriendsListComponent } from '../../containers/friends-list/friends-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

describe('FriendsPageComponent', () => {
  let component: FriendsPageComponent;
  let fixture: ComponentFixture<FriendsPageComponent>;
  const routeParams = new ReplaySubject(1);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendsPageComponent, FriendsListComponent],
      imports: [RouterTestingModule, MaterialCommonModule],
      providers: [
        provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            params: routeParams.asObservable(),
          },
        },
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
