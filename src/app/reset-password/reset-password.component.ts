// Import necessary modules
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListServiceService } from '../list-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent  {

  resetForm: FormGroup;
  token: string;
  message: string = '';
  showMessage: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private listService: ListServiceService, 
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });

    this.token = this.route.snapshot.queryParams['token'];
  }


  onSubmit() {
    if (this.resetForm.invalid) {
      return; // Stop here if form is invalid
    }

    const password = this.resetForm.get('password')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    if (this.token && password && confirmPassword) {
      this.listService.resetPassword(this.token, password, confirmPassword).subscribe({
        next: (response) => {
          // Handle the success response
          this.message = "Successfully updated password. You will be redirected to login.";
          this.showMessage = true; // This flag will be used to display the message

          // Wait for 3 seconds before redirecting
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          // Handle the error response
          this.message = "Failed to reset password. Please try again.";
          this.showMessage = true;
        }
      });
    }
  }
}
