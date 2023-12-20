import { AfterViewInit, Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HomePageComponent, CarouselModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialization logic here
  }

  ngAfterViewInit(): void {

  }

  OnSignUpClick() {
    // Navigate to register page
    this.router.navigateByUrl("/register");
  }
  
}