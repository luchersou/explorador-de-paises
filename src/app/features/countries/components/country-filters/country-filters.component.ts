import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

import { Region } from '@countries/types/region.type';
import { SortOption } from '@countries/types/sort-option.type';

@Component({
  selector: 'app-country-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './country-filters.component.html'
})
export class CountryFiltersComponent {

  // Outputs
  readonly searchChange = output<string>();
  readonly regionChange = output<Region | ''>();
  readonly sortChange = output<SortOption>();

  // State
  readonly search = signal('');
  readonly region = signal<Region | ''>('');
  readonly sort = signal<SortOption>('');

  constructor() {
    // toObservable automatically unsubscribes when the component is destroyed
    toObservable(this.search)
      .pipe(debounceTime(300))
      .subscribe(value => this.searchChange.emit(value));
  }

  onRegionChange(value: Region | ''): void {
    this.region.set(value);
    this.regionChange.emit(value);
  }

  onSortChange(value: SortOption): void {
    this.sort.set(value);
    this.sortChange.emit(value);
  }

}