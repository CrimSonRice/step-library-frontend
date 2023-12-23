import { Component } from '@angular/core';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { Book } from '../books/books.component';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports :[CommonModule],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent {
  user: User;
  inJoiningProgress:boolean = false;
  groups: any[] = [];
  searchTerm: string = '';
  isSubscribed: boolean = false;
  errorMessage: string = '';
  books: Book[]|null = null;
  isLoadingBooks: boolean = false;

  serverUrl:string = environment.API_URL.substring(0,environment.API_URL.length-1)
  constructor(private router: Router, private route:ActivatedRoute, private storage: StorageService ){
    if(this.storage.getItem('user_logined') == null){
      this.router.navigate(['/home'], {replaceUrl: true, relativeTo: this.route})
    }
    this.user = JSON.parse(this.storage.getItem('user_logined')??'{}');
    this.loadGroups();
  }
  
  async loadGroups() {
    const apiToken = environment.API_TOKEN;
    const url = `http://172.104.166.110:8008/api/FT_SD_A_3/groups.php?api_token=${apiToken}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data from API:', data);
        this.groups = data.groups; // Assuming that the groups array is nested under the 'groups' property
        console.log('Groups:', this.groups); // Add this line for debugging

        // Check if the response contains the student token
        if (data.student_token) {
          const studentToken = data.student_token;
          localStorage.setItem('studentToken', studentToken);
        }

        localStorage.setItem('groups', JSON.stringify(this.groups));
      })
      .catch((error) => {
        console.error('Error fetching groups:', error);
        this.errorMessage = 'Error fetching groups.';
      });
  }

  doJoinGroups(group_id:string){
    if(this.inJoiningProgress) return;
    this.inJoiningProgress = true;
    fetch(environment.API_URL+ 'subscribe.php', {
      method: 'POST',
      body: JSON.stringify({api_token: environment.API_TOKEN,group_id: group_id,
      student_token: this.user.token})
    }).then(res=>res.json()).then(res=>{
      console.log(res);
      if(this.user) this.user.group_id = group_id;
      this.storage.setItem('user_logined', JSON.stringify(this.user));
  
      // Call loadBooks after successful subscription
      this.loadBooks(this.user).then(books => {
        this.router.navigateByUrl('/books', {skipLocationChange:true}).then(()=>{
          this.router.navigate(['/home']);
        });
      });
    }).catch(e=>alert(e))
    .finally(()=>this.inJoiningProgress = false);
  }
  
  async loadBooks(user: User) {
    const result = await fetch(environment.API_URL+'books.php', {
      method : 'POST',
      body: JSON.stringify({
        api_token: environment.API_TOKEN,
        student_token: user.token,
        group_id: user.group_id  // Add this line
      })
    }).then(res=>res.json().catch(e=>alert(e)));
    if(result){
      return result.map((b: any) => {return {...b,
        path:`${this.serverUrl}${b.path}?api_token=${environment.API_TOKEN}&user_token=${this.user.token}`,
        image: `${this.serverUrl}/images/${b.title.substring(0,8).toLowerCase()}.png`
      };});
    }
    return [];
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

  isInGroup(): boolean {
    // Here, 'this.user.group_id' is a placeholder. Replace it with the actual condition that checks if the user is in a group.
    return !!this.user.group_id;
  }
  
  isNotInGroup(): boolean {
    return !this.isInGroup();
  }
  

  async doLogout() {
    this.storage.clear();
    this.router.navigate(['']);
    alert('Logged out!');
  }
}

export interface Group{
  id: string,
  name: string
}
