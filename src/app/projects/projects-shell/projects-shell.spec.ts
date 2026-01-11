import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsShell } from './projects-shell';

describe('ProjectsShell', () => {
  let component: ProjectsShell;
  let fixture: ComponentFixture<ProjectsShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
