import { Component, inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatIconModule } from "@angular/material/icon";
import { PartialDepartment } from "../../../../../models/Department";
import { CommonModule } from "@angular/common";
import { InputComponent } from "../../../../../components/input/input.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DepartmentSourceCardComponent } from "./department-source-card.component";

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
          {{ this.f.name.getRawValue() }}
          <div class="flex rounded-full text-sm self-center bg-light-grey border p-1 pr-2 gap-1" *ngIf="!isCardCollapsed" style="line-height: 14px !important">
            <mat-icon class="material-symbols-rounded">precision_manufacturing</mat-icon>
            <div class="flex font-bold self-center gap-2">
              {{ department.sources?.length || 0 }}
              <div class="font-normal">macchine</div>
            </div>
          </div>
        </div>
        <mat-icon class="material-symbols-rounded" [@rotateArrow]="isCardCollapsed ? 'close' : 'open'">
          keyboard_arrow_down
        </mat-icon>
      </div>
      <form class="flex flex-col w-full gap-2 p-2" *ngIf="isCardCollapsed" [@translateDown]="isCardCollapsed ? 'up' : 'down'" [formGroup]="departmentForm">
        <div class="flex w-full">
          <app-input [formControl]="f.name" formControlName="name" label="nome reparto" id="department-name" type="text" class="w-full" />
        </div>
        <div class="flex w-full" [ngClass]="{ 'p-2 bg-grey-1': !viewOnly }">
          <app-department-source-card class="w-full" *ngFor="let source of department.sources" [source]="source"/>
        </div>
        <div class="flex justify-end w-full">
          <div class="flex cursor-pointer error default-shadow-hover rounded py-2 px-3 gap-2">
            <mat-icon class="icon-size material-symbols-rounded">delete</mat-icon>
            <div>Rimuovi condizione</div>
          </div>
        </div>
      </form>
    </div>
  `,
  imports: [
    MatIconModule,
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    DepartmentSourceCardComponent
  ],
  styles: [ `` ]
})
export class LocationDepartmentCardComponent implements OnChanges {
  @Input({ required: true }) department: PartialDepartment = {};
  @Input({ required: false }) viewOnly: boolean = false;

  fb = inject(FormBuilder);

  isCardCollapsed: boolean = false;

  departmentForm = this.fb.group({
    name: ["", Validators.required],
    sources: [[{}]]
  })

  get f() {
    return this.departmentForm.controls;
  }

  toggleCardCollapsed() {
    this.isCardCollapsed = !this.isCardCollapsed;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!!changes['department']) {
      this.departmentForm.patchValue(changes['department'].currentValue);
    }
  }
}