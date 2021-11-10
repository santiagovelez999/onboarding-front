import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { Credit } from '../model/credit';
import { CreditService } from '../service/credit.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let creditServiceSpy: jasmine.SpyObj<CreditService>;
  let lisObjectCredit: Credit[] = [new Credit(1, "Santiago Vélez", 1000000, 5, 1, 2.0)];

  const response = {
    "200": "Guardado con exito."
  };


  beforeEach(async () => {

    creditServiceSpy = jasmine.createSpyObj('CreditService', [
      'getData', 'save', 'upgrade'
    ]);

    creditServiceSpy.getData.and.returnValue(
      of(lisObjectCredit)
    );

    creditServiceSpy.save.and.returnValue(
      of(response)
    );

    creditServiceSpy.upgrade.and.returnValue(
      of(response)
    );

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        AppModule
      ],
      providers: [
        { provide: CreditService, useValue: creditServiceSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Listar', fakeAsync(() => {
    component.listData();
    tick();
    fixture.detectChanges();
    expect(1).toBe(component.dataSource.data.length);
    console.log('.........................  Listar exitoso .........................');
  }));

  fit('Registrando Credito', () => {
    expect(component.formCredit.valid).toBeFalsy();
    component.formCredit.controls.name.setValue('Juan Vélez');
    component.formCredit.controls.amount.setValue('1000000');
    component.formCredit.controls.term.setValue('5');
    component.formCredit.controls.interest.setValue('1');
    expect(component.formCredit.valid).toBeTruthy();
    component.action();
    //expect(component.formCredit).toBeFalse();
    expect(response[200]).toBe(component.alertTest);
    console.log('.........................  Guardado exitoso .........................');
  });


  fit('Actualizar Credito', () => {
    expect(component.formCredit.valid).toBeFalsy();
    component.idCredit = 1;
    component.formCredit.controls.name.setValue('Juan Vélez');
    component.formCredit.controls.amount.setValue('1000000');
    component.formCredit.controls.term.setValue('5');
    component.formCredit.controls.interest.setValue('1');
    expect(component.formCredit.valid).toBeTruthy();
    component.action();
    //expect(component.formCredit).toBeFalse();
    expect(response[200]).toBe(component.alertTest);
    console.log('.........................  Actualización exitoso .........................');
  });
});
