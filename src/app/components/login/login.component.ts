import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { LoginInterface } from '../model/login';
import { CreditService } from '../service/credit.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  socialUser?: SocialUser;
  userLogged?: SocialUser;
  isLogued?: boolean;

  constructor(private authService: SocialAuthService,
    private router: Router,
    protected creditService: CreditService,) { }

  ngOnInit(): void {
    this.authService.authState.subscribe(
      data => {
        this.userLogged = data;
        this.isLogued = this.userLogged != null;
      }
    );
  }

  // Metodo encargado de realizar autenticacion con google
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.socialUser = data;
      this.login(data.idToken);
      this.isLogued = true;
    });
  }

  // Metodo encargado de validar autenticacion con el backend
  login(token: string) {
    let tokenLogin: LoginInterface = {
      value: token
    }
    this.creditService.login(tokenLogin).subscribe(async (response: any) => {
      if (response.email_verified) {
        this.router.navigate(['/home']);
      }
    }, error => {
      console.log(error['401']);
    });
  }

  // Metodo encargado de salir del sistema y desloguear al usuario
  signOut(): void {
    this.authService.signOut();
  }

}
