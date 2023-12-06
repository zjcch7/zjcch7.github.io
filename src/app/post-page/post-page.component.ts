import { Component } from '@angular/core';
import { LoginService } from '../login/login-component/login.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ListServiceService } from './../list-service.service'
import { Character } from "../character.model"
import { Subscription, subscribeOn } from 'rxjs';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent {

  constructor(private titleService: Title, private loginService: LoginService, private router: Router, private listService: ListServiceService){
    titleService.setTitle("View Lists - FictionBattles")
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
