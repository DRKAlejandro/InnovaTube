import { Component } from '@angular/core';
import { Youtube } from '../../services/youtube';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CardVideo } from '../../components/card-video/card-video';
import { Firebase } from '../../services/firebase';

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
  isLoading = false;
  isSearching = false;
  hasMoreResults = true;
  currentSearchKey = 'trending';
  activeTab: 'all' | 'favorites' = 'all';

  constructor(private youtube: Youtube, private firebase: Firebase,
  ) { }


  setActiveTab(tab: 'all' | 'favorites') {
    this.activeTab = tab;
    if (tab === 'favorites') {
      this.loadFavorites();
    } else {
      this.loadTrendingVideos();
    }
  }

  search() {
    if (!this.searchQuery.trim()) {
      this.loadTrendingVideos();
      return;
    }

    this.isSearching = true;
    this.isLoading = true;
    this.videos = [];
    this.currentSearchKey = this.searchQuery;
    this.youtube.clearNextPageToken(this.currentSearchKey);
    this.hasMoreResults = true;

    this.youtube.searchVideos(this.searchQuery).subscribe({
      next: (response) => {
        this.videos = response.items;
        this.youtube.setNextPageToken(this.currentSearchKey, response.nextPageToken || '');
        this.hasMoreResults = !!response.nextPageToken;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  loadMore() {
    if (this.isLoading || !this.hasMoreResults) return;

    this.isLoading = true;

    const observable = this.isSearching
      ? this.youtube.searchVideos(this.currentSearchKey, true)
      : this.youtube.getTrendingVideos(true);

    observable.subscribe({
      next: (response: { items: any[], nextPageToken: string }) => {
        const newVideos = response.items.filter((newVideo: any) =>
          !this.videos.some((existingVideo: any) =>
            existingVideo.id.videoId === newVideo.id.videoId
          )
        );

        this.videos = [...this.videos, ...newVideos];
        this.youtube.setNextPageToken(this.currentSearchKey, response.nextPageToken || '');
        this.hasMoreResults = !!response.nextPageToken;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
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
    this.loadFavorites();
    this.loadTrendingVideos();
  }

  private async loadFavorites() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user && user.email) {
        this.favorites = await this.firebase.getFavorites(user.email);
      } else {
        this.favorites = [];
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      this.favorites = [];
    }
  }


  private loadTrendingVideos() {
    this.isSearching = false;
    this.isLoading = true;
    this.videos = [];
    this.currentSearchKey = 'trending';
    this.youtube.clearNextPageToken(this.currentSearchKey);
    this.hasMoreResults = true;

    this.youtube.getTrendingVideos().subscribe({
      next: (res) => {
        this.videos = res.items || [];
        this.youtube.setNextPageToken(this.currentSearchKey, res.nextPageToken || '');
        this.hasMoreResults = !!res.nextPageToken;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }
}
