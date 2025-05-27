import { Component, Input } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatIconModule } from "@angular/material/icon";
import { PartialDepartment } from "../../../../../models/Department";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-location-department-card',
  standalone: true,
  animations: [
    trigger('rotateArrow', [
      state('close', style({ transform: 'rotate(180deg)' })),
      state('open', style({ transform: 'rotate(0deg)' })),
      transition('close <=> open', [ animate('300ms ease-in-out') ]),
    ]),
    trigger('translateDown', [
      state('up', style({ opacity: '1' })),
      state('down', style({ opacity: '0' })),
      transition('up => down', [
        animate('100ms', style({
          transform: 'translateY(70%)',
          opacity: '0.5'
        })),
      ]),
      transition('down => up', [
        animate('150ms', style({
          opacity: '0.5'
        })),
      ])
    ]),
  ],
  template: `
    <div class="flex bg-foreground">
      <div class="flex w-full cursor-pointer justify-between gap-2 p-2 rounded"
           (click)="toggleCardCollapsed()">
        <div class="flex gap-8">
          {{ department.name }}
          <div class="flex rounded-full bg-light-grey border p-1 pr-2 gap-1">
            <mat-icon class="material-symbols-rounded">precision_manufacturing</mat-icon>
            <div class="flex font-bold text-center gap-2">
              {{ department.sources?.length || 0 }}
              <div class="font-normal">macchine</div>
            </div>
          </div>
        </div>
        <mat-icon class="material-symbols-rounded" [@rotateArrow]="isCardCollapsed ? 'close' : 'open'">
          keyboard_arrow_down
        </mat-icon>
      </div>
      <div *ngIf="isCardCollapsed" [@translateDown]="isCardCollapsed ? 'up' : 'down'">
        
      </div>
    </div>
  `,
  imports: [
    MatIconModule,
    NgIf
  ],
  styles: [ `` ]
})
export class LocationDepartmentCardComponent {
  @Input({ required: true }) department: PartialDepartment = {};

  isCardCollapsed: boolean = false;

  toggleCardCollapsed() {
    this.isCardCollapsed = !this.isCardCollapsed;
  }
}