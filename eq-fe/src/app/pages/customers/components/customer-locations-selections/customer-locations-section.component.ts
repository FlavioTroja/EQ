import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { Subject } from "rxjs";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { LocationCardComponent } from "./location-card/location-card.component";
import { Location } from "../../../../models/Location";
import { LocationOnCustomerSection } from "../../../../models/Customer";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { getRouterUrl, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";

@Component({
  selector: 'app-customer-locations-section',
  standalone: true,
  imports: [ CommonModule, MatIconModule, LocationCardComponent, ReactiveFormsModule ],
  template: `

    <div class="flex flex-col gap-2">
      <div class="flex text-xl font-bold w-full justify-between">
        Sedi
        <div *ngIf="!viewOnly">
          <button class="focus:outline-none rounded-full w-full border-input bg-foreground flex items-center"
                  (click)="addNewLocation()">
            <mat-icon class="align-to-center icon-size material-symbols-rounded scale-75">add</mat-icon>
          </button>
        </div>
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
  store: Store<AppState> = inject(Store);
  path = toSignal(this.store.select(getRouterUrl));

  subject = new Subject();

  isLocationFormOpen: boolean = false;

  toggleIsLocationFormOpen() {
    this.isLocationFormOpen = true;
  }

  onLocationSaveChanges(event: Location) {

  }

  addNewLocation(){
    this.store.dispatch(RouterActions.go({ path: [ `${ this.path() }/locations/new` ] }));
  }

  onLocationDelete(index: number) {

  }
}