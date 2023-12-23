import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { environment } from '../../environments/environment.development';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private route:ActivatedRoute,) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirm_password) {
        this.errorMessage = 'Password and Confirm Password must match.';
        return;
      }

      const body = {
        api_token: environment.API_TOKEN,
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        confirm_password: this.registerForm.value.confirm_password
      };

      fetch(environment.API_URL + 'register.php', {
        method: 'POST',
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'SUCCESS') {
          this.router.navigate([''], {replaceUrl: true, relativeTo: this.route});
          alert("Registered Successfully!");
        } else {
          this.errorMessage = data.error;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        this.errorMessage = 'An error occurred while registering.';
      });
    }
  }
     
}
