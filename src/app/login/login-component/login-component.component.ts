import { Component } from '@angular/core';
import { ListServiceService } from '../../list-service.service'
import { NgForm } from '@angular/forms';
import { FormBuilder, Validators, AbstractControl,FormGroup, FormControl } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import { Input } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router'; // Import Router


@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css','login.css']
})



export class LoginComponentComponent {
  constructor(public service: ListServiceService, public formBuilder: FormBuilder, private titleService: Title, public data: LoginService,  private router: Router, private loginService: LoginService){ // Inject the Router
    titleService.setTitle("Log In - FictionBattles")
  }

  message:string;
  status:boolean;
  notFoundError: String;
  errorStatus: boolean = false;
  missingInput: boolean;
  loginSuccess: boolean = false;
  
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

  
  onLogin(form: NgForm){
    if(form.invalid){
      this.missingInput = true
      return;
    }
  
    this.service.TryLogin(form.value.email, form.value.password).subscribe({
      
      next: (response) => {

        console.log("Successful response", response);
    
        // Pass the username to loginUser method
        this.data.loginUser(response.username); 
    
        // Navigate to the homePage or different page

        this.loginSuccess = true;
        this.errorStatus = false;

        setTimeout(() => {
          this.router.navigate(['/home']);
      }, 0);  //5s
      },
      error: (error) => {
        console.error(error);
        this.message = "Login failed. Please try again.";
        this.errorStatus = true;
        this.notFoundError = "Email or Password is incorrect";
        console.log(this.notFoundError)
      }
    });
    
    // Reset the form
    this.missingInput = false
    form.resetForm();    
  }
  
  visable:boolean = true;
  changeType:boolean = false;

  viewPass(){
    this.visable = !this.visable;
    this.changeType = !this.changeType;
  }

  

  loginForm = this.formBuilder.group({
    username : new FormControl("", [Validators.required]),
    password : new FormControl("", [Validators.required])

  })
  
  name: string = "No user";
  userLoggedIn: boolean = false;
  username: string;
  
  loggedIn(){
    this.name = this.username;
    this.userLoggedIn = true
    this.loginForm.reset()
  }

  loggedOut() {
    this.loginService.performLogout(); // Ensure this calls logoutUser() internally
    this.router.navigate(['/login']);
  }

  
  
}
