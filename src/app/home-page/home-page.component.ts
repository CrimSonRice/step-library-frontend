import { Component} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ReactiveFormsModule,CarouselModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  
  
}