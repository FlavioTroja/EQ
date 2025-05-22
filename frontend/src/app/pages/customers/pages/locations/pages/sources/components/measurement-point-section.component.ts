import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputIndexedComponent } from "../../../../../../../components/input-indexed/input-indexed.component";
import { FormBuilder, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-measurement-point-section',
  standalone: true,
  template: `
    <div class="flex flex-col rounded bg-grey-1 p-2 gap-2" [ngClass]="{ 'ghost': ghost }">
      <app-input-indexed [index]="''+index" [indexBold]="true" [formControl]="this.f.name" id="measurement-point-name" label="nome" [placeholder]="ghost ? 'Nuova misurazione' : ''"/>
      <app-input-indexed [index]="'A'" [formControl]="this.f.unitMeasurement1" id="measurement-point-unit-measure-1" label="u.m."/>
      <app-input-indexed [index]="'B'" [formControl]="this.f.unitMeasurement2" id="measurement-point-unit-measure-2" label="u.m."/>
      <div class="flex w-full justify-end" *ngIf="!ghost">
        <div class="flex cursor-pointer error default-shadow-hover rounded py-2 px-3 gap-2">
          <mat-icon class="icon-size material-symbols-rounded">delete</mat-icon>
          <div>Rimuovi</div>
        </div>
      </div>
    </div>
  `,
  imports: [ CommonModule, InputIndexedComponent, MatIconModule ],
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
    unitMeasurement1: ["", [Validators.required]],
    unitMeasurement2: ["", [Validators.required]],
  })

  get f() { return this.measurementPointForm.controls; }

  ngOnInit() {

  }
}