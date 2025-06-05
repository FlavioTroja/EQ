import { Component, effect, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrollBarNavigatorComponent, HeaderItem } from "../../../../components/scroll-bar-navigator/scroll-bar-navigator.component";
import { FillInContainerComponent } from "../../../../components/fill-in-container/fill-in-container.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { FormBuilder } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import * as UiActions from "../../../../core/ui/store/ui.actions";
import * as ReportActions from "../../store/actions/reports.actions";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { getRouterUrl, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import {
  getActiveDepartment,
  getActiveReportLocationsDepartments,
  getBackwardDepartment
} from "../../store/selectors/reports.selectors";
import { map } from "rxjs";
import { Source } from "../../../../models/Source";
import { NAVBAR_ACTION } from "../../../../models/NavBar";

@Component({
  selector: "app-compile-departments",
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <app-scroll-bar-navigator componentStyle="accent"
                          [items]="departments() || []"
                          [selectedItem]="departments()?.at(this.departmentIndex())"
                          (headerClick)="changeDepartment($event)"/>
      <div class="flex flex-col gap-2">
        <div class="text-xl font-bold">MACCHINE</div>
        <app-fill-in-container *ngFor="let source of (currentDepartment()?.sources || []), index as i"
                               [completedNumber]="source.completedMeasurements"
                               [totalNumber]="(source.irradiationConditions || []).length"
                               [title]="getMachineName(source)"
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
  ],
  styles: [``]
})
export default class CompileDepartmentsComponent implements OnDestroy {
  store: Store<AppState> = inject(Store);
  fb = inject(FormBuilder);

  path = toSignal(this.store.select(getRouterUrl));
  departmentIndex = toSignal(this.store.select(selectCustomRouteParam("departmentIndex")));
  currentDepartment = toSignal(this.store.select(getActiveDepartment));

  departments = toSignal(this.store.select(getActiveReportLocationsDepartments)
    .pipe(map(array => array.map(department => ({
      id: department.id,
      name: department.name,
      completed: !!(department.completedSources - department.sources.length)
    } as HeaderItem)))));

  constructor() {
    effect(() => {
      this.store.dispatch(ReportActions.updateCurrentDepartment({ departmentIndex: this.departmentIndex() }));
      this.store.dispatch(UiActions.setCustomNavbar({ navbar: {
        title: this.currentDepartment()?.name,
        buttons: [
          {
            label: this.departments()?.at(+this.departmentIndex()+1)?.name || 'Fine',
            iconName: 'arrow_forward',
            action: NAVBAR_ACTION.REPORT_COMPILE_DEPARTMENT_FORWARD,
          },
          {
            label: '',
            iconName: 'arrow_back',
            action: NAVBAR_ACTION.REPORT_COMPILE_DEPARTMENT_BACKWARD,
            selectors: { disabled: getBackwardDepartment(+this.departmentIndex()) }
          }
        ]
      }}))
    }, { allowSignalWrites: true });
  }

  changeDepartment(departmentIndex: number) {
    this.store.dispatch(RouterActions.go({ path: [`${this.path()?.split('/').slice(0, -1).join('/')}/${departmentIndex}`] }))
  }

  getMachineName(source: Source): string {
    return `${source.machine.name} ${source.sn}`;
  }

  compileReport(sourceIndex: number): void {
    this.store.dispatch(RouterActions.go({ path: [`${this.path()}/${sourceIndex}`] }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(UiActions.clearCustomNavbar());
  }
}