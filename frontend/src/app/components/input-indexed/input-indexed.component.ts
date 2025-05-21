import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputComponent } from "../input/input.component";

@Component({
  selector: 'app-input-indexed',
  standalone: true,
  imports: [ CommonModule, InputComponent ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputIndexedComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-row justify-start w-full gap-2">
      <div class="flex justify-center self-center items-center square" [ngClass]="{ 'font-bold': indexBold }" style="font-size: 32px; line-height: 32px;">
        {{ index }}
      </div>
      <div class="flex border border-black"></div>
      <div class="flex w-full">
        <app-input [formControl]="formControl" [label]="label" [id]="id" [type]="type" class="w-full" [placeholder]="placeholder"/>
      </div>
    </div>
  `,
  styles: []
})
export class InputIndexedComponent implements ControlValueAccessor {
  @Input({ required: true }) index!: string;
  @Input({ required: true }) formControl!: FormControl;
  @Input({ required: true }) id!: string;
  @Input({ required: false }) placeholder: string = "";
  @Input({ required: false }) indexBold: boolean = false;
  @Input({ required: false }) label: string = "";
  @Input({ required: false }) type: string = "text";

  value: boolean = false;
  disabled = false;
  onChange: any = (value: any) => {};
  onTouched: any = () => {};

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
