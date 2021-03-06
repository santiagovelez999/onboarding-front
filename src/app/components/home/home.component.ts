import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { CalculateInterface } from '../model/calculateinterface';
import { Credit } from '../model/credit';
import { CreditInterface } from '../model/creditinterface';
import { CreditService } from '../service/credit.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'onboarding-front';
  displayedColumns: string[] = ['id', 'name', 'value', 'option'];
  dataSource!: MatTableDataSource<Credit>;
  @ViewChild(MatPaginator) page!: MatPaginator;
  @ViewChild(MatSort) order!: MatSort;
  formCredit: FormGroup;
  alert: boolean = false;
  typeAlerts = {
    invalid: "Los campos marcados son obligatorios.",
    error: "Los campos tienen errores, por favor vilide."
  }
  alertTest: string = '';
  idCredit: number = 0;

  userLogged?: SocialUser;
  isLogued?: boolean;

  constructor(protected creditService: CreditService,
    private formBuilder: FormBuilder,
    private authService: SocialAuthService,
    private router: Router) {
    this.formCredit = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      term: new FormControl('', Validators.required),
      interest: new FormControl('', Validators.required),
      monthlyFeeFormat: new FormControl(''),
      monthlyFee: new FormControl('', Validators.required)
      
    });
  }

  ngOnInit(): void {
    this.authService.authState.subscribe(
      data => {
        this.userLogged = data;
        this.isLogued = this.userLogged != null;
      }
    );
    this.listData();
  }

  // Metodo encargado de listar la cantidad de suscripciones totales
  listData() {
    this.creditService.getData().subscribe(async (respuesta: Credit[]) => {
      await this.groupData(respuesta);
    }, error => {
      console.log(error);
    });
  }

  // Metodo encargado de agrupar los datos devueltos por la api
  groupData(data: Credit[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.page;
    this.dataSource.sort = this.order;
  }

  // Metodo encargado de realizar la accion de actualizar o guardar
  action() {
    this.lockFields(false);
    if (this.idCredit !== 0) {
      this.upgrade();
    } else {
      this.save();
    }
  }

  // Metodo encargado de actualizar la informaci??n
  upgrade() {
    if (this.validateform()) {
      if (this.validateOnlyNumbers()) {
        const dataToSend: CreditInterface = this.prepareShippingData(this.idCredit);
        this.creditService.upgrade(dataToSend).subscribe(response => {
          this.timerAlerText(response['200']);
          this.cleanform();
          this.listData();
        }, error => {
          this.cleanform();
          this.timerAlerText(error['400']);
        });
      } else {
        this.timerAlerText(this.typeAlerts.error);
      }
    } else {
      this.timerAlerText(this.typeAlerts.invalid);
    }
  }


  // Metodo encargado de guardar la informaci??n
  save() {
    if (this.validateform()) {
      if (this.validateOnlyNumbers()) {
        const dataToSend: CreditInterface = this.prepareShippingData();
        this.creditService.save(dataToSend).subscribe(response => {
          this.timerAlerText(response['200']);
          this.cleanform();
          this.listData();
        }, error => {
          this.timerAlerText(error['400']);
        }
        );
      } else {
        this.timerAlerText(this.typeAlerts.error);
      }
    } else {
      this.timerAlerText(this.typeAlerts.invalid);
      this.cleanform();
    }
  }

  // Metodo encargado de validar todos los campos del formulario
  validateform(): boolean {
    return this.formCredit.valid;
  }

  // Metodo encargado de validar si los campos numericos tienen caracteres especiales
  validateOnlyNumbers(): boolean {
    const validValues = /^[0-9]+$/;
    const amount: string = this.formCredit.get('amount')?.value;
    const term: string = this.formCredit.get('term')?.value;
    if (String(amount).match(validValues) == null ||
      String(term).match(validValues) == null) {
      return false;
    } else {
      return true;
    }
  }

  // Metodo encargado de preparar los datos a enviar
  prepareShippingData(idSuscripcion: number = 0): CreditInterface {
    const datosAEnviar: CreditInterface = {
      name: this.formCredit.get('name')?.value,
      amount: this.formCredit.get('amount')?.value,
      term: this.formCredit.get('term')?.value,
      interest: this.formCredit.get('interest')?.value,
      monthlyFee: this.formCredit.get('monthlyFee')?.value
    };
    if (idSuscripcion !== 0) {
      datosAEnviar.id = this.idCredit;
    }
    return datosAEnviar;
  }

  // Metodo encargado de limpiar todo el formulario
  cleanform() {
    this.lockFields(false);
    this.idCredit = 0;
    this.formCredit.get('name')?.setValue('');
    this.formCredit.get('amount')?.setValue('');
    this.formCredit.get('term')?.setValue('');
    this.formCredit.get('interest')?.setValue('');
    this.formCredit.get('monthlyFee')?.setValue('');
    this.formCredit.get('monthlyFeeFormat')?.setValue('');
    
  }

  // Metodo encargado de cargar datos cuanto la opcion es actualizar
  precargarDatosEnFormulario(credit: Credit) {
    this.lockFields(true);
    this.idCredit = credit.id;
    this.formCredit.get('name')?.setValue(credit.name);
    this.formCredit.get('amount')?.setValue(credit.amount);
    this.formCredit.get('term')?.setValue(credit.term);
    this.formCredit.get('interest')?.setValue(credit.interest.toString());
    this.formCredit.get('monthlyFee')?.setValue(credit.monthlyFee);
    this.formCredit.get('monthlyFeeFormat')?.setValue(
      this.formatCurrency("es-CO", "COP", 2, credit.monthlyFee)
    );
  }

  timerAlerText(message: string) {
    this.alertTest = message;
    this.alert = true;
    setInterval(() => this.alert = false, 6000);
  }

  errorAlert(): boolean {
    return this.typeAlerts.error == this.alertTest || this.typeAlerts.invalid == this.alertTest;
  }

  logOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }


  // Metodo encargado de guardar la informaci??n
  calculate() {
    const amount = this.formCredit.get('amount')?.value;
    const term = this.formCredit.get('term')?.value;
    const interest = this.formCredit.get('interest')?.value;
    const calculateInterface: CalculateInterface = {
      amount: amount != '' ? +amount : 0,
      term: term != '' ? +term : 0,
      interest: interest != '' ? +interest : 0.0
    }
    this.creditService.calculate(calculateInterface).subscribe(response => {
      let calculate = this.formatCurrency("es-CO", "COP", 2, response['200']);
      this.formCredit.get('monthlyFee')?.setValue(response['200']);
      this.formCredit.get('monthlyFeeFormat')?.setValue(calculate);
    }, error => {
      this.timerAlerText(error['400']);
    }
    );
  }

  lockFields(option: boolean) {
    if (option) {
      this.formCredit.get('name')?.disable();
      this.formCredit.get('amount')?.disable();
    } else {

      this.formCredit.get('name')?.enable();
      this.formCredit.get('amount')?.enable();
    }
  }


  formatCurrency(locales: any, currency: any, fractionDigits: any, number: any) {
    var formatted = new Intl.NumberFormat(locales, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: fractionDigits
    }).format(number);
    return formatted;
  }


}
