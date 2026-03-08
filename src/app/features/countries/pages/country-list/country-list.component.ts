import { 
  Component, 
  OnInit, 
  OnDestroy, 
  AfterViewInit, 
  signal, 
  computed, 
  inject, 
  effect, 
  ElementRef, 
  viewChild 
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { CountriesService } from '@core/services/countries.service';
import { Country } from '@core/models/country.model';
import { Region } from '@countries/types/region.type';
import { SortOption } from '@countries/types/sort-option.type';

import { filterCountries } from '@countries/utils/filter-countries';
import { sortCountries } from '@countries/utils/sort-countries';

import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { CountryCardComponent } from '@countries/components/country-card/country-card.component';
import { CountryFiltersComponent } from '@countries/components/country-filters/country-filters.component';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [
    LoadingComponent,
    ErrorMessageComponent,
    CountryCardComponent,
    CountryFiltersComponent
  ],
  templateUrl: './country-list.component.html'
})
export class CountryListComponent implements OnInit, AfterViewInit, OnDestroy {

  // Dependencies
  private readonly countriesService = inject(CountriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  // IntersectionObserver references for infinite scroll
  private readonly sentinel = viewChild.required<ElementRef>('sentinel');
  private observer?: IntersectionObserver;

  // Number of countries rendered per scroll page
  private readonly PAGE_SIZE = 15;

  // Raw data — never mutated after initial load
  private readonly allCountries = signal<Country[]>([]);
  private readonly page = signal(1);

  // State
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // UI state
  readonly searchTerm = signal('');
  readonly region = signal<Region | ''>('');
  readonly sort = signal<SortOption>('');

  constructor() {
    // Reconnects the observer after each page increment to keep tracking the sentinel
    effect(() => {
      this.page();
      const el = this.sentinel()?.nativeElement;
      if (!el || !this.observer) return;
      this.observer.disconnect();
      this.observer.observe(el);
    });
  }

  // Derived state — single source of truth for the template
  readonly filteredCountries = computed(() => {
    const filtered = filterCountries(
      this.allCountries(),
      this.searchTerm(),
      this.region()
    );
    return sortCountries(filtered, this.sort());
  });

  readonly visibleCountries = computed(() =>
    this.filteredCountries().slice(0, this.page() * this.PAGE_SIZE)
  );

  readonly hasMore = computed(() =>
    this.visibleCountries().length < this.filteredCountries().length
  );

  ngOnInit(): void {
    const data = this.route.snapshot.data['countries'] as Country[];

    // Use resolver data if available, otherwise fetch from the service
    if (data?.length) {
      this.allCountries.set(data);
      this.loading.set(false);
    } else {
      this.loadCountries();
    }
  }

  ngAfterViewInit(): void {
    const el = this.sentinel().nativeElement;

    this.observer = new IntersectionObserver(entries => {
      const entry = entries[0];

      if (entry.isIntersecting && this.hasMore()) {
        this.page.update(p => p + 1);

        // Wait for Angular to render new items before reconnecting the observer
        setTimeout(() => {
          this.observer?.disconnect();
          this.observer?.observe(this.sentinel().nativeElement);
        });
      }
    }, {
      rootMargin: '300px'
    });

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.observer?.disconnect();
  }

  loadCountries(): void {
    this.loading.set(true);
    this.error.set(null);

    this.countriesService
      .getAllCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.allCountries.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load countries. Please try again.');
          this.loading.set(false);
        }
      });
  }

  // Reset page on every filter change to avoid showing stale paginated results
  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
  }

  onRegionChange(region: Region | ''): void {
    this.region.set(region);
    this.page.set(1);
  }

  onSortChange(sort: SortOption): void {
    this.sort.set(sort);
    this.page.set(1);
  }

}