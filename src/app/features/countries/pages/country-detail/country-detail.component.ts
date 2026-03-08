import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, switchMap, of, takeUntil } from 'rxjs';

import { CountriesService } from '@core/services/countries.service';
import { Country } from '@core/models/country.model';

import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { getRegionBadgeClass } from '@countries/utils/region-badge';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [
    RouterModule,
    DecimalPipe,
    LoadingComponent,
    ErrorMessageComponent
  ],
  templateUrl: './country-detail.component.html'
})
export class CountryDetailComponent implements OnInit, OnDestroy {

  // Dependencies
  private readonly route = inject(ActivatedRoute);
  private readonly countriesService = inject(CountriesService);
  private readonly destroy$ = new Subject<void>();

  // State
  readonly country = signal<Country | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly borderCountries = signal<Country[]>([]);

  // Pure function exposed to template to avoid duplicate logic with CountryCardComponent
  protected readonly getRegionBadgeClass = getRegionBadgeClass;
  

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const code = params.get('code');

        if (!code) {
          this.error.set('Invalid country');
          this.loading.set(false);
          return of([]);
        }

        // Reset state on every navigation to avoid stale data when switching countries
        this.loading.set(true);
        this.error.set(null);
        this.country.set(null);
        this.borderCountries.set([]);

        return this.countriesService.getCountriesByCodes([code]);
      }),
      switchMap(res => {
        if (!res.length) return of({ country: null, borders: [] as Country[] });

        const country = res[0];
        const borders = country?.borders;

        // Countries with no land borders (e.g. island nations) skip the second request
        if (!borders || borders.length === 0) {
          return of({ country, borders: [] as Country[] });
        }

        return this.countriesService.getCountriesByCodes(borders).pipe(
          switchMap(borderCountries => of({ country, borders: borderCountries }))
        );
      }),
      // Unsubscribe when component is destroyed to prevent memory leaks
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ country, borders }) => {
        // Both country and borders are set together to avoid partial renders
        if (country) this.country.set(country);
        this.borderCountries.set(borders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load country. Please try again.');
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getLanguages(): string {
    const langs = this.country()?.languages;
    if (!langs) return '—';
    return Object.values(langs).join(', ');
  }

  getCurrencies(): string {
    const currencies = this.country()?.currencies;
    if (!currencies) return '—';
    return Object.values(currencies)
      .map(c => `${c.name} (${c.symbol})`)
      .join(', ');
  }

}