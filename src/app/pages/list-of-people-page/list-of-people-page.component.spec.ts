import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfPeoplePageComponent } from './list-of-people-page.component';

describe('ListOfPeoplePageComponent', () => {
  let component: ListOfPeoplePageComponent;
  let fixture: ComponentFixture<ListOfPeoplePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfPeoplePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfPeoplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
