import { Country } from '@core/models/country.model';
import { Region } from '@countries/types/region.type';

/**
 * Filters countries by name and/or region.
 * Both filters are applied simultaneously — an empty string or region returns all countries.
 */
export function filterCountries(
  countries: Country[],
  search: string,
  region: Region | ''
): Country[] {
  return countries.filter(country => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRegion = region === '' || country.region === region;

    return matchesSearch && matchesRegion;
  });
}