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
  isLoading = false;
  isSearching = false;
  hasMoreResults = true;
  currentSearchKey = 'trending';

  favoritesSearchQuery = '';
  filteredFavorites: any[] = [];
  favorites: any[] = [];
  isFavoritesLoading = false;
  activeTab: 'videos' | 'favorites' = 'videos';

  constructor(private youtube: Youtube, private firebase: Firebase) { }

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

  searchFavorites() {
    if (!this.favoritesSearchQuery.trim()) {
      this.filteredFavorites = [...this.favorites];
      return;
    }

    const searchTerms = this.favoritesSearchQuery.toLowerCase().split(' ');

    const scoredFavorites = this.favorites.map(fav => {
      let score = 0;
      const fieldsToSearch = [
        { text: fav.snippet.title, weight: 3 },
        { text: fav.snippet.channelTitle, weight: 2 },
        { text: fav.snippet.description, weight: 1 },
        { text: fav.snippet.tags ? fav.snippet.tags.join(' ') : '', weight: 2 }
      ];

      searchTerms.forEach(term => {
        fieldsToSearch.forEach(field => {
          if (field.text.toLowerCase().includes(term)) {
            score += field.weight;
            if ((field.text.toLowerCase() === term) && (field.weight >= 2)) {
              score += 2;
            }
          }
        });
      });

      return { video: fav, score };
    });

    this.filteredFavorites = scoredFavorites
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.video);
  }

  async refreshFavorites() {
    this.isFavoritesLoading = true;
    try {
      await this.loadFavorites();
      this.searchFavorites();
    } finally {
      this.isFavoritesLoading = false;
    }
  }

  private async loadFavorites() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user && user.email) {
        this.favorites = await this.firebase.getFavorites(user.email);
        this.filteredFavorites = [...this.favorites];
      } else {
        this.favorites = [];
        this.filteredFavorites = [];
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      this.favorites = [];
      this.filteredFavorites = [];
    }
  }

  switchTab(tab: 'videos' | 'favorites') {
    this.activeTab = tab;
    if (tab === 'favorites') {
      this.refreshFavorites();
    }
  }

  ngOnInit() {
    this.loadFavorites();
    this.loadTrendingVideos();
  }
}
