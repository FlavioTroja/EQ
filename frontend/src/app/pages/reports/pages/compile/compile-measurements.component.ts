import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ScrollBarNavigatorComponent
} from "../../../../components/scroll-bar-navigator/scroll-bar-navigator.component";
import { MeasurementCardComponent } from "../../components/measurement-card.component";
import { Measurement, unitMeasure } from "../../../../models/Measurement";

@Component({
  selector: "app-compile-measurements",
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <app-scroll-bar-navigator componentStyle="success"/>
      <div class="flex flex-col gap-2">
        <div class="text-xl font-bold">INFORMAZIONI GENERALI</div>
        <app-measurement-card *ngFor="let measurement of measurements, index as i" [measurement]="measurement" [index]="i+1"/>
      </div>
      àà
    </div>
  `,
  imports: [
    CommonModule,
    ScrollBarNavigatorComponent,
    MeasurementCardComponent,
  ],
  styles: [``]
})
export default class CompileMeasurementsComponent {
  measurements: Measurement[] = [
    {
      id:"",
      sourceId:"",
      date:"",
      name:"tavolo comando dietro visiva",
      values: [{ value: "", unitMeasure: unitMeasure.miniSievertAnnual }, { value: "", unitMeasure: unitMeasure.microGrayExp }],
    },
    {
      id:"",
      sourceId:"",
      date:"",
      name:"postazione operatore",
      values: [{ value: "", unitMeasure: unitMeasure.miniSievertAnnual }, { value: "", unitMeasure: unitMeasure.microGrayExp }],
    },
    {
      id:"",
      sourceId:"",
      date:"",
      name:"dietro porta accesso sala comandi",
      values: [{ value: "", unitMeasure: unitMeasure.miniSievertAnnual }, { value: "", unitMeasure: unitMeasure.microGrayExp }],
    },
  ];
}