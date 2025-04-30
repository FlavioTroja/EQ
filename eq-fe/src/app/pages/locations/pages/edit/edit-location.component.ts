import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import { MatIconModule } from "@angular/material/icon";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: 'app-edit-location',
  standalone: true,
  imports: [CommonModule, MatIconModule, ClipboardModule, MatTooltipModule],
  template: `
    edit location
  `,
  styles: [``]
})
export default class EditLocationComponent implements OnInit {

  store: Store<AppState> = inject(Store);
  id = toSignal(this.store.select(selectCustomRouteParam("id")));

  ngOnInit() {}

}
