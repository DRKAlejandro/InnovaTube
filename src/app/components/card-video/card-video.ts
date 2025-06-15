import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-video',
  imports: [CommonModule],
  templateUrl: './card-video.html',
  styleUrls: ['./card-video.css'],
})
export class CardVideo {
  @Input() video: any;
}
