import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl} from '@angular/forms';
import { ListServiceService } from './list-service.service'
import { List } from "./list.model";
import { FormBuilder, Validators } from "@angular/forms";
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ForgotComponent } from './forgot/forgot.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FictionBattles';

  constructor(public service: ListServiceService, public fb: FormBuilder){}


  ngOnInit(){

  }

  // onAddList(form: NgForm){
  //   if(form.invalid){
  //     return;
  //   }
  //   console.log("Character source in front end " + form.value.characterSource1)
  //   this.service.AddList(
  //     form.value.characterName1,
  //     form.value.characterSource1,
  //     form.value.characterName2,
  //     form.value.characterSource2,
  //     form.value.characterName3,
  //     form.value.characterSource3,
  //     form.value.characterName4,
  //     form.value.characterSource4,
  //     form.value.characterName5,
  //     form.value.characterSource5,
  //     form.value.characterName6,
  //     form.value.characterSource6,
  //     form.value.characterName7,
  //     form.value.characterSource7,
  //     form.value.characterName8,
  //     form.value.characterSource8,
  //     form.value.characterName9,
  //     form.value.characterSource9,
  //     form.value.characterName10,
  //     form.value.characterSource10,
  //   )

  //   form.resetForm()
  // }

  // onAddCharacter(form: NgForm){
  //   if(form.invalid){
  //     return;
  //   }

  //   this.service.AddCharacter(form.value.name, form.value.source, form.value.genre, form.value.powers,)
  //   form.resetForm()

  // }
}
