import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { Subject } from "rxjs";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { LocationCardComponent } from "./location-card/location-card.component";
import { Location } from "../../../../models/Location";
import { LocationOnCustomerSection } from "../../../../models/Customer";

@Component({
  selector: 'app-customer-locations-section',
  standalone: true,
  imports: [ CommonModule, MatIconModule, LocationCardComponent, ReactiveFormsModule ],
  template: `

    <div class="flex flex-col gap-2">
      <div class="flex text-xl font-bold">
        Sedi
      </div>
      <div>
        <div class="flex flex-col w-full gap-2.5">
          <app-location-card
            *ngFor="let location of locations; index as i"
            [viewOnly]="viewOnly"
            [location]="location"
            (onSave)="onLocationSaveChanges($event)"
            (onDelete)="onLocationDelete(i)"
          />

          <div *ngIf="!viewOnly && !isLocationFormOpen " class="w-full flex justify-center">
            <div class="bg-foreground flex gap-2 py-2 px-2.5 rounded-md shadow-md cursor-pointer select-none">
              <mat-icon class="material-symbols-rounded">add</mat-icon>
              <span (click)="toggleIsLocationFormOpen()">Aggiungi Sede</span>
            </div>
          </div>

          <app-location-card
            *ngIf="isLocationFormOpen"
            [viewOnly]="viewOnly"
            [location]="{}"
            (onSave)="onLocationSaveChanges($event)" />
        </div>
      </div>
    </div>
  `,
  styles: [`
  `]
})
export class CustomerLocationsSectionComponent {
  @Input({ required: true }) viewOnly = false;
  @Input({ required: true }) locations: LocationOnCustomerSection[] = [];

  fb = inject(FormBuilder);

  subject = new Subject();

  isLocationFormOpen: boolean = false;

  toggleIsLocationFormOpen() {
    this.isLocationFormOpen = true;
  }

  onLocationSaveChanges(event: Location) {

  }

  onLocationDelete(index: number) {

  }
}