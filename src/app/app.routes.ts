import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';


export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'sign-up', component: SignupComponent},
  
];
