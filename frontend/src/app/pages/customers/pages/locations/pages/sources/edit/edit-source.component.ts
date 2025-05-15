import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputComponent } from "../../../../../../../components/input/input.component";

@Component({
  selector: "app-edit-source",
  standalone: true,
  template: `
<!--    <div class="flex flex-col gap-2">-->
<!--      <div class="flex font-bold uppercase">Modifica sorgente</div>-->
<!--      <div class="flex flex-col w-full gap-2 md:flex-row">-->
<!--        <div class="flex md:w-1/3">-->
<!--          <app-input [formControl]="f.state" formControlName="state" label="stato" id="location-state" type="text"-->
<!--                     class="w-full"/>-->
<!--        </div>-->
<!--        <div class="flex md:w-1/3">-->
<!--          <app-input [formControl]="f.region" formControlName="region" label="regione" id="location-region" type="text"-->
<!--                     class="w-full"/>-->
<!--        </div>-->
<!--        <div class="flex md:w-1/3">-->
<!--          <app-input [formControl]="f.province" formControlName="province" label="provincia" id="location-province"-->
<!--                     type="text" class="w-full"/>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="flex flex-col gap-2 md:flex-row">-->
<!--        <div class="flex gap-2 md:w-1/2">-->
<!--          <div class="flex w-4/5">-->
<!--            <app-input [formControl]="f.city" formControlName="city" label="città" id="location-city" type="text"-->
<!--                       class="w-full"/>-->
<!--          </div>-->
<!--          <div class="flex w-1/5">-->
<!--            <app-input [formControl]="f.cap" formControlName="cap" label="cap" id="location-cap" type="text"-->
<!--                       class="w-full"/>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="flex gap-2 md:w-1/2">-->
<!--          <div class="flex w-4/5">-->
<!--            <app-input [formControl]="f.address" formControlName="address" label="indirizzo" id="location-address"-->
<!--                       type="text" class="w-full"/>-->
<!--          </div>-->
<!--          <div class="flex w-1/5">-->
<!--            <app-input [formControl]="f.number" formControlName="number" label="civico" id="location-number" type="text"-->
<!--                       class="w-full"/>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  `,
  imports: [
    FormsModule,
    InputComponent,
    ReactiveFormsModule
  ],
  styles: [ `` ]
})
export class EditSourceComponent implements OnInit {

  ngOnInit() {}
}