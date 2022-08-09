import {ComponentFixture, TestBed} from '@angular/core/testing';

import {D3GraphicComponent} from './d3-graphic.component';
import {singleFriendList} from '../../models/friends.mocks';

describe('D3GraphicComponent', () => {
  let component: D3GraphicComponent;
  let fixture: ComponentFixture<D3GraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [D3GraphicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(D3GraphicComponent);
    component = fixture.componentInstance;
    component.friendList = singleFriendList;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert the input data to the expected format', () => {
    const res = component.convertModelDataToD3([
      {name: 'n1', age: 1, weight: 1} as any,
      {name: 'n2', age: 2, weight: 2} as any,
      {name: 'n3', age: 3, weight: 3} as any,
    ]);

    expect(res).toEqual([
      {name: 'n1', age: '1', weight: '1'},
      {name: 'n2', age: '2', weight: '2'},
      {name: 'n3', age: '3', weight: '3'},
    ]);
  });
});
