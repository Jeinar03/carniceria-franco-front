import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDetalleGMComponent } from './video-detalle-gm.component';

describe('VideoDetalleGMComponent', () => {
  let component: VideoDetalleGMComponent;
  let fixture: ComponentFixture<VideoDetalleGMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoDetalleGMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoDetalleGMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
