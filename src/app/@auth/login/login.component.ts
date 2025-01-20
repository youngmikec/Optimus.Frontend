import {
  animate,
  // state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/@core/services/helper.service';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as AuthAction from 'src/app/@core/stores/auth/auth.actions';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
interface Image {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('imgAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2000ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('2000ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading!: Observable<boolean>;
  images: Image[] = [
    { src: 'assets/images/login/image1.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image2.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image3.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image4.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image5.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image6.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image7.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image8.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image9.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image10.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image1.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image2.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image3.jpg', alt: 'Image 1' },
    { src: 'assets/images/login/image4.jpg', alt: 'Image 1' },
  ];
  shuffledImages: Image[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.shuffleImages();
    setInterval(() => {
      this.shuffleImages();
    }, 5000);

    this.isLoading = this.store.pipe(select(authSelectors.getAuthIsLoading));

    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
          ),
        ],
      ],
    });
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }

  getErrorMessage(instance: string) {
    this.loginForm.get('email')?.updateValueAndValidity();
    if (
      instance === 'email' &&
      this.loginFormControls['email'].hasError('required')
    ) {
      return 'Please enter your email';
    } else if (
      instance === 'email' &&
      this.loginFormControls['email'].hasError('email')
    ) {
      return 'Sorry, this is not a valid email';
    } else if (
      instance === 'password' &&
      this.loginFormControls['password'].hasError('required')
    ) {
      return 'Please enter your password';
    } else if (
      instance === 'password' &&
      this.loginFormControls['password'].hasError('pattern')
    ) {
      return 'Your password must have at least 1 uppercase, digit (0-9), special character, and a minimum of 8 characters.';
    } else {
      return;
    }
  }

  onSubmit() {
    this.store.dispatch(AuthAction.IsLoading({ payload: true }));

    this.helperService.manageDeveloperTokenAndCallFunction(
      this.login.bind(this)
    );
  }

  login() {
    this.store.dispatch(
      AuthAction.LoginStart({
        payload: {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
        },
      })
    );
  }

  shuffleImages(): void {
    this.shuffledImages = this.shuffle(this.images).slice(0, 12);
  }

  shuffle(array: Image[]): any[] {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
