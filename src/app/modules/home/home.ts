import { Component } from '@angular/core';
import { Youtube } from '../../services/youtube';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CardVideo } from '../../components/card-video/card-video';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, HttpClientModule, CardVideo],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  searchQuery = '';
  videos: any[] = [];
  favorites: any[] = [];

  constructor(private youtube: Youtube) { }

  
  search() {
    if (!this.searchQuery) return;

    this.youtube.searchVideos(this.searchQuery).subscribe(response => {
      this.videos = response.items;
    });
  }

  toggleFavorite(video: any) {
    const index = this.favorites.findIndex(fav => fav.id.videoId === video.id.videoId);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(video);
    }

    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  isFavorite(video: any): boolean {
    return this.favorites.some(fav => fav.id.videoId === video.id.videoId);
  }

  ngOnInit() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
    this.youtube.getTrendingVideos().subscribe(res => {
      this.videos = res.items;
    });
  }
}
