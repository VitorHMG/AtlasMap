import { Component } from '@angular/core';
import { CommunityFeedComponent } from './community-feed.component';

@Component({
  selector: 'app-feed-page',
  imports: [CommunityFeedComponent],
  template: '<app-community-feed [showHeading]="true" />',
})
export class FeedPageComponent {}
