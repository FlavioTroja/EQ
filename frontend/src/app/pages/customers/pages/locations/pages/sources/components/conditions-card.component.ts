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
              <div class="w-full self-end">
                <div
                  class="flex flex-row border-input justify-start bg-foreground rounded-md select-none cursor-pointer w-full h-12 gap-2 p-3"
                  (click)="toggleBooleanFormValue(this.f.showMeasurementConditions)">
                  <div class="self-center">
                    <input type="checkbox" formControlName="showMeasurementConditions">
                  </div>
                  <div class="font-bold self-center text-lg">
                    Mostra "Condizioni Misura"
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 md:flex-row">
            <div class="flex md:w-1/5">
              <div class="w-full self-end">
                <label class="text-sm pl-2">SPD</label>
                <div
                  class="flex flex-row border-input justify-start bg-foreground rounded-md select-none cursor-pointer w-full h-12 gap-2 p-3"
                  (click)="toggleBooleanFormValue(this.f.showSpd)">
                  <div class="self-center">
                    <input type="checkbox" formControlName="showSpd">
                  </div>
                  <div class="font-bold self-center text-lg">
                    Mostra
                  </div>
                </div>
              </div>
            </div>
            <div class="flex md:w-1/5">
              <div class="w-full self-end">
                <label class="text-sm pl-2">kV</label>
                <div
                  class="flex flex-row border-input justify-start bg-foreground rounded-md select-none cursor-pointer w-full h-12 gap-2 p-3"
                  (click)="toggleBooleanFormValue(this.f.showKv)">
                  <div class="self-center">
                    <input type="checkbox" formControlName="showKv">
                  </div>
                  <div class="font-bold self-center text-lg">
                    Mostra
                  </div>
                </div>
              </div>
            </div>
            <div class="flex md:w-1/5">
              <div class="w-full self-end">
                <label class="text-sm pl-2">mA</label>
                <div
                  class="flex flex-row border-input justify-start bg-foreground rounded-md select-none cursor-pointer w-full h-12 gap-2 p-3"
                  (click)="toggleBooleanFormValue(this.f.showMa)">
                  <div class="self-center">
                    <input type="checkbox" formControlName="showMa">
                  </div>
                  <div class="font-bold self-center text-lg">
                    Mostra
                  </div>
                </div>
              </div>
            </div>
            <div class="flex md:w-1/5">
              <div class="w-full self-end">
                <label class="text-sm pl-2">S</label>
                <div
                  class="flex flex-row border-input justify-start bg-foreground rounded-md select-none cursor-pointer w-full h-12 gap-2 p-3"
                  (click)="toggleBooleanFormValue(this.f.showS)">
                  <div class="self-center">
                    <input type="checkbox" formControlName="showS">
                  </div>
                  <div class="font-bold self-center text-lg">
                    Mostra
                  </div>
                </div>
              </div>
            </div>
            <div class="flex md:w-1/5">
<!--              <app-input-boolean [toggleBooleanFormValue]="toggleBooleanFormValue"-->
<!--                                 [this.f]="this.f"></app-input-boolean>-->
            </div>
          </div>
          <div class="flex flex-col rounded bg-grey-1 p-2 gap-2">
            <div class="flex flex-row justify-start w-full gap-2">
              <div class="flex justify-center self-center font-bold square" style="font-size: 32px; line-height: 32px;">1</div>
              <div class="flex border border-black"></div>
              <div class="flex w-full">
                <app-input [formControl]="f.name" formControlName="name" label="Nome condizione" id="contidion-name" type="text" class="w-full"/>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, InputComponent ],
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