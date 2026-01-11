import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsDashboardPage } from './projects-dashboard-page';

describe('ProjectsDashboardPage', () => {
  let component: ProjectsDashboardPage;
  let fixture: ComponentFixture<ProjectsDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsDashboardPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsDashboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
