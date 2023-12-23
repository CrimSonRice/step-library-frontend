import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-books',
  standalone: true,
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent {
  private user: User;
  books: Book[]|null = null;
  isLoadingBooks:boolean = true;
  serverUrl:string = environment.API_URL.substring(0,environment.API_URL.length-1)

  constructor(private router:Router, private route:ActivatedRoute, private storage: Storage){
    if(this.storage.getItem('user_logined') == null){
      this.router.navigate(['/home'], {replaceUrl: true, relativeTo: this.route})
    }
    this.user = JSON.parse(this.storage.getItem('user_logined')??'{}');
    this.loadBooks(this.user).then(books => {
      this.books = books;
    });
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
}

export interface Book{
  id:number,
  title: string,
  path: string,
  user_id:number,
  group_id: number,
  image: any,
}
