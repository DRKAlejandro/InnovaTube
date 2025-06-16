import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firebase } from '../../services/firebase';

@Component({
  selector: 'app-card-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-video.html',
  styleUrls: ['./card-video.css'],
})
export class CardVideo implements OnInit {
  @Input() video: any;
  isFavorite = false;
  userEmail: string | null = null;

  constructor(private firebase: Firebase) {}

  async ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    this.userEmail = user?.email || null;
    this.checkFavoriteStatus();
  }


  async checkFavoriteStatus() {
    if (this.userEmail && this.video?.id?.videoId) {
      this.isFavorite = await this.firebase.isFavorite(this.userEmail, this.video.id.videoId);
    }
  }

  async toggleFavorite() {
    if (!this.userEmail || !this.video?.id?.videoId) {
      return;
    }

    try {
      if (this.isFavorite) {
        await this.firebase.removeFavorite(this.userEmail, this.video.id.videoId);
      } else {
        await this.firebase.addFavorite(this.userEmail, this.video);
      }
      this.isFavorite = !this.isFavorite;
    } catch (error) {
    }
  }
}
