import { Component, effect, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CompileHeaderComponent, HeaderItem } from "../../components/compile-header.component";
import { FillInContainerComponent } from "../../components/fill-in-container.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { FormBuilder, Validators } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { getRouterUrl, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { InputComponent } from "../../../../components/input/input.component";
import {
  getActiveDepartmentSources, getActiveSource
} from "../../store/selectors/reports.selectors";
import { map } from "rxjs";
import * as ReportActions from "../../store/actions/reports.actions";
import { Measurement } from "../../../../models/Measurement";

@Component({
  selector: "app-compile-machine",
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <app-compile-header componentStyle="compile"
                          [items]="(sources$ | async) || []"
                          [selectedItem]="(sources$ | async)?.at(0)"
                          (headerClick)="changeSource($event)"/>
      <div class="flex flex-col gap-2">
        <div class="text-xl font-bold">INFORMAZIONI GENERALI</div>
        <div class="flex flex-col gap-2">
          <app-input class="grow" [formControl]="f.load" label="Carico" id="load" type="string" unitMeasure="mAmin/sett" />
          <app-input class="grow" [formControl]="f.phantom" label="Phantom" id="phantom" type="string" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-xl font-bold">COMPILAZIONI</div>
        <app-fill-in-container *ngFor="let measurement of ((currentSource$ | async)?.measurements || []), index as i"
                               [completedNumber]="0"
                               [totalNumber]="0"
                               [title]="getMachineName(measurement)"
                               (onClick)="compileReport(i)"
                               componentStyle="compile"
        />
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    CompileHeaderComponent,
    FillInContainerComponent,
    InputComponent,
  ],
  styles: [``]
})
export default class CompileMachinesComponent {
  store: Store<AppState> = inject(Store);
  fb = inject(FormBuilder);

  path = toSignal(this.store.select(getRouterUrl));
  sourceIndex = toSignal(this.store.select(selectCustomRouteParam("sourceIndex")));

  sources$ = this.store.select(getActiveDepartmentSources)
    .pipe(map(array => array.map(source => ({
      id: source.id,
      name: `${source.machine.name} ${source.sn}`,
      completed: !!(source.completedMeasurements - source.measurements?.length)
    } as HeaderItem))));
  currentSource$ = this.store.select(getActiveSource);

  productForm = this.fb.group({
    load: ["", Validators.required],
    phantom: ["", Validators.required]
  });

  get f() {
    return this.productForm.controls;
  }

  constructor() {
    effect(() => {
      this.store.dispatch(ReportActions.updateCurrentSource({ sourceIndex: this.sourceIndex() }))
    }, { allowSignalWrites: true });
  }

  changeSource(sourceIndex: number) {
    this.store.dispatch(RouterActions.go({ path: [`${this.path()?.slice(0, -1)}${sourceIndex}`] }))
  }

  getMachineName(measurement: Measurement): string {
    return `${measurement.name}`;
  }

  compileReport(measurementIndex: number): void {
    this.store.dispatch(RouterActions.go({ path: [`${this.path()}/measurements`] }));
  }
}