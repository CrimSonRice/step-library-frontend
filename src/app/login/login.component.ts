import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CarouselModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  cred:Partial<{ username: string | null, password:string | null, api_token: string; }>={username: '', password: '',api_token: environment.API_TOKEN};
  user = this.builder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  username = new FormControl('tola');
  password = new FormControl('');
  message:string = '';
  constructor(private router: Router,
    private route:ActivatedRoute,
    private builder:FormBuilder,
    private storage:StorageService ){
      this.router = router;
      this.route = route;
      if(window.localStorage.getItem('user_logined')){
        this.router.navigate(['/home'], {replaceUrl:true, relativeTo:this.route});
      }
      if(this.router.getCurrentNavigation()?.extras.state){
        const state = this.router.getCurrentNavigation()?.extras.state??{register: this.route}
        if(state['registerd'] == true){
          this.message = "Registered SUCCESSFULLY!!!";
        }
      }
    }

    doLogin(){
      this.cred.username = this.user.value.username;
      this.cred.password = this.user.value.password;
      fetch(environment.API_URL+'login.php',{
        method: 'POST',
        body: JSON.stringify(this.cred)
      }).then(res=>res.json()).then(res=>{
        if(res.error==''){
          this.storage.setItem('user_logined', JSON.stringify(res));
          this.router.navigate(['/home'], {replaceUrl:true, relativeTo: this.route});
        }else{
          this.message = res.error;
        }
      })
    }
  
    doSignUp(){
      this.router.navigate(['/sign-up'], {replaceUrl: true , relativeTo: this.route});
    }
    
    
}
