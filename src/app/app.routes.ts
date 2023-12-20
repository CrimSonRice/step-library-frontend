import { Routes } from '@angular/router';
import { RegisterPageComponent } from './app/register-page/register-page.component'; 
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Routes = [
  { path: 'Register', component: RegisterPageComponent },
  {path: 'HomePage', component: HomePageComponent}
];
