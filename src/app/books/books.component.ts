import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../user';
@Component({
  selector: 'app-books',
  standalone: true,
  imports: [],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
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
    this.loadBooks();
  }

  async loadBooks(){
    this.isLoadingBooks = true;
    const result = await fetch(environment.API_URL+'books.php', {
      method : 'POST',
      body: JSON.stringify({api_token: environment.API_TOKEN,
      student_token: this.user.token})
    }).then(res=>res.json().catch(e=>alert(e)));
    if(result){
      this.books = result;
      if(this.books){
        this.books = this.books.map(b=>{return{...b,
          path:`${this.serverUrl}${b.path}?api_token=${environment.API_TOKEN}&user_token=${this.user.token}`,
          image: `${this.serverUrl}/images/${b.title.substring(0,8).toLowerCase()}.png`
        };});
        console.log(result);
      }
    }
    this.isLoadingBooks = false;

    
  }
}

export interface Book{
  id:number,
  title: string,
  path: string,
  user_id:number,
  group_id: number,
}
