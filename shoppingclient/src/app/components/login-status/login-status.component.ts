import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { LoginViewModel } from 'src/app/models/login-view-model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string;
  user!: LoginViewModel;
  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthService, private loginService: AuthService) { }

  ngOnInit(): void {

    // Subscribe to authentication state changes
    /*this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );*/
    this.loginService.user.subscribe(
      user => {
        console.log("this is user", user)
        this.isAuthenticated = (!!user && user.username !== '') ;
        this.userFullName=user.username;
        this.user = user;
      }
    )
    
  }

  getUserDetails() {
    if (this.isAuthenticated) {

      // Fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name
      this.oktaAuthService.getUser().then(
        (res) => {
          this.userFullName = res.name;

          // retrieve the user's email from authentication response
          const theEmail = res.email;

          // now store the email in browser storage
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
        }
      );
    }
  }

  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.loginService.signOut();
  }
}
