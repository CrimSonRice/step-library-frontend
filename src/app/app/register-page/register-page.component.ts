import { Component } from '@angular/core';
import { HomePageComponent } from '../../home-page/home-page.component';
@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RegisterPageComponent, HomePageComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})  
export class RegisterPageComponent {
  
}
