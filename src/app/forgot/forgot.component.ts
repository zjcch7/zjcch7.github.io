import { Component } from '@angular/core';
import { ListServiceService } from './../list-service.service'
import { NgForm } from '@angular/forms';
import { FormBuilder, Validators, AbstractControl,FormGroup, FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MapReduceOptions } from 'mongoose';
import { PopupComponent } from './popup.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {


  constructor( private dialogRef : MatDialog, private titleService: Title, private listService: ListServiceService){
    titleService.setTitle("Reset Password - FictionBattles")
  }
  notFoundError: String;
  errorStatus: boolean = false;

  onSubmit() {
    const email = this.emailResetForm.get('email')?.value;
    if (email) {
      this.listService.forgotPassword(email).subscribe({
        next: (response) => {
          console.log(response.message);
          // Now call confirmSent with the email
          this.confirmSent(email);
        },
        error: (error) => {
          console.error(error);
          this.errorStatus = true;
          this.notFoundError = "There was an error sending a reset email";
          console.log(this.notFoundError)
          
        }
      });
    }
  }

  confirmSent(email: string){
    this.dialogRef.open(PopupComponent, {
      data: { name: email } // Pass the email to the PopupComponent
    });
  }
   

  emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  
  emailResetForm = new FormGroup({

   email : new FormControl("", [Validators.required, Validators.maxLength(32), Validators.pattern(this.emailRegex)])

  })


  getControl(name: any): AbstractControl | null {

    return this.emailResetForm.get(name)

  }

  registerFn(){

    console.log(this.emailResetForm.value)

  }
}
