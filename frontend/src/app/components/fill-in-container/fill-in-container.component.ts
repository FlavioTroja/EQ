import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: "app-fill-in-container",
  standalone: true,
  template: `
    <div class="grid rounded bg-foreground shadow gap-2"
         [ngClass]="(showBg ? componentStyle : '')+(!!title ? ' md:grid-cols-2 p-2' : ' p-1 rounded-r-5xl')">
      <div class="flex items-center font-bold" *ngIf="!!title">
        {{ title }}
      </div>
      <div class="flex justify-end items-center gap-1">
        <div class="flex border rounded-4xl h-9 px-3 select-none"
             [ngClass]="componentStyle+' border-'+componentStyle">
          <div class="flex flex-row items-center" [ngClass]="{ 'font-bold': completedNumber===totalNumber }">{{ completedNumber || 0 }}
            <div class="flex items-center font-bold">/{{ totalNumber || 0 }}</div>
          </div>
        </div>
        <app-button iconName="download_done" label="Compila" [bgColor]="componentStyle" [viewOnly]="viewOnly" (onClick)="click()"/>
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    MatIconModule,
    ButtonComponent,
  ],
  styles: [``]
})
export class FillInContainerComponent {
  @Input({ required: true }) componentStyle: 'success' | 'accent' | 'compile' = 'accent';
  @Input({ required: false }) title?: string;
  @Input({ required: false }) completedNumber?: number;
  @Input({ required: false }) totalNumber?: number;
  /** shows a light version of the selected style as background, otherwise white */
  @Input({ required: false }) showBg: boolean = false;
  @Input({ required: false }) viewOnly: boolean = false;

  @Output() onClick = new EventEmitter<string>();

  click(): void {
    if(this.viewOnly) {
      return;
    }
    this.onClick.emit();
  }
}