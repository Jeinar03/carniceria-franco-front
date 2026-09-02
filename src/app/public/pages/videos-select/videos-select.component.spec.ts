import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosSelectComponent } from './videos-select.component';

describe('VideosSelectComponent', () => {
  let component: VideosSelectComponent;
  let fixture: ComponentFixture<VideosSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideosSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideosSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
