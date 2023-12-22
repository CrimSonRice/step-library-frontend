import {Component} from '@angular/core';
import { environment } from '../../environments/environment.development';
import { StorageService } from '../storage.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface Group {
  id: string;
  name: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  groups: Group[] | null = null;
  user: any;

  constructor(private router: Router, private storage: StorageService, private route: ActivatedRoute) { this.route = route;}

  async ngOnInit() {
    this.user = JSON.parse(this.storage.getItem('user_logined') ?? '{}');
    if (this.user && this.user.group_id) {
      // If the user is already subscribed to a group, navigate to the books page
      this.router.navigate(['/books']);
    } else {
      // If the user is not subscribed to any group, load the list of groups
      await this.loadGroups();
    }
  }

  async loadGroups() {
    const response = await fetch(`${environment.API_URL}groups.php?api_token=${environment.API_TOKEN}`);
    const data = await response.json();
    this.groups = data;
  }

  async doJoinGroup(groupId: string) {
    const response = await fetch(`${environment.API_URL}subscribe.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_token: environment.API_TOKEN,
        group_id: groupId,
        student_token: this.user.token
      })
    });
    const data = await response.json();
    if (data.status === 'SUCCESS') {
      this.user.group_id = groupId;
      this.storage.setItem('user_logined', JSON.stringify(this.user));
      this.router.navigate(['/books']);
    } else {
      alert(`Failed to join group: ${data.error}`);
    }
  }

  async doUnsubscribe() {
    const response = await fetch(`${environment.API_URL}unsubscribe.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_token: environment.API_TOKEN,
        student_token: this.user.token
      })
    });
    const data = await response.json();
    if (data.status === 'SUCCESS') {
      delete this.user.group_id;
      this.storage.setItem('user_logined', JSON.stringify(this.user));
      await this.loadGroups();
    } else {
      alert(`Failed to unsubscribe: ${data.error}`);
    }
  }


}