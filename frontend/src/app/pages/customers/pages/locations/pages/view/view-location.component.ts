import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../../../app.config";
import { selectCustomRouteParam } from "../../../../../../core/router/store/router.selectors";
import * as LocationsActions from "../../store/actions/locations.actions";
import { getCurrentLocation } from "../../store/selectors/locations.selectors";

@Component({
  selector: 'app-view-location',
  standalone: true,
  imports: [CommonModule, MatIconModule, ClipboardModule, MatTooltipModule],
  template: `
    view location
  `,
  styles: [``]
})
export default class ViewLocationComponent implements OnInit {

  store: Store<AppState> = inject(Store);
  active = this.store.selectSignal(getCurrentLocation);
  id = toSignal(this.store.select(selectCustomRouteParam("id")));
  customerId = toSignal(this.store.select(selectCustomRouteParam("customerId")));

  ngOnInit() {
    this.store.dispatch(
      LocationsActions.getLocation({ locationId: this.id(), customerId: this.customerId() })
    );
  }
}
