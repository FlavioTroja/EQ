import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { toggleBooleanFormValue } from "../../../../../../../../utils/utils";
import { InputComponent } from "../../../../../../../components/input/input.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../../../../app.config";
import { Subject } from "rxjs";
import { InputBooleanComponent } from "../../../../../../../components/input-boolean/input-boolean.component";
import { InputIndexedComponent } from "../../../../../../../components/input-indexed/input-indexed.component";
import { MeasurementPointSectionComponent } from "./measurement-point-section.component";

@Component({
  selector: "app-conditions-card",
  standalone: true,
  animations: [
    trigger('rotateArrow', [
      state('close', style({ transform: 'rotate(180deg)' })),
      state('open', style({ transform: 'rotate(0deg)' })),
      transition('close <=> open', [animate('300ms ease-in-out')]),
    ]),
    trigger('translateDown', [
      state('up', style({opacity: '1'})),
      state('down', style({opacity: '0'})),
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
    <div class="flex flex-col bg-foreground rounded p-2 gap-2">
      <div class="flex justify-between w-full cursor-pointer" (click)="toggleConditionCardCollapsed()">
        <div>{{"title"}}</div>
        <mat-icon class="material-symbols-rounded" [@rotateArrow]="isConditionCardCollapsed ? 'close' : 'open'">
          keyboard_arrow_down
        </mat-icon>
      </div>
      <div *ngIf="isConditionCardCollapsed" [@translateDown]="isConditionCardCollapsed ? 'up' : 'down'">
        <form [formGroup]="conditionForm" class="flex flex-col gap-2">
          <div class="flex flex-col gap-2 md:flex-row">
            <div class="flex md:w-1/2">
              <app-input [formControl]="f.name" formControlName="name" label="Nome condizione" id="contidion-name"
                         type="text" class="w-full"/>
            </div>
            <div class="flex md:w-1/2">
              <app-input-boolean [formControl]="this.f.showMeasurementConditions" message="Mostra &quot;Condizioni di Misura&quot;" class="w-full self-end" />
            </div>
          </div>
          <div class="flex flex-col gap-2 md:flex-row">
            <div class="flex md:w-1/5">
              <app-input-boolean [formControl]="this.f.showSpd" message="Mostra" label="SPD" class="w-full self-end" />
            </div>
            <div class="flex md:w-1/5">
              <app-input-boolean [formControl]="this.f.showKv" message="Mostra" label="kV" class="w-full self-end" />
            </div>
            <div class="flex md:w-1/5">
              <app-input-boolean [formControl]="this.f.showMa" message="Mostra" label="mA" class="w-full self-end" />
            </div>
            <div class="flex md:w-1/5">
              <app-input-boolean [formControl]="this.f.showS" message="Mostra" label="S" class="w-full self-end" />
            </div>
            <div class="flex md:w-1/5">
              <app-input-boolean [formControl]="this.f.showMas" message="Mostra" label="mAs" class="w-full self-end" />
            </div>
          </div>
          <app-measurement-point-section/>
          <app-measurement-point-section/>
          <app-measurement-point-section/>
        </form>
      </div>
    </div>
  `,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, InputComponent, InputBooleanComponent, InputIndexedComponent, MeasurementPointSectionComponent ],
  styles: [``]
})
export class ConditionsCardComponent {
  store: Store<AppState> = inject(Store);
  fb = inject(FormBuilder);

  subject = new Subject();

  isConditionCardCollapsed: boolean = false;

  conditionForm = this.fb.group({
    name: ["", Validators.required],
    showMeasurementConditions: [false],
    showSpd: [false],
    showKv: [false],
    showMa: [false],
    showS: [false],
    showMas: [false],
    conditions: [[{}]],
  });

  get f() {
    return this.conditionForm.controls;
  }

  toggleConditionCardCollapsed() {
    this.isConditionCardCollapsed = !this.isConditionCardCollapsed;
  }

  protected readonly toggleBooleanFormValue = toggleBooleanFormValue;
}