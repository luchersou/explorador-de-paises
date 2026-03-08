import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import { Country } from '@core/models/country.model';
import { getRegionBadgeClass } from '@countries/utils/region-badge';

@Component({
  selector: 'app-country-card',
  standalone: true,
  imports: [RouterModule, DecimalPipe],
  templateUrl: './country-card.component.html'
})
export class CountryCardComponent {

  readonly country = input.required<Country>();

  protected readonly getRegionBadgeClass = getRegionBadgeClass;

}