import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CalculateInterface } from '../model/calculateinterface';
import { Credit } from '../model/credit';
import { CreditInterface } from '../model/creditinterface';
import { LoginInterface } from '../model/login';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  private nameEntity = '/credits';
  private nameLoginEntity = "/oauth";
  private nameCalculate = "/calculate";

  constructor(protected http: HttpClient) { }

  public getData() {
    return this.http.get<Credit[]>(`${environment.endpoint}${this.nameEntity}` );
  }

  public save(suscripcion: CreditInterface) {
    return this.http.post<any>(`${environment.endpoint}${this.nameEntity}`, suscripcion);
  }

  public upgrade(suscripcion: CreditInterface) {
    return this.http.put<any>(`${environment.endpoint}${this.nameEntity}`, suscripcion);
  }

  public login(loginData: LoginInterface) {
    return this.http.post<any>(`${environment.endpoint}${this.nameLoginEntity}`, loginData);
  }

  public calculate(calculateInterface: CalculateInterface) {
    return this.http.post<any>(`${environment.endpoint}${this.nameEntity}${this.nameCalculate}`, calculateInterface);
  }
}
