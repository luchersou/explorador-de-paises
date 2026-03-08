import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/countries/pages/country-list/country-list.component')
        .then(c => c.CountryListComponent)
  },
  {
    path: 'country/:code',
    loadComponent: () =>
      import('./features/countries/pages/country-detail/country-detail.component')
        .then(c => c.CountryDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];