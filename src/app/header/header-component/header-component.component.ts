import { Component } from '@angular/core';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent {
  

  title = "Signup"

  clickLoginTitle(){
    this.title = "Login"
  }

  clickSignUpTitle(){
    this.title = "Signup"
  }

  clickCharacterTitle(){
    this.title = "Character"
  }
}



