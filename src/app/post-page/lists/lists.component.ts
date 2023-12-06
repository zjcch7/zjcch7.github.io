import { Component,Input,Output,EventEmitter } from '@angular/core';
import { NgModule } from "@angular/core"; 
import { BrowserModule } from "@angular/platform-browser"; 
import { FormsModule } from "@angular/forms"; 
import { MatCardModule } from "@angular/material/card"; 
import { MatButtonModule } from "@angular/material/button"; 
import { Character } from 'src/app/character.model';
import { ListServiceService } from '../../list-service.service'
import { Subscription, subscribeOn } from 'rxjs';
import { LoginService } from '../../login/login-component/login.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})


export class ListsComponent {

  name: string = "No user";

  constructor(private listService:ListServiceService, private loginService:LoginService){}
  userList:[] = []

  public postList: any[] = []
  private postSub: Subscription
  ngOnInit(): void {
  
    
  this.loginService.currentUserName$.subscribe({
      next: (name) => this.name = name,
      error: (error) => console.error('Error in currentUserName subscription', error)
  });

    this.listService.GetAllCharactersByUser()
    this.postSub = this.listService.getAllCharacterListener().subscribe((posts: Character[]) => {
      this.postList = posts
      console.log(this.postList)
    })
        
    
}
commentsCard:boolean = false
hideButton:boolean = false
selectedPostId: string;
viewComments(postId:string){
  this.selectedPostId=postId
  this.commentsCard = true
  this.hideButton = true
  
}
hideComments(){
  this.commentsCard = false
  this.hideButton=false
}
}
