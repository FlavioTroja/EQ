import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { Subject } from "rxjs";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { toSignal } from "@angular/core/rxjs-interop";
import { SectionHeaderComponent } from "../../../../../../components/section-header/section-header.component";
import { getRouterUrl } from "../../../../../../core/router/store/router.selectors";
import { AppState } from "../../../../../../app.config";
import { MatBottomSheet, MatBottomSheetModule } from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-location-departments-section',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ReactiveFormsModule, SectionHeaderComponent, MatBottomSheetModule ],
  template: `

    <div class="flex flex-col gap-2">
      <app-section-header title="Reparti" [viewOnly]="false" (btnAdd)="addNewDepartment()" />
      <div>
        <div class="flex flex-col w-full gap-2.5">
          test
        </div>
      </div>
    </div>
  `,
  styles: [`
  `]
})
export class LocationDepartmentsSectionComponent {
  @Input({ required: false }) viewOnly = false;

  fb = inject(FormBuilder);
  store: Store<AppState> = inject(Store);
  bottomSheet = inject(MatBottomSheet);

  path = toSignal(this.store.select(getRouterUrl));

  subject = new Subject();

  isLocationFormOpen: boolean = false;

  toggleIsLocationFormOpen() {
    this.isLocationFormOpen = true;
  }

  onLocationSaveChanges(event: Location) {

  }


  addNewDepartment() {

  }

  onLocationDelete(index: number) {

  }
}