import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  socialUser?: SocialUser;
  userLogged?:SocialUser;
  isLogued?:boolean;

  constructor(private authService: SocialAuthService, private router:Router) { }

  ngOnInit(): void {
    this.authService.authState.subscribe(
      data=>{
        this.userLogged = data;
        this.isLogued = this.userLogged != null;
      }
    );
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data=>{
      this.socialUser = data;
      this.router.navigate(['/home']);
      this.isLogued = true;
    });
  }

  signOut(): void {
    this.authService.signOut();
  }

}
