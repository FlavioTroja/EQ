import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../../../../../app.config";
import { selectCustomRouteParam } from "../../../../../../../../core/router/store/router.selectors";
import * as SourcesActions from "../../store/actions/sources.actions";
import { getCurrentSource } from "../../store/selectors/sources.selectors";

@Component({
  selector: 'app-view-source',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ClipboardModule, MatTooltipModule ],
  template: `
    <div class="flex flex-col gap-2" *ngIf="active() as source">
      <div class="bg-white default-shadow p-2 rounded-md">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col justify-between">
            <div *ngIf="source.departmentId"
                 class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 fit-content">
              {{ source.departmentId }}
            </div>
            <div class="text-4xl pt-6 pb-4 font-extrabold"> {{ source.machine.name }}</div>
            <div class="flex gap-2">

              <div *ngIf="source.sn" class="flex flex-col">
                <div class="font-bold text-lg">Indirizzo</div>
                <span>{{ source.sn }}</span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="source.measurements">
          <div class="font-bold py-1">NOTE</div>
          <div>{{ source.measurements }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export default class ViewSourceComponent implements OnInit {

  store: Store<AppState> = inject(Store);
  active = this.store.selectSignal(getCurrentSource);
  sourceId = toSignal(this.store.select(selectCustomRouteParam("sourceId")));
  customerId = toSignal(this.store.select(selectCustomRouteParam("customerId")));

  ngOnInit() {
    // this.store.dispatch(
    //   SourcesActions.getSource({ sourceId: this.sourceId(), customerId: this.customerId() })
    // );
  }

  get departments() {
    return /*this.active()?.departments.filter(o => Object.keys(o).length > 0) as any[];*/ [];
  }
}
