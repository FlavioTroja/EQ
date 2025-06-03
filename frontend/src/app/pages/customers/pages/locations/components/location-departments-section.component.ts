import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { Subject } from "rxjs";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { toSignal } from "@angular/core/rxjs-interop";
import { SectionHeaderComponent } from "../../../../../components/section-header/section-header.component";
import { getRouterUrl } from "../../../../../core/router/store/router.selectors";
import { AppState } from "../../../../../app.config";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { Department } from "../../../../../models/Department";
import { LocationDepartmentCardComponent } from "./location-department-card.component";

@Component({
  selector: 'app-location-departments-section',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ReactiveFormsModule, SectionHeaderComponent, MatBottomSheetModule, LocationDepartmentCardComponent ],
  template: `

    <div class="flex flex-col gap-2">
      <app-section-header title="Reparti" [viewOnly]="viewOnly" (btnAdd)="toggleIsLocationFormOpen()" />
      <div class="flex flex-col w-full gap-2.5">
        <app-location-department-card *ngIf="isLocationFormOpen" [department]="{}" [isDepartmentCardOpen]="isLocationFormOpen"/>
        <app-location-department-card *ngFor="let department of departments" [department]="department" [viewOnly]="viewOnly" 
                                      [isDepartmentCardOpen]="(!isLocationFormOpen) && isLocationFormOpen != null"/>
      </div>
    </div>
  `,
  styles: [`
  `]
})
export class LocationDepartmentsSectionComponent {
  @Input({ required: true }) departments: Department[] = [];
  @Input({ required: false }) viewOnly = false;

  fb = inject(FormBuilder);
  store: Store<AppState> = inject(Store);

  path = toSignal(this.store.select(getRouterUrl));

  subject = new Subject();

  isLocationFormOpen: boolean | null = null;

  toggleIsLocationFormOpen() {
    this.isLocationFormOpen = true;
  }

  onLocationSaveChanges(event: Location) {

  }

  onLocationDelete(index: number) {

  }

  addNewLocation() {

  }
}