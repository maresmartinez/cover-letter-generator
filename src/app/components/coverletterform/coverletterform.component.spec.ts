import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverletterformComponent } from './coverletterform.component';

describe('CoverletterformComponent', () => {
  let component: CoverletterformComponent;
  let fixture: ComponentFixture<CoverletterformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverletterformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverletterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
