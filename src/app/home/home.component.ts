import { Component } from '@angular/core';
import { ListServiceService } from '../list-service.service'
import { NgForm } from '@angular/forms';
import { FormBuilder, Validators } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router'; // Import Router
import { Character } from "../character.model"

import { LoginService } from '../login/login-component/login.service';
import { Subscription } from 'rxjs';
import { chat_v1 } from 'googleapis';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private titleService: Title, private loginService: LoginService,  private router: Router,private listService: ListServiceService){
    titleService.setTitle("Home - FictionBattles")
  }

  userLoggedIn: boolean = false;
    name: string = "No user";

  public votingCharacter1: Character
  public votingCharacter2: Character

  public character1Count: any
  public character1CountSub: Subscription
  public character2Count: Number
  public character2CountSub: Subscription

  //public ballotList: Character[] = []
  private ballotSub: Subscription

    ngOnInit() {
      this.loginService.currentUserLoggedIn$.subscribe({
          next: (status) => this.userLoggedIn = status,
          error: (error) => console.error('Error in userLoggedIn subscription', error)
      });
      this.loginService.currentUserName$.subscribe({
          next: (name) => this.name = name,
          error: (error) => console.error('Error in currentUserName subscription', error)
      });
      this.loginService.currentUserLoggedIn$.subscribe(status => this.userLoggedIn = status);

      this.listService.GetVotingCharacters()
      this.ballotSub = this.listService.getBallotUpdateListener().subscribe((characters: Character[]) =>{
         this.votingCharacter1 = characters[0]
        // console.log("Character 1: ")
        // console.log(this.votingCharacter1)

        this.votingCharacter2 = characters[1]
        // console.log("Character 2:")
        // console.log(this.votingCharacter2)
      })


      //console.log("Character count 1: ", this.character1Count)
      

  }


  
  loggedOut() {
    this.loginService.performLogout(); // Ensure this calls logoutUser() internally
    this.router.navigate(['/login']);
}


  

voteFor1:boolean = true;
 voteFor2:boolean = true;
 announces1:boolean = false;
 announces2:boolean = false;
 voteTotals1:boolean = false;
 voteTotals2:boolean = false;
 seeResults:boolean=false;

 voteTaly1(){
  this.voteFor1 = false;
  this.voteFor2 = false;
  this.announces1 = true;
  this.seeResults=true;
  document.getElementById("vbody").style.backgroundImage=`linear-gradient(to bottom, #15e6ca, #0c1b1be3)`;
//add try to handle error for user already voted. 
  this.listService.Vote(this.votingCharacter1)
  console.log('votes for 1:',this.character1Count)
  console.log('votes for 2:',this.character2Count)


 }
 voteTaly2(){
  this.voteFor1 = false;
  this.voteFor2 = false;
  this.announces2 = true;
  this.seeResults=true;
  document.getElementById("vbody").style.backgroundImage=`linear-gradient(to bottom, #15e6ca, #0c1b1be3)`;
  this.listService.Vote(this.votingCharacter2)
 }

 backResultSelect:boolean=false;
 viewResultsFor1(){
  this.seeResults=false;
  this.voteTotals1=true;
  this.backResultSelect=true;
  this.listService.GetVoteCount(this.votingCharacter1)
  this.character1CountSub = this.listService.getCountUpdateListener().subscribe((voteCount: number) => {
      this.character1Count = voteCount
  })
 }
 
 viewResultsFor2(){
  this.seeResults=false;
  this.voteTotals2 = true;
  this.backResultSelect=true;
  this.listService.GetVoteCount(this.votingCharacter2)
  this.character2CountSub = this.listService.getCountUpdateListener().subscribe((voteCount: number) => {
      this.character2Count = voteCount
  })
 }
 
 formResultSelect(){
  this.backResultSelect=false;
  this.seeResults=true;
  this.voteTotals2=false;
  this.voteTotals1=false;

 }


}

