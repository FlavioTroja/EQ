import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import { MatIconModule } from "@angular/material/icon";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatTooltipModule } from "@angular/material/tooltip";
import * as MachinesActions from "../../../machines/store/actions/machines.actions";
import { getCurrentMachine } from "../../store/selectors/machines.selectors";
import { getLabelFromMachineType } from "../../../../models/Machine";
import { HyperPillComponent } from "../../../../components/pill/hyper-pill.component";

@Component({
  selector: 'app-view-machine',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ClipboardModule, MatTooltipModule, HyperPillComponent ],
  template: `
    <div class="flex flex-col gap-2" *ngIf="active() as machine">
      <div class="bg-white default-shadow p-2 rounded-md">
        <div class="flex flex-col gap-2 justify-between">
          <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 fit-content border">
            <mat-icon class="material-symbols-rounded">category</mat-icon>
            {{ getLabelFromMachineType[machine.type] }}
          </div>
          <div class="text-4xl font-extrabold"> {{ machine.name }} </div>
        </div>
      </div>
      <div class="flex font-bold text-xl">IN POSSESSO DA</div>
      <div class="flex justify-start p-2 gap-10 bg-foreground rounded">
        <app-hyper-pill iconName="person" [text]="'Jacopo Ortis'" class="!cursor-default !pointer-events-none"/>
        <app-hyper-pill iconName="distance" [text]="'Via F. D’Italia'" class="!cursor-default !pointer-events-none"/>
        <div class="flex gap-1">
          <div class="flex accent items-center px-2 py-1 gap-1 rounded">
            <mat-icon class="material-symbols-rounded">mail</mat-icon>
            {{ 'jacortis@email.com' }}
          </div>
          <div class="flex accent items-center px-2 py-1 gap-1 rounded">
            <mat-icon class="material-symbols-rounded">call</mat-icon>
            {{ '+39 320 3213212' }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export default class ViewMachineComponent implements OnInit {

  store: Store<AppState> = inject(Store);
  active = this.store.selectSignal(getCurrentMachine);
  id = toSignal(this.store.select(selectCustomRouteParam("id")));

  ngOnInit() {
    this.store.dispatch(
      MachinesActions.getMachine({ id: this.id()})
    );
  }

  protected readonly getLabelFromMachineType = getLabelFromMachineType;
}
