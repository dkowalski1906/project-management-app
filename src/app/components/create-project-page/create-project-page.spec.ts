import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectPage } from './create-project-page';

describe('CreateProjectPage', () => {
  let component: CreateProjectPage;
  let fixture: ComponentFixture<CreateProjectPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProjectPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProjectPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
