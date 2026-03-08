import { Country } from '../../../core/models/country.model';
import { SortOption } from '../types/sort-option.type';

/**
 * Returns a sorted copy of the countries array.
 * Does not mutate the original array.
 */
export function sortCountries(
  countries: Country[],
  sortBy: SortOption
): Country[] {

  if (!sortBy) return countries;

  return [...countries].sort((a, b) => {

    switch (sortBy) {

      case 'name':
        return a.name.common.localeCompare(b.name.common);

      case 'population':
        return b.population - a.population;

      case 'area':
        // Guard against undefined area (e.g. some territories may not report it)
        return (b.area ?? 0) - (a.area ?? 0);

      default:
        return 0;
    }
  });

}