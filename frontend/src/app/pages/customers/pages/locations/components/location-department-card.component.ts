import { Component, inject, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatIconModule } from "@angular/material/icon";
import { createDepartmentPayload, PartialDepartment } from "../../../../../models/Department";
import { CommonModule } from "@angular/common";
import { InputComponent } from "../../../../../components/input/input.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DepartmentSourceCardComponent } from "./department-source-card.component";
import {
  BottomSheetComponent,
  BottomSheetDialogData
} from "../../../../../components/bottom-sheet/bottom-sheet.component";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { EditSourceComponent } from "../pages/sources/pages/edit/edit-source.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { selectCustomRouteParam } from "../../../../../core/router/store/router.selectors";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../../app.config";
import { difference } from "../../../../../../utils/utils";
import { Source } from "../../../../../models/Source";
import * as DepartmentsActions from "../store/actions/departments.actions";
import ViewSourceComponent from "../pages/sources/pages/view/view-source.component";
import * as SourceActions from "../pages/sources/store/actions/sources.actions";
import { getActiveSourceChanges } from "../pages/sources/store/selectors/sources.selectors";
import { filter, switchMap } from "rxjs";

@Component({
  selector: 'app-location-department-card',
  standalone: true,
  animations: [
    trigger('rotateArrow', [
      state('close', style({ transform: 'rotate(180deg)' })),
      state('open', style({ transform: 'rotate(0deg)' })),
      transition('close <=> open', [ animate('300ms ease-in-out') ]),
    ]),
    trigger('translateDown', [
      state('up', style({ opacity: '1' })),
      state('down', style({ opacity: '0' })),
      transition('up => down', [
        animate('100ms', style({
          transform: 'translateY(70%)',
          opacity: '0.5'
        })),
      ]),
      transition('down => up', [
        animate('150ms', style({
          opacity: '0.5'
        })),
      ])
    ]),
  ],
  template: `
    <div class="flex flex-col bg-foreground">
      <div class="flex w-full cursor-pointer justify-between gap-2 p-2 rounded items-center"
           (click)="toggleCardCollapsed()">
        <div class="flex gap-8 items-center text-lg h-[34px]">
          {{ this.isNewDepartment ? 'Nuovo reparto' : this.f.name.getRawValue() }}
          <div class="flex rounded-full text-sm self-center bg-light-grey border p-1 pr-2 gap-1"
               *ngIf="!isNewDepartment && (!isDepartmentCardOpen || viewOnly)" style="line-height: 14px !important">
            <mat-icon class="material-symbols-rounded">precision_manufacturing</mat-icon>
            <div class="flex font-bold self-center gap-2">
              {{ department.sources?.length || 0 }}
              <div class="font-normal">macchine</div>
            </div>
          </div>
        </div>
        <mat-icon class="material-symbols-rounded" [@rotateArrow]="isDepartmentCardOpen ? 'close' : 'open'">
          keyboard_arrow_down
        </mat-icon>
      </div>
      <form class="flex flex-col w-full gap-2 p-2" *ngIf="isDepartmentCardOpen"
            [@translateDown]="isDepartmentCardOpen ? 'up' : 'down'"
            [formGroup]="departmentForm">
        <div class="flex w-full" *ngIf="!viewOnly">
          <app-input [formControl]="f.name" formControlName="name" label="nome reparto" id="department-name" type="text"
                     class="w-full"/>
        </div>
        <div class="flex flex-col w-full gap-2" [ngClass]="{ 'p-2 bg-grey-1': !viewOnly }">
          <app-department-source-card class="w-full" *ngFor="let source of sources" [source]="source" (btnEdit)="editSource(source)" (btnView)="viewSource(source)"/>
          <div class="flex w-full justify-center" *ngIf="!viewOnly">
            <button class="focus:outline-none rounded-full border-input bg-foreground flex items-center"
                    (click)="addSource()">
              <mat-icon class="align-to-center icon-size material-symbols-rounded scale-75">add</mat-icon>
            </button>
          </div>
        </div>
        <div class="flex justify-end gap-2 w-full" *ngIf="!viewOnly">
          <div class="flex cursor-pointer error d efault-shadow-hover rounded py-2 px-3 gap-2"
               [ngClass]="{'opacity-60  pointer-events-none': isNewDepartment}">
            <mat-icon class="icon-size material-symbols-rounded">delete</mat-icon>
            <div>Rimuovi condizione</div>
          </div>
          <div class="flex cursor-pointer accent default-shadow-hover rounded py-2 px-3 gap-2"
               [ngClass]="{'opacity-60  pointer-events-none': this.departmentForm.invalid}"
               (click)="saveDepartment()">
            <mat-icon class="icon-size material-symbols-rounded">check</mat-icon>
            <div class="font-bold">Salva</div>
          </div>
        </div>
      </form>
    </div>


    <ng-template #editSourceBottomSheet>
      <app-edit-source/>
    </ng-template>

    <ng-template #viewSourceBottomSheet>
      <app-view-source/>
    </ng-template>
  `,
  imports: [
    MatIconModule,
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    DepartmentSourceCardComponent,
    EditSourceComponent,
    ViewSourceComponent
  ],
  styles: [ `` ]
})
export class LocationDepartmentCardComponent implements OnChanges {
  @Input({ required: true }) department: PartialDepartment = {};
  @Input({ required: false }) viewOnly: boolean = false;
  @Input({ required: false }) isDepartmentCardOpen?: boolean = false;

  @ViewChild("editSourceBottomSheet") editSourceBottomSheet?: TemplateRef<any>;
  @ViewChild("viewSourceBottomSheet") viewSourceBottomSheet?: TemplateRef<any>;

  fb = inject(FormBuilder);
  store: Store<AppState> = inject(Store);
  bottomSheet = inject(MatBottomSheet);

  locationId = toSignal(this.store.select(selectCustomRouteParam("locationId")));

  departmentForm = this.fb.group({
    id: [''],
    name: ["", Validators.required],
    sources: [[] as Source[]]
  })

  isNewDepartment: boolean = false;

  get f() {
    return this.departmentForm.controls;
  }

  get sources(): Source[] {
    return this.f.sources.value || [];
  }

  toggleCardCollapsed() {
    this.isDepartmentCardOpen = !this.isDepartmentCardOpen;
  }

  viewSource(source: Source) {
    this.store.dispatch(SourceActions.loadActiveSource({ source }));
    const dialogRef: any = this.bottomSheet.open(BottomSheetComponent, {
      backdropClass: "blur-filter",
      panelClass: "backdropPanelClassForBottomSheet",
      data: <BottomSheetDialogData> {
        title: "",
        content: "",
        templateContent: this.viewSourceBottomSheet,
        buttons: [
          { iconName: "edit_square", label: "Modifica", bgColor: "warning",  onClick: () => dialogRef.dismiss(true) },
          { iconName: "clear", label: "Chiudi",  onClick: () => dialogRef.dismiss(false) }
        ]
      }
    });
  }

  editSource(source: Source) {
    this.store.dispatch(SourceActions.loadActiveSource({ source }));
    this.openEditSourceModal();
  }

  addSource() {
    this.store.dispatch(SourceActions.clearSourceActive());
    this.openEditSourceModal();
  }

  openEditSourceModal() {
    const dialogRef: any = this.bottomSheet.open(BottomSheetComponent, {
      backdropClass: "blur-filter",
      panelClass: "backdropPanelClassForBottomSheet",
      data: <BottomSheetDialogData> {
        title: "",
        content: "",
        templateContent: this.editSourceBottomSheet,
        buttons: [
          { iconName: "check", label: "Conferma", bgColor: "confirm",  onClick: () => dialogRef.dismiss(true) },
          { iconName: "clear", label: "Annulla",  onClick: () => dialogRef.dismiss(false) }
        ]
      }
    });

    dialogRef.afterDismissed().pipe(
      filter(result => !!result),
      switchMap(() => this.store.select(getActiveSourceChanges)))
      // .subscribe((changes: any) => { console.log(changes); }; < here is the listen bug
  }

  saveDepartment() {
    const department: PartialDepartment = createDepartmentPayload({
      ...difference(this.department, this.departmentForm.value),
      id: this.f.id.value,
      sources: this.sources
    });
    if (this.isNewDepartment) {
      this.store.dispatch(DepartmentsActions.addDepartment({ locationId: this.locationId(), department }));
      return;
    } else {
      this.store.dispatch(DepartmentsActions.editDepartment({ locationId: this.locationId(), department }));
      return;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!!changes['department']) {
      const department = changes['department'].currentValue;
      if (!Object.keys(department).length) {
        this.isNewDepartment = true;
        return;
      }
      this.departmentForm.patchValue(department);
    }
  }
}