import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-customer-locations-section',
  standalone: true,
  template: `
    customer locations selection
  `,
  styles: [`
  `]
})
export class CustomerLocationsSectionComponent {
  @Input({ required: true }) viewOnly = false;
  @Input() locations: any[] = [];
}