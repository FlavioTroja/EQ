import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { NgClass, NgTemplateOutlet } from "@angular/common";


@Component({
  selector: 'app-event-calendar-cell',
  standalone: true,
  template: `
    <div
      class="flex flex-col bg-foreground justify-between rounded shadow p-1 w-full text-sm cursor-pointer select-none transition duration-300 h-[70px]"
      [ngClass]="{'selected': selected, 'holiday': holiday }"
      (click)="handleOnClick()"
    >
        <ng-container *ngTemplateOutlet="cellExtraContent; context: {$implicit: cellNumber}"></ng-container>

        <div class="flex h-full w-full justify-end row items-end text-center font-bold text-sm" style="line-height: 0.875rem">{{ cellNumber }}</div>
    </div>
  `,
  imports: [
    MatIconModule,
    NgClass,
    NgTemplateOutlet,

  ],
  styles: [`
    .selected {
      background: #D7D7D7 !important;
      color: black !important;
    }
    .holiday {
      background: rgb(248, 233, 232);
      color: rgb(229, 79, 71);
    }

    mat-icon {
      font-size: 1.375rem;
      height: 1.250rem;
      width: 1.250rem;
    }
  `]
})
export class EventCalendarCellComponent {
  @Input({ required: true }) cellNumber!: number;
  @Input({ required: false }) selected: boolean = false;
  @Input({ required: false }) holiday: boolean = false;
  @Input() cellExtraContent: TemplateRef<any> | null = null;
  @Output() selectedEvent: EventEmitter<boolean> = new EventEmitter();

  handleOnClick() {
    this.selected = !this.selected;
    this.selectedEvent.emit(this.selected);
  }
}
