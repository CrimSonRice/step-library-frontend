import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsComponent } from '../groups/groups.component';
import { BooksComponent } from '../books/books.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { User } from '../user';
import { environment } from '../../environments/environment.development';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, GroupsComponent, BooksComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  user: User;
  hasJoinedGroup:boolean = false;
  constructor(private router:Router, private route:ActivatedRoute, private storage:StorageService){
    if(this.storage.getItem('user_logined')==null){
      this.router.navigate(['/home'], {replaceUrl: true, relativeTo: this.route})
    }
    this.user = JSON.parse(this.storage.getItem('user_logined')?? '{}');
    this.hasJoinedGroup = (this.user.user?.group_id!= null)
  }
  get username(){return this.user.user?.username;}

  doLogout() {
    this.storage.clear();
    this.router.navigate(['/'],{relativeTo: this.route});
    alert('Logged out!');
  }

  doLeaveGroup(group_id:string){
    fetch(environment.API_URL+'unsubscribe.php',{
      method: "POST",
      body: JSON.stringify({api_token:environment.API_TOKEN , group_id : group_id , student_token: this.user.token})
    }).then(res=>{
      console.log(res);
      if(this.user.user) this.user.user.group_id = null;
      this.storage.setItem('user_logined', JSON.stringify((this.user)));
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/home']))
    })
  }
}



