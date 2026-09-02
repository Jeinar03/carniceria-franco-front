import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasRutinasTestComponent } from './preguntas-rutinas-test.component';

describe('PreguntasRutinasTestComponent', () => {
  let component: PreguntasRutinasTestComponent;
  let fixture: ComponentFixture<PreguntasRutinasTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreguntasRutinasTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntasRutinasTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
