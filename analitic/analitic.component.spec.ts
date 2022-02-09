import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliticComponent } from './analitic.component';

describe('AnaliticComponent', () => {
  let component: AnaliticComponent;
  let fixture: ComponentFixture<AnaliticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnaliticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnaliticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
