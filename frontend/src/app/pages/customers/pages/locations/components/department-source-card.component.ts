import { Component, Input } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { PartialSource } from "../../../../../models/Source";

@Component({
  selector: 'app-department-source-card',
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
    <div class="flex flex-col bg-foreground border">
      <div class="flex w-full justify-between gap-2 p-2 rounded items-center">
        <div class="flex flex-col text-lg">
          {{ source.machine?.name || "--missing name--" }}
          <div class="flex">
            <div class="flex rounded text-sm self-center bg-light-grey border p-1 pr-2 gap-1">
              <div class="flex font-bold self-center gap-2">
                {{ source.sn }}
              </div>
            </div>
            <div class="flex rounded-full text-sm self-center bg-light-grey border p-1 pr-2 gap-1">
              <mat-icon class="material-symbols-rounded">format_list_bulleted</mat-icon>
              <div class="flex font-bold self-center gap-2">
                {{ source.measurements?.length || 0 }}
                <div class="font-normal">condizioni</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [
    MatIconModule,
    CommonModule,
  ],
  styles: [`
    
  `]
})
export class DepartmentSourceCardComponent {
  @Input({ required: true }) source: PartialSource = {};

}