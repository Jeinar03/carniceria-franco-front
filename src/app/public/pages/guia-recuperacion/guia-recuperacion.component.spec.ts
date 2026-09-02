import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaRecuperacionComponent } from './guia-recuperacion.component';

describe('GuiaRecuperacionComponent', () => {
  let component: GuiaRecuperacionComponent;
  let fixture: ComponentFixture<GuiaRecuperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiaRecuperacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuiaRecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
