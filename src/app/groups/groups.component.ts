import { Component } from '@angular/core';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { BooksComponent } from '../books/books.component';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports :[CommonModule,BooksComponent],
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
  books: BooksComponent[]|null = null;

  constructor(private router: Router, private route:ActivatedRoute, private storage: StorageService ){
    if(this.storage.getItem('user_logined') == null){
      this.router.navigate(['/home'], {replaceUrl: true, relativeTo: this.route})
    }
    this.user = JSON.parse(this.storage.getItem('user_logined')??'{}');
    this.loadGroups();
  }

  ngOnInit() {
    this.isSubscribed = localStorage.getItem('isSubscribed') === 'true';
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
        this.groups = data.groups; 
        console.log('Groups:', this.groups);

        if (data.student_token) {
          const studentToken = data.student_token;
          localStorage.setItem('student_token', studentToken);
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
    fetch(environment.API_URL+'subscribe.php',{
      method: "POST",
      body: JSON.stringify({api_token: environment.API_TOKEN,
      student_token: this.user.token, group_id:group_id})
    }).then(res=>res.json()).then(res=>{
      console.log(res);
      if(this.user.user) this.user.user.group_id = group_id;
      this.storage.setItem('user_logined', JSON.stringify(this.user));

      this.router.navigateByUrl('/books',{skipLocationChange:true}).then(()=>{
        this.router.navigate(['/home'])
      })    
    }).catch(e=>alert(e))
    .finally(()=>this.inJoiningProgress = false);

    /*
    if(result){
      this.books = result;
      if(this.books){
        this.books = this.books.map(b=>{return{...b,
          path:`${this.serverUrl}${b.path}?api_token=${environment.API_TOKEN}&user_token=${this.user.token}`,
          image: `${this.serverUrl}/images/${b.title.substring(0,8).toLowerCase()}.png`
        };});
        
      }
      console.log(result);
    }
    this.isLoadingBooks = false;
    */
  }
  
}

export interface Group{
  id: string,
  name: string
}
