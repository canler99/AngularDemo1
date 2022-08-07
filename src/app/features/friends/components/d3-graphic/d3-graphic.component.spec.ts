import {ComponentFixture, TestBed} from '@angular/core/testing';

import {D3GraphicComponent} from './d3-graphic.component';

describe('D3GraphicComponent', () => {
  let component: D3GraphicComponent;
  let fixture: ComponentFixture<D3GraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [D3GraphicComponent]
    })
        .compileComponents();

    fixture = TestBed.createComponent(D3GraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
