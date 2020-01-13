import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProgressionPage } from './progression.page';

describe('ProgressionPage', () => {
  let component: ProgressionPage;
  let fixture: ComponentFixture<ProgressionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
