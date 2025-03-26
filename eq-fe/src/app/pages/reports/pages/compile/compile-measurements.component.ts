import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CompileHeaderComponent } from "../../components/compile-header.component";
import { MeasurementCardComponent } from "../../components/measurement-card.component";
import { Measurement } from "../../../../models/Measurement";

@Component({
  selector: "app-compile-measurements",
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <app-compile-header componentStyle="success"/>
      <div class="flex flex-col gap-2">
        <div class="text-xl font-bold">INFORMAZIONI GENERALI</div>
        <app-measurement-card *ngFor="let measurement of measurements, index as i" [measurement]="measurement" [index]="i+1"/>
      </div>
      àà
    </div>
  `,
  imports: [
    CommonModule,
    CompileHeaderComponent,
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
      values: [{ value: "", unitMeasure: "mSv/anno" }, { value: "", unitMeasure: "µGy/exp" }],
    },
    {
      id:"",
      sourceId:"",
      date:"",
      name:"postazione operatore",
      values: [{ value: "", unitMeasure: "mSv/anno" }, { value: "", unitMeasure: "µGy/exp" }],
    },
    {
      id:"",
      sourceId:"",
      date:"",
      name:"dietro porta accesso sala comandi",
      values: [{ value: "", unitMeasure: "mSv/anno" }, { value: "", unitMeasure: "µGy/exp" }],
    },
  ];
}