import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

import { Country } from '../models/country.model';
import { Region } from '../../features/countries/types/region.type';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://restcountries.com/v3.1';

  private countries$?: Observable<Country[]>;

  getAllCountries(): Observable<Country[]> {
    return (this.countries$ ??= this.http
      .get<Country[]>(`${this.apiUrl}/all?fields=name,flags,population,region,capital,cca3,area`)
      .pipe(shareReplay({ bufferSize: 1, refCount: true })));
  }

  searchCountries(search: string): Observable<Country[]> {
    return this.getAllCountries().pipe(
      map(countries =>
        countries.filter(country =>
          country.name.common
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      )
    );
  }

  filterByRegion(region: Region): Observable<Country[]> {
    return this.getAllCountries().pipe(
      map(countries =>
        countries.filter(country => country.region === region)
      )
    );
  }

  getCountriesByCodes(codes: string[]): Observable<Country[]> {
    return this.http.get<Country[]>(
      `${this.apiUrl}/alpha?codes=${codes.join(',')}`
    );
  }

}