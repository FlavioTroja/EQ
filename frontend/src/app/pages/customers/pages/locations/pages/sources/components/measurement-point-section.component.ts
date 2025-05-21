import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputIndexedComponent } from "../../../../../../../components/input-indexed/input-indexed.component";
import { FormBuilder, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-measurement-point-section',
  standalone: true,
  template: `
    <div class="flex flex-col rounded bg-grey-1 p-2 gap-2">
      <div class="flex w-full justify-end">
        <div class="flex cursor-pointer error default-shadow-hover rounded py-2 px-3 gap-2">
          <mat-icon class="icon-size material-symbols-rounded">delete</mat-icon>
          <div>Rimuovi</div>
        </div>
      </div>
      <app-input-indexed [index]="'1'" [formControl]="this.f.name" id="measurement-point-name" label="nome"/>
      <app-input-indexed [index]="'A'" [formControl]="this.f.unitMeasurement1" id="measurement-point-unit-measure-1" label="u.m."/>
      <app-input-indexed [index]="'B'" [formControl]="this.f.unitMeasurement2" id="measurement-point-unit-measure-2" label="u.m."/>
    </div>
  `,
  imports: [ CommonModule, InputIndexedComponent, MatIconModule ],
  styles: [``]
})
export class MeasurementPointSectionComponent implements OnInit {
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