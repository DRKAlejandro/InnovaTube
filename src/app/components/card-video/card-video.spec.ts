import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardVideo } from './card-video';

describe('CardVideo', () => {
  let component: CardVideo;
  let fixture: ComponentFixture<CardVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
