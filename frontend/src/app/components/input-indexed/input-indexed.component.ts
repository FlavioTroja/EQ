import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-indexed',
  standalone: true,
  imports: [ CommonModule ],
  template: `
    <div class="flex flex-row justify-start w-full gap-2">
      <div class="flex justify-center self-center items-center square" [ngClass]="{ 'font-bold': indexBold }" style="font-size: 32px; line-height: 32px;">
        {{ index }}
      </div>
      <div class="flex border border-black"></div>
      <div class="flex w-full">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class InputIndexedComponent {
  @Input({ required: true }) index!: string;
  @Input({ required: false }) indexBold: boolean = false;
}
