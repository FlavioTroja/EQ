import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-section-header",
  standalone: true,
  template: `
    <div class="flex text-xl font-bold w-full justify-between">
      {{ title }}
      <div *ngIf="!viewOnly">
        <button class="focus:outline-none rounded-full w-full border-input bg-foreground flex items-center"
                (click)="btnAdd.emit()">
          <mat-icon class="align-to-center icon-size material-symbols-rounded scale-75">add</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [``],
  imports: [
    MatIconModule,
    CommonModule
  ]
})
export class SectionHeaderComponent {
  @Input() title: string = "";
  @Input() viewOnly: boolean = true;
  @Output() btnAdd: EventEmitter<void> = new EventEmitter();

}