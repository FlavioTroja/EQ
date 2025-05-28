import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Measurement, unitMeasureLabel } from "../../../models/Measurement";

@Component({
  selector: "app-measurement-card",
  standalone: true,
  template: `
    <div class="grid rounded bg-foreground shadow gap-2.5 p-2.5 md:grid-cols-2">
      <div class="flex justify-between md:justify-start md:gap-2">
        <div class="flex gap-2">
          <div class="text-white text-center font-bold text-2xl content-center h-12 aspect-square custom-bg-black rounded-full">
            {{ index }}
          </div>
          <div class="text-lg content-center">
            {{ measurement.name }}
          </div>
        </div>
<!--        <div class="md:content-center">-->
<!--          <div class="flex p-1 bg-light-grey rounded-full">-->
<!--            <mat-icon class="material-symbols-rounded">info</mat-icon>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div class="flex flex-col gap-1 md:flex-row md:justify-end">
        <div class="relative md:w-44" *ngFor="let value of measurement.values">
          <input class="focus:outline-none p-3 rounded-md w-full border-input"
                 [ngClass]="{'viewOnly' : viewOnly}"
                 id="id1" [value]="value.value"
                 type="number"
                 [disabled]="viewOnly"/>
          <span class="absolute right-2 top-3 font-bold select-none">{{ unitMeasureLabel[value.unitMeasure] }}</span>
        </div>
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  styles: [``]
})
export class MeasurementCardComponent {
  @Input({ required: true }) index!: number;
  @Input({ required: true }) measurement!: Measurement;
  @Input() viewOnly: boolean = false;

  protected readonly unitMeasureLabel = unitMeasureLabel;
}