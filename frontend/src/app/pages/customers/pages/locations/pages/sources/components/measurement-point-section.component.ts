import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputIndexedComponent } from "../../../../../../../components/input-indexed/input-indexed.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { InputComponent } from "../../../../../../../components/input/input.component";
import { MatSelectModule } from "@angular/material/select";
import { unitMeasure, unitMeasureLabel } from "../../../../../../../models/Measurement";

@Component({
  selector: 'app-measurement-point-section',
  standalone: true,
  template: `
    <div class="flex flex-col rounded bg-grey-1 p-2 gap-2" [ngClass]="{ 'ghost': ghost }">

      <app-input-indexed class="w-full" [index]="''+index" [indexBold]="true">
        <app-input class="w-full text-black" [formControl]="this.f.name" id="measurement-point-name" label="nome" type="text"
                   [placeholder]="ghost ? 'Nuova misurazione' : ''"/>
      </app-input-indexed>
      <app-input-indexed [index]="'A'">
        <div class="flex flex-col w-full" [ngClass]="{ 'text-black': this.f.unitMeasurement1.touched }">
          <label class="text-md justify-left block px-3 py-0 font-medium">u.m.</label>
          <mat-select class="focus:outline-none p-3 border-input rounded-md w-full bg-foreground"
                      [formControl]="f.unitMeasurement1">
            <mat-option class="p-3 bg-white" *ngFor="let unitMeasure of unitMeasures" [value]="unitMeasure">{{ unitMeasureLabel[unitMeasure] }}</mat-option>
          </mat-select>
        </div>
      </app-input-indexed>
      <app-input-indexed [index]="'B'">
        <div class="flex flex-col w-full" [ngClass]="{ 'text-black': this.f.unitMeasurement2.touched }">
          <label class="text-md justify-left block px-3 py-0 font-medium">u.m.</label>
          <mat-select class="focus:outline-none p-3 border-input rounded-md w-full bg-foreground"
                      [formControl]="f.unitMeasurement2">
            <mat-option class="p-3 bg-white" *ngFor="let unitMeasure of unitMeasures" [value]="unitMeasure">{{ unitMeasureLabel[unitMeasure] }}</mat-option>
          </mat-select>
        </div>
      </app-input-indexed>

      <div class="flex w-full justify-end" *ngIf="!ghost">
        <div class="flex cursor-pointer error default-shadow-hover rounded py-2 px-3 gap-2">
          <mat-icon class="icon-size material-symbols-rounded">delete</mat-icon>
          <div>Rimuovi</div>
        </div>
      </div>
    </div>
  `,
  imports: [ CommonModule, InputIndexedComponent, MatIconModule, InputComponent, MatSelectModule, ReactiveFormsModule ],
  styles: [`
    .ghost {
      background-color: #EBEBEB;
      color: #9D9D9D;
      border: 2px dashed #B2B2B2;
      border-radius: 8px;
      box-sizing: border-box;
    }
  `]
})
export class MeasurementPointSectionComponent implements OnInit {
  @Input({ required: true }) index!: number;
  @Input({ required: false }) ghost: boolean = false;

  @Output() onDelete = new EventEmitter();

  fb = inject(FormBuilder);

  measurementPointForm = this.fb.group({
    name: ["", [Validators.required]],
    unitMeasurement1: [unitMeasure.microGrayExp, [Validators.required]],
    unitMeasurement2: [unitMeasure.miniSievertAnnual, [Validators.required]],
  })

  get f() { return this.measurementPointForm.controls; }

  get unitMeasures() {
    return Object.values(unitMeasure);
  }

  ngOnInit() {

  }

  protected readonly unitMeasureLabel = unitMeasureLabel;
}