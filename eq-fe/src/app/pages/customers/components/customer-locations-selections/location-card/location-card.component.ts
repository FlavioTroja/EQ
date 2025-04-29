import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { pairwise, Subject } from "rxjs";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { AppState } from "../../../../../app.config";
import { difference } from "../../../../../../utils/utils";
import { CustomValidators } from "../../../../../services/custom-validators";
import { InputComponent } from "../../../../../components/input/input.component";
import { Location, PartialLocation } from "../../../../../models/Location";
import { DepartmentCardComponent } from "../department-card/department-card.component";
import { Department } from "../../../../../models/Department";
import { LocationOnCustomerSection } from "../../../../../models/Customer";

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ReactiveFormsModule, MatOptionModule, MatSelectModule, InputComponent, DepartmentCardComponent ],
  template: `
    <div class="flex flex-col p-2.5 gap-2.5 bg-foreground rounded shadow-md w-full">
      <!--header if location exists-->
      <div *ngIf="!!location" class="flex w-full">
        <div class="flex w-full flex-col">
          <span>{{ (viewOnly || !isLocationCardOpen) ? location.name : "Modifica Sede" }}</span>
        </div>
        <div class="flex w-full justify-end">
          <mat-icon class="material-symbols-rounded arrow rounded-full cursor-pointer"
                    (click)="toggleIsLocationCardOpen()">
            {{ isLocationCardOpen ? "keyboard_arrow_up" : "keyboard_arrow_down" }}
          </mat-icon>
        </div>
      </div>

      <!--edit-->
      <form *ngIf="!viewOnly && (!location || isLocationCardOpen)" class="flex flex-col bg-light-grey rounded gap-2"
            [ngClass]="{ 'disabled': viewOnly }"
            [formGroup]="locationForm">
        <div class="flex flex-row p-2 gap-2">
          <div class="flex w-1/2">
            <app-input [formControl]="f.name" label="Nome della sede" id="location-name" type="string" class="w-full"/>
          </div>
          <div class="flex w-1/2">
            <app-input [formControl]="f.address" label="Indirizzo della sede" id="location-address" type="string"
                       class="w-full"/>
          </div>
        </div>

        <div class="flex flex-col bg-light-grey rounded p-2 gap-2">
          <div class="flex flex-col w-full gap-2.5">
            <app-department-card
              *ngFor="let department of departments, index as i"
              [department]="department"
              [viewOnly]="false"
              (onSave)="onDepartmentSaveChanges($event)"
              (onDelete)="onDepartmentDelete(i)"
            />
  
            <div *ngIf="!isLocationFormOpen" class="w-full flex justify-center">
              <div class="bg-foreground flex gap-2 py-2 px-2.5 rounded-md shadow-md cursor-pointer select-none">
                <mat-icon class="material-symbols-rounded">add</mat-icon>
                <span (click)="toggleIsLocationFormOpen()">Aggiungi Reparto</span>
              </div>
            </div>
          </div>
        </div>


        <!--btns-->
        <div *ngIf="!viewOnly" class="flex justify-end gap-4 p-2">
          <div class="flex gap-2">
            <button class="light-red red p-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
                    [ngClass]="{'disabled' : !!location && !hasChanges}"
                    (click)="initLocationForm(this.location)">
              <mat-icon class="material-symbols-rounded">close</mat-icon>

              Annulla
            </button>

            <button class="light-blu blue p-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
                    [ngClass]="{'disabled' : locationForm.invalid || (!!location && !hasChanges)}"
                    (click)="handleSave()">
              <mat-icon class="material-symbols-rounded">check</mat-icon>

              Salva
            </button>
          </div>

          <button *ngIf="!!location"
                  class="light-red red p-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
                  (click)="handleDeleteLocationButton()">
            <mat-icon class="material-symbols-rounded">delete</mat-icon>

            Elimina
          </button>
        </div>
      </form>
      <!--view-->
      <div class="flex flex-col" *ngIf="viewOnly && isLocationCardOpen">
        <div>{{ location.address }}</div>
        <div *ngIf="!!departments.length" class="flex flex-col bg-light-grey rounded p-2 gap-2">
          <div *ngFor="let department of departments"
               class="flex flex-row bg-foreground rounded p-2 justify-between">
            <div class="flex flex-row items-center p-2">{{ department.name }}</div>
            <div *ngIf="!!department.sources.length" class="flex flex-col bg-light-grey rounded p-2 gap-2">
              <div *ngFor="let source of department.sources" class="flex flex-row bg-foreground p-1">
                {{ source.machine.name }} Sn.: {{ source.sn }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class LocationCardComponent implements OnInit {
  @Input({ required: true }) location!: Partial<LocationOnCustomerSection>;
  @Input({ required: true }) viewOnly = false;

  @Output() onSave = new EventEmitter<Location>();
  @Output() onDelete = new EventEmitter<void>();

  fb = inject(FormBuilder);
  store: Store<AppState> = inject(Store);
  subject = new Subject();
  hasChanges = false;

  isLocationCardOpen: boolean = false;
  isLocationFormOpen: boolean = false;

  locationForm = this.fb.group({
    id: [""],
    name:["", Validators.required ],
    address: ["", Validators.required ],
    departments: [[{}], [CustomValidators.notEmpty] ],
  });

  initFormValue: PartialLocation = {};

  get f() {
    return this.locationForm.controls;
  }

  get departments() {
    return this.f.departments.value?.filter(o => Object.keys(o).length > 0) as Department[];
  }

  ngOnInit() {
    this.initLocationForm(this.location);

    if (!!this.location) {
      this.locationFormChanges();
    }
  }

  locationFormChanges() {
    this.locationForm.valueChanges.pipe(
      pairwise(),
      map(([_, newState]) => {

        return {
          ...difference(this.initFormValue, newState),

          // Array data
          departments: newState.departments
        };
      }),
      map((changes: any) => Object.keys(changes).length !== 0 && !this.locationForm.invalid ? changes : {}),
    ).subscribe(changes => {
      this.hasChanges = !!Object.keys(changes).length
    });
  }

  initLocationForm(location: Partial<LocationOnCustomerSection>) {
    this.locationForm.patchValue({
      id: location?.id ?? "",
      name: location?.name ?? "",
      address: location?.address ?? "",
      departments: location?.departments ?? []
    });

    this.initFormValue = this.locationForm.value as PartialLocation;
  }

  toggleIsLocationCardOpen() {
    this.isLocationCardOpen = !this.isLocationCardOpen;
  }

  toggleIsLocationFormOpen() {

  }

  onDepartmentSaveChanges(event: Department) {

  }

  onDepartmentDelete(index: number) {

  }

  handleSave() {
  //   const mappedLocation: LocationForm = {
  //     id: this.locationForm.controls.id.value ?? -1,
  //     description: this.locationForm.controls.description.value ?? '',
  //     taskSteps: this.mapLocationStepTypesToLocationSteps(this.locationForm.controls.taskSteps.value as LocationStepType[]) as LocationStep[]
  //   };

  //   this.onSave.emit(mappedLocation);
  }

  handleDeleteLocationButton() {
  //   this.onDelete.emit();
  }
}