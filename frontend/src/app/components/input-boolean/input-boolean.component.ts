import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, FormsModule } from "@angular/forms";
import { toggleBooleanFormValue } from "../../../utils/utils";

@Component({
  selector: 'app-input-boolean',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  template: `
    <div class="w-full self-end">
      <label *ngIf="!!label" class="text-sm pl-2">{{ label }}</label>
      <div
        class="flex flex-row border-input justify-start bg-foreground rounded-md select-none cursor-pointer w-full h-12 gap-2 p-3"
        [ngClass]="{ 'disabled': disabled }"
        (click)="toggleBooleanFormValue(formControl)">
        <div class="self-center">
          <input type="checkbox" 
                 [value]="value"
                 [disabled]="disabled"
                 [(ngModel)]="value">
        </div>
        <div class="font-bold self-center text-lg">
          {{ message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .disabled {
      cursor: default !important;
      pointer-events: none !important;
    }
  `]
})
export class InputBooleanComponent implements ControlValueAccessor {
  @Input({ required: true }) formControl!: FormControl<boolean | null>;
  @Input() label = "";
  @Input() message = "";

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

  protected readonly toggleBooleanFormValue = toggleBooleanFormValue;
}
