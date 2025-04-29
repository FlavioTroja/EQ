import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../../components/input/input.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { Department, PartialDepartment } from "../../../../../models/Department";
import { CustomValidators } from "../../../../../services/custom-validators";
import { Machine } from "../../../../../models/Machine";
import { pairwise } from "rxjs";
import { map } from "rxjs/operators";
import { difference } from "../../../../../../utils/utils";
import { Source } from "../../../../../models/Source";

@Component({
  selector: 'app-department-card',
  standalone: true,
  template: `
    <div class="flex flex-col p-2.5 gap-2.5 bg-foreground rounded shadow-md w-full">
      <!--header if department exists-->
      <div *ngIf="!!department" class="flex w-full">
        <div class="flex w-full flex-col">
          <span>{{ (viewOnly || !isDepartmentCardOpen) ? department.name : "Modifica Reparto" }}</span>
        </div>
        <div class="flex w-full justify-end">
          <mat-icon class="material-symbols-rounded arrow rounded-full cursor-pointer"
                    (click)="toggleIsDepartmentCardOpen()">
            {{ isDepartmentCardOpen ? "keyboard_arrow_up" : "keyboard_arrow_down" }}
          </mat-icon>
        </div>
      </div>

      <!--edit-->
      <form *ngIf="!viewOnly && (!department || isDepartmentCardOpen)" class="flex flex-col bg-light-grey rounded gap-2"
            [ngClass]="{ 'disabled': viewOnly }"
            [formGroup]="departmentForm">
        <div class="flex flex-col p-2 gap-2">
          <div class="flex flex-row w-full">
            <app-input [formControl]="f.name" label="Nome del reparto" id="department-name" type="string" class="w-full"/>
          </div>
        </div>
        <div class="flex flex-col p-2 gap-2">
          <div *ngFor="let source of sources" class="flex flex-row justify-between bg-foreground p-1">
            <div>{{ source.machine.name }} Sn.: {{ source.sn }}</div>
            <div>{{ source.expirationDate | date:'dd/MM/yyyy' }}</div>
          </div>
        </div>

        <!--btns-->
        <div *ngIf="!viewOnly" class="flex justify-end gap-4 p-2">
          <div class="flex gap-2">
            <button class="light-red red p-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
                    [ngClass]="{'disabled' : !!department && !hasChanges}"
                    (click)="initDepartmentForm(this.department)">
              <mat-icon class="material-symbols-rounded">close</mat-icon>

              Annulla
            </button>

            <button class="light-blu blue p-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
                    [ngClass]="{'disabled' : departmentForm.invalid || (!!department && !hasChanges)}"
                    (click)="handleSave()">
              <mat-icon class="material-symbols-rounded">check</mat-icon>

              Salva
            </button>
          </div>

          <button *ngIf="!!department"
                  class="light-red red p-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
                  (click)="handleDeleteDepartmentButton()">
            <mat-icon class="material-symbols-rounded">delete</mat-icon>

            Elimina
          </button>
        </div>
      </form>
    </div>
  `,
  imports: [
    CommonModule,
    InputComponent,
    MatIconModule,
    ReactiveFormsModule
  ],
  styles: [``]
})
export class DepartmentCardComponent implements OnInit {
  @Input({ required: true }) department: Department = {} as Department;
  @Input({ required: true }) viewOnly = false;

  @Output() onSave = new EventEmitter<Department>();
  @Output() onDelete = new EventEmitter<void>();

  fb = inject(FormBuilder);

  isDepartmentCardOpen: boolean = false;
  hasChanges = false;

  initFormValue: PartialDepartment = {};

  departmentForm = this.fb.group({
    id: [ -1 ],
    name:[ "", Validators.required ],
    sources: [[{}], [CustomValidators.notEmpty] ],
  });

  get f() {
    return this.departmentForm.controls;
  }

  get sources() {
    return this.f.sources.value?.filter(o => Object.keys(o).length > 0) as Source[];
  }

  ngOnInit(): void {
    this.initDepartmentForm(this.department);

    if (!!this.department) {
      this.departmentFormChanges();
    }
  }

  initDepartmentForm(department?: Department) {
    this.departmentForm.patchValue({
      id: department?.id ?? -1,
      name: department?.name ?? "",
      sources: department?.sources ?? []
    });

    this.initFormValue = this.departmentForm.value as PartialDepartment;
  }

  toggleIsDepartmentCardOpen() {
    this.isDepartmentCardOpen = !this.isDepartmentCardOpen;
  }

  handleSave() {
  }

  handleDeleteDepartmentButton() {
  }

  departmentFormChanges() {
    this.departmentForm.valueChanges.pipe(
      pairwise(),
      map(([_, newState]) => {

        return {
          ...difference(this.initFormValue, newState),

          // Array data
          sources: newState.sources
        };
      }),
      map((changes: any) => Object.keys(changes).length !== 0 && !this.departmentForm.invalid ? changes : {}),
    ).subscribe(changes => {
      this.hasChanges = !!Object.keys(changes).length
    });
  }

}