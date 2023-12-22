import { Component } from '@angular/core';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  groups: Group[]|null = null;
  user: User;
  inJoiningProgress:boolean = false;
  constructor(private router: Router, private route:ActivatedRoute, private storage: StorageService ){
    if(this.storage.getItem('user_logined') == null){
      this.router.navigate(['/home'], {replaceUrl: true, relativeTo: this.route})
    }
    this.user = JSON.parse(this.storage.getItem('user_logined')??'{}');
    this.loadGroups();
  }

  async loadGroups(){
    const res = await fetch(environment.API_URL + 'groups.php?api_token='+environment.API_TOKEN )
    this.groups = res.groups;
  }

  doJoinGroups(group_id:string){
    if(this.inJoiningProgress) return;
    this.inJoiningProgress = true;
    fetch(environment.API_URL+ 'subscribe.php', {
      method: 'POST',
      body: JSON.stringify({api_token: environment.API_TOKEN,
      student_token: this.user.token, group_id: group_id})
    }).then(res=>res.json()).then(res=>{
      console.log(res);
      if(this.user.user) this.user.user.group_id = group_id;
      this.storage.setItem('user_logined', JSON.stringify(this.user));

      this.router.navigateByUrl('/', {skipLocationChange:true}).then(()=>{
        this.router.navigate(['/home']);
      })
    }).catch(e=>alert(e))
    .finally(()=>this.inJoiningProgress = false);
  }
}

export interface Group{
  id: string,
  name: string
}


