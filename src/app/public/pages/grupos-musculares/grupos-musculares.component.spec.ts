import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposMuscularesComponent } from './grupos-musculares.component';

describe('GruposMuscularesComponent', () => {
  let component: GruposMuscularesComponent;
  let fixture: ComponentFixture<GruposMuscularesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GruposMuscularesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposMuscularesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
