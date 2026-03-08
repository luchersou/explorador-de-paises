import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  templateUrl: './error-message.component.html'
})
export class ErrorMessageComponent {

  @Input() message: string =
    'Something went wrong while loading data.';

}