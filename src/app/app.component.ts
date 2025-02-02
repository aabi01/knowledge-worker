import { Component } from '@angular/core';
import { ScheduledQueriesComponent } from './components/scheduled-queries/scheduled-queries.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ScheduledQueriesComponent],
  template: '<app-scheduled-queries />',
})
export class AppComponent {}
