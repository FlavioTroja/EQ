import { Component, inject, Input, TemplateRef, ViewChild } from "@angular/core";
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
import {
  BottomSheetComponent,
  BottomSheetDialogData
} from "../../../../../../components/bottom-sheet/bottom-sheet.component";
import { EditSourceComponent } from "../../pages/sources/edit/edit-source.component";

@Component({
  selector: 'app-location-departments-section',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ReactiveFormsModule, SectionHeaderComponent, MatBottomSheetModule, EditSourceComponent ],
  template: `

    <div class="flex flex-col gap-2">
      <app-section-header title="Reparti" [viewOnly]="false" (btnAdd)="addNewDepartment()" />
      <div>
        <div class="flex flex-col w-full gap-2.5">
          test
        </div>
      </div>
    </div>
    
    <ng-template #addDepartmentBottomSheet>
      <div class="w-screen-paddingless">
        <app-edit-source />
      </div>
    </ng-template>
    
  `,
  styles: [`
    .w-screen-paddingless{
      width: calc(100vw - 32px);
    }
  `]
})
export class LocationDepartmentsSectionComponent {
  @Input({ required: false }) viewOnly = false;

  @ViewChild("addDepartmentBottomSheet") addDepartmentBottomSheet?: TemplateRef<any>;

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
    const dialogRef: any = this.bottomSheet.open(BottomSheetComponent, {
      backdropClass: "blur-filter",
      panelClass: "backdropPanelClassForBottomSheet",
      data: <BottomSheetDialogData> {
        title: "",
        content: "",
        templateContent: this.addDepartmentBottomSheet,
        buttons: [
          { iconName: "check", label: "Conferma", bgColor: "confirm",  onClick: () => dialogRef.dismiss(true) },
          { iconName: "clear", label: "Annulla",  onClick: () => dialogRef.dismiss(false) }
        ]
      }
    });
  }

  onLocationDelete(index: number) {

  }
}