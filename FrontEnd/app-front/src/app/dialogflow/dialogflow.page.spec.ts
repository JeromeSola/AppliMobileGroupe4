import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogflowPage } from './dialogflow.page';

describe('DialogflowPage', () => {
  let component: DialogflowPage;
  let fixture: ComponentFixture<DialogflowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogflowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogflowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
