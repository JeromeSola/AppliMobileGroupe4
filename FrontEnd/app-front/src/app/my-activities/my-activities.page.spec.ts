import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyActivitiesPage } from './my-activities.page';

describe('MyActivitiesPage', () => {
  let component: MyActivitiesPage;
  let fixture: ComponentFixture<MyActivitiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyActivitiesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyActivitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
