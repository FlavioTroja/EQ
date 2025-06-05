import { Component, effect, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrollBarNavigatorComponent, HeaderItem } from "../../../../components/scroll-bar-navigator/scroll-bar-navigator.component";
import { FillInContainerComponent } from "../../../../components/fill-in-container/fill-in-container.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { FormBuilder, Validators } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { getRouterUrl, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import * as RouterActions from "../../../../core/router/store/router.actions";
import * as UiActions from "../../../../core/ui/store/ui.actions";
import { InputComponent } from "../../../../components/input/input.component";
import {
  getActiveDepartmentSources, getActiveSource, getBackwardSource
} from "../../store/selectors/reports.selectors";
import { map } from "rxjs";
import * as ReportActions from "../../store/actions/reports.actions";
import { NAVBAR_ACTION } from "../../../../models/NavBar";
import { IrradiationCondition } from "../../../../models/IrradiationCondition";

@Component({
  selector: "app-compile-machine",
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <app-scroll-bar-navigator componentStyle="compile"
                          [items]="sources() || []"
                          [selectedItem]="sources()?.at(this.sourceIndex())"
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
        <app-fill-in-container *ngFor="let irradiationCondition of (currentSource()?.irradiationConditions || []), index as i"
                               [completedNumber]="0"
                               [totalNumber]="0"
                                 [title]="getMachineName(irradiationCondition)"
                               (onClick)="compileReport(i)"
                               componentStyle="compile"
        />
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    ScrollBarNavigatorComponent,
    FillInContainerComponent,
    InputComponent,
  ],
  styles: [``]
})
export default class CompileMachinesComponent implements OnDestroy {
  store: Store<AppState> = inject(Store);
  fb = inject(FormBuilder);

  path = toSignal(this.store.select(getRouterUrl));
  sourceIndex = toSignal(this.store.select(selectCustomRouteParam("sourceIndex")));
  currentSource = toSignal(this.store.select(getActiveSource));

  sources = toSignal(this.store.select(getActiveDepartmentSources)
    .pipe(map(array => array.map(source => ({
      id: source.id,
      name: `${source.machine.name} ${source.sn}`,
      completed: !!(source.completedMeasurements - source.irradiationConditions?.length)
    } as HeaderItem)))));

  productForm = this.fb.group({
    load: ["", Validators.required],
    phantom: ["", Validators.required]
  });

  get f() {
    return this.productForm.controls;
  }

  constructor() {
    effect(() => {
      this.store.dispatch(ReportActions.updateCurrentSource({ sourceIndex: this.sourceIndex() }));
      this.store.dispatch(UiActions.setCustomNavbar({ navbar: {
          title: `${this.currentSource()?.machine?.name} ${this.currentSource()?.sn}`,
          buttons: [
            {
              label: this.sources()?.at(+this.sourceIndex()+1)?.name || 'Fine',
              iconName: 'arrow_forward',
              action: NAVBAR_ACTION.REPORT_COMPILE_SOURCE_FORWARD,
            },
            {
              label: '',
              iconName: 'arrow_back',
              action: NAVBAR_ACTION.REPORT_COMPILE_SOURCE_BACKWARD,
              selectors: { disabled: getBackwardSource(+this.sourceIndex()) }
            }
          ]
        }}))
    }, { allowSignalWrites: true });
  }

  changeSource(sourceIndex: number) {
    this.store.dispatch(RouterActions.go({ path: [`${this.path()?.split('/').slice(0, -1).join('/')}/${sourceIndex}`] }))
  }

  getMachineName(irradiationCondition: IrradiationCondition): string {
    return `${irradiationCondition.setUpMeasure}`;
  }

  compileReport(measurementIndex: number): void {
    this.store.dispatch(RouterActions.go({ path: [`${this.path()}/measurements`] }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(UiActions.clearCustomNavbar());
  }
}