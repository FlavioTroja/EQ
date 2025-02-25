import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { StatusPillComponent } from "../../../../components/pill/status-pill.component";
import { TableButtonComponent } from "../../../../components/table/components/button/button.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-inspection-card',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatIconModule, MatTooltipModule, StatusPillComponent ],
  template: `
    <div class="flex flex-col p-2.5 gap-2.5 bg-foreground rounded shadow-md w-full">
      <div>
        <div class="whitespace-nowrap overflow-hidden text-ellipsis">
          desc
        </div>
        <div class="flex justify-between">
          <div class="flex justify-start gap-1">
            <app-status-pill [status]="''"/>
            <div
              class="bg-foreground default-shadow rounded-full max-w-max px-2 py-1.5 flex gap-1 items-center break-keep cursor-pointer"
              (click)="navigateOnCustomer(1)">
              <div class="pr-1 flex self-center">
                <mat-icon class="material-symbols-rounded">person</mat-icon>
              </div>
              <div class="font-bold whitespace-nowrap text-sm pr-0.5 text-ellipsis overflow-hidden"
                   style="max-width: 10rem">
                client
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-end">
            <mat-icon class="material-symbols-rounded arrow rounded-full"
                      (click)="isInspectionCardOpen = !isInspectionCardOpen">
              {{ isInspectionCardOpen ? "keyboard_arrow_up" : "keyboard_arrow_down" }}
            </mat-icon>
          </div>
        </div>
      </div>
      <div *ngIf="isInspectionCardOpen" class="flex justify-end gap-2.5 w-full">
        open 
      </div>
    </div>
  `,
  styles: [`
    .arrow {
      background-color: #D9D9D9;
    }
  `]
})
export default class InspectionCardComponent {
  @Input({ required: true }) inspection!: any;

  store: Store<AppState> = inject(Store);
  dialog = inject(MatDialog);

  isInspectionCardOpen: boolean = false;

  navigateOnCustomer(id: number) {
    // this.store.dispatch(InspectionActions.navigateOnInspectionCustomer({ id }));
  }
}
