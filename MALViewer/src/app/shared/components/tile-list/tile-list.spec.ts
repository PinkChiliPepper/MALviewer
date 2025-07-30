import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileList } from './tile-list';

describe('TileList', () => {
  let component: TileList;
  let fixture: ComponentFixture<TileList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
