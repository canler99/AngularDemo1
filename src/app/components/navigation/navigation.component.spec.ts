import {LayoutModule} from '@angular/cdk/layout';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {NavigationComponent} from './navigation.component';
import {MaterialCommonModule} from '../../material.module';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      imports: [MaterialCommonModule, NoopAnimationsModule, LayoutModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
