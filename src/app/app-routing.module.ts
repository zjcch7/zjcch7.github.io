import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponentComponent } from './signup/signup-component/signup-component.component';
import { LoginComponentComponent } from './login/login-component/login-component.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import{CharacterComponent} from './character/character.component'
import { ForgotComponent } from './forgot/forgot.component';
import { AboutComponent } from './about/about.component';
import { PostPageComponent } from './post-page/post-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path:'',component:LoginComponentComponent
  },
  {
    path:'login', component: LoginComponentComponent
  },
  {
    path:'signup', component: SignupComponentComponent
  },
  {
    path:'character', component: CharacterComponent
  },
  {
    path:'home', component:HomeComponent
  },
  {
  path:'forgot',component:ForgotComponent
  },
  {
    path:'post-page', component: PostPageComponent
  },
  {
    path:'about',component:AboutComponent
  },
  {
    path:'reset',component:ResetPasswordComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
