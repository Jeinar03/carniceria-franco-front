import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LesionesComponent } from './lesiones.component';

describe('LesionesComponent', () => {
  let component: LesionesComponent;
  let fixture: ComponentFixture<LesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LesionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
