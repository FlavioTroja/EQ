import { Component, Inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../button/button.component";
import { BottomSheetButton } from "../../models/Button";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from "@angular/material/bottom-sheet";

export interface BottomSheetDialogData {
  title: string,
  content: string,
  buttons: BottomSheetButton<any, any>[],
  templateContent?: TemplateRef<any>;
}

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [CommonModule, MatBottomSheetModule, ButtonComponent],
  template: `
    <div class="flex flex-col grow justify-between bg-white p-2.5">
      <div class="flex flex-col gap-2">
        <div class="font-bold text-xl capitalize">
            {{ data.title }}
        </div>
        <div [innerHTML]="data.content"></div>
        <div *ngIf="!!data.templateContent">
          <ng-container *ngTemplateOutlet="data.templateContent"></ng-container>
        </div>
      </div>
      <div class="flex flex-row-reverse gap-2">
        <ng-template ngFor let-item="$implicit" [ngForOf]="data.buttons">
          <app-button [selectors]="item.selectors"
                      [label]="item.label"
                      [iconName]="item.iconName"
                      [bgColor]="item.bgColor ?? ''"
                      (onClick)="item.onClick()"
          />
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    
  `]
})
/**
 *
 * uses "dismiss" instead of "close" as closing action
 *
 * - __--mat-bottom-sheet-container-background-color__ refers to the main body of the bottom sheet
 *
 * - __panelClass__ requires a SINGLE css class applied to it,
 *    so you have to have a custom class instead of using multiple tailwind classes,
 *    it refers to the backpanel where the main body of the bottom sheet appears,
 *    if you hide it in any way it WILL hide the main body too,
 *    __best way to "remove" it is by using transparent as bg-color & set
 *    the var "--mat-bottom-sheet-container-background-color" to the color of your liking__
 *
 */
export class BottomSheetComponent {
  constructor(
    public bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: BottomSheetDialogData,
  ) {}


}
