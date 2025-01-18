import { Component, OnInit } from '@angular/core';
import {
  animate,
  // state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';

interface Image {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-auth-main',
  templateUrl: './auth-main.component.html',
  styleUrls: ['./auth-main.component.scss'],
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
export class AuthMainComponent implements OnInit {
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

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.shuffleImages();
    setInterval(() => {
      this.shuffleImages();
    }, 5000);
    this.isLoading = this.store.pipe(select(authSelectors.getAuthIsLoading));
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
