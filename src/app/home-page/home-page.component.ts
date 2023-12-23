import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { StorageService } from '../storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  constructor(private router: Router, private storage: StorageService, private route: ActivatedRoute) { this.route = route; }

  async doLogout() {
    this.storage.clear();
    this.router.navigate(['']);
  }

}

export interface User{
  name: string;
}