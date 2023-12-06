import { Component } from '@angular/core';
import { ListServiceService } from './../list-service.service'
import { NgForm } from '@angular/forms';
import { FormBuilder, Validators } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import { LoginService } from '../login/login-component/login.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  constructor(private titleService: Title, private loginService: LoginService, 
    private router: Router ){
    titleService.setTitle("About - FictionBattles")
  }

  userLoggedIn: boolean = false;
    name: string = "No user";
  ngOnInit(){
    this.loginService.currentUserLoggedIn$.subscribe({
      next: (status) => this.userLoggedIn = status,
      error: (error) => console.error('Error in userLoggedIn subscription', error)
  });
  this.loginService.currentUserName$.subscribe({
      next: (name) => this.name = name,
      error: (error) => console.error('Error in currentUserName subscription', error)
  });
  this.loginService.currentUserLoggedIn$.subscribe(status => this.userLoggedIn = status);
  }

  loggedOut() {
    this.loginService.performLogout(); // Ensure this calls logoutUser() internally
    this.router.navigate(['/login']);
  }
}
  