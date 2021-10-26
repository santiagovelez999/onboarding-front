import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Credit } from './components/model/credit';
import { CreditInterface } from './components/model/creditinterface';
import { CreditService } from './components/service/credit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'onboarding-front';
  displayedColumns: string[] = ['id', 'name', 'value', 'option'];
  dataSource!: MatTableDataSource<Credit>;
  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenar!: MatSort;
  formCredit: FormGroup;
  invalidForm: boolean = false;
  errorForm: boolean = false;
  validFormText: string = "";
  idCredit: number = 0;

  constructor(protected creditService: CreditService, private formBuilder: FormBuilder) {
    this.formCredit = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      term: new FormControl('', Validators.required),
      interest: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
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
  groupData(datos: Credit[]) {
    this.dataSource = new MatTableDataSource(datos);
    this.dataSource.paginator = this.paginador;
    this.dataSource.sort = this.ordenar;
  }

  // Metodo encargado de guardar la información
  save() {
    if (this.validateform()) {
      if (this.validateOnlyNumbers()) {
        this.invalidForm = false;
        const dataToSend: CreditInterface = this.prepareShippingData();
        this.creditService.save(dataToSend).subscribe(respuesta => {
          this.invalidForm = false;
          this.errorForm = false;
          console.log(respuesta);
          this.cleanform();
          this.listData();
        }, error => {
          console.log(error);
        }
        );
      }
    } else {
      this.invalidForm = true;
      this.cleanform();
    }
  }

  // Metodo encargado de validar todos los campos del formulario
  validateform(): boolean {
    return this.formCredit.valid;
  }

  // Metodo encargado de validar si los campos numericos tienen caracteres especiales
  validateOnlyNumbers(): boolean {
    const valoresAceptados = /^[0-9]+$/;
    if (this.formCredit.get('amount')?.value.match(valoresAceptados) == null ||
      this.formCredit.get('term')?.value.match(valoresAceptados) == null ||
      this.formCredit.get('term')?.value.match(valoresAceptados) == null) {
      this.errorForm = true;
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
      interest: this.formCredit.get('interest')?.value
    };
    if (idSuscripcion !== 0) {
      datosAEnviar.id = this.idCredit;
    }
    return datosAEnviar;
  }

  // Metodo encargado de limpiar todo el formulario
  cleanform() {
    this.formCredit.get('name')?.setValue('');
    this.formCredit.get('amount')?.setValue('');
    this.formCredit.get('term')?.setValue('');
    this.formCredit.get('interest')?.setValue('');
  }

  // Metodo encargado de cargar datos cuanto la opcion es actualizar
  precargarDatosEnFormulario(credit: Credit) {
    this.idCredit = credit.id;
    this.formCredit.get('name')?.setValue(credit.name);
    this.formCredit.get('amount')?.setValue(credit.amount);
    this.formCredit.get('term')?.setValue(credit.term);
    this.formCredit.get('interest')?.setValue(credit.interest.toString());
  }

}
