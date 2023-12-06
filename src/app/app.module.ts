import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from "@angular/material/card";
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LoginComponentComponent } from './login/login-component/login-component.component';
import { SignupComponentComponent } from './signup/signup-component/signup-component.component';
import { HeaderComponentComponent } from './header/header-component/header-component.component';
import { HomeComponent } from './home/home.component'
import { CharacterComponent } from './character/character.component';
import { ForgotComponent } from './forgot/forgot.component';
import { AboutComponent } from './about/about.component';
import { CommentsModule } from 'src/app/comments/comments.module';
import { PostPageComponent } from './post-page/post-page.component';
import { ListsComponent } from './post-page/lists/lists.component';
import { ProfanityFilterDirective } from './profanity-filter.directive';
import { ResetPasswordComponent } from './reset-password/reset-password.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    SignupComponentComponent,
    HeaderComponentComponent,
    HomeComponent,
    CharacterComponent,
    ForgotComponent,
    AboutComponent,
    PostPageComponent,
    ListsComponent,
    ProfanityFilterDirective,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatCardModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    CommentsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
