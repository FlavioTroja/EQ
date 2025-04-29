import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCalendarComponent } from "../../../components/event-calendar/event-calendar.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../app.config";
import { of, Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { toSignal } from "@angular/core/rxjs-interop";
import { selectRouteQueryParamParam } from "../../../core/router/store/router.selectors";
import { FormControl } from "@angular/forms";
import { FilterElement } from "../../../models/Filters";
import { MatIconModule } from "@angular/material/icon";
import { SearchComponent } from "../../../components/search/search.component";
import { FiltersComponent } from "../../../components/filters/filters.component";
import { IconCounterComponent } from "./addon/icon-counter.component";
import InspectionCardComponent from "./addon/inspection-card.component";
import { DateTime } from "luxon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <ng-container *ngIf="inspections$ | async as inspections">
      <div class="grid grid-rows-2 md:grid-cols-2 gap-2.5 w-full">
        <div class="flex flex-col gap-2.5 h-full">
          <app-event-calendar
            (onCalendarChange)="manageMonthChange($event)"
            [selectedDay]="selectedDay" />

          <div class="flex flex-row justify-center gap-4 cursor-default select-none">
            <app-icon-counter [content]="'in attesa'" [icon]="'circle'" [iconClass]="'text-pending'" />
            <app-icon-counter [content]="'completati'" [icon]="'circle'" [iconClass]="'text-done'" />
          </div>
        </div>

        <div class="flex flex-col gap-2.5" *ngIf="selectedDay && selectedDay > 0 && baseDate">
          <div class="font-bold text-2xl">
            {{ baseDate.set({ day: selectedDay }).toFormat("dd LLLL yyyy") }}
          </div>

          <div class="flex justify-between gap-2">
            <div (click)="toggleFilter()"
                 matTooltip="Filtri sopralluoghi"
                 [ngStyle]="{'background-color': expandFilter ? '#F2F2F2' : '#FFFFFF'}"
                 class="cursor-pointer w-10 rounded-md aspect-square flex font-bold shadow-md bg-foreground text-gray-900 text-sm focus:outline-none p-2">
              <mat-icon *ngIf="!expandFilter" class="material-symbols-rounded">filter_list</mat-icon>
              <mat-icon *ngIf="expandFilter" class="material-symbols-rounded">close</mat-icon>
            </div>
            <div class="grow">
              <app-search [search]="search"/>
            </div>
          </div>
          <app-filters *ngIf="expandFilter" [showFilter]="expandFilter" [filterTabs]="filterTabs"/>
          <ng-container *ngIf="selectiveInspections$ | async as selectiveInspections">
            <div *ngFor="let inspection of selectiveInspections" #list>
              <app-inspection-card [inspection]="inspection"/>
            </div>

            <div *ngIf="!selectiveInspections.length;" class="w-full text-center italic">
              Nessun sopralluogo trovato
            </div>
          </ng-container>
        </div>
      </div>
    </ng-container>
  `,
  styles: [``],
  imports: [ CommonModule, EventCalendarComponent, MatIconModule, SearchComponent, FiltersComponent, IconCounterComponent, InspectionCardComponent, MatTooltipModule ]
})
export default class HomeComponent implements OnInit {
  store: Store<AppState> = inject(Store);
  inspections$ = of([1,2,3,4]);
  selectiveInspections$ = of([]);
  dialog = inject(MatDialog);
  subject = new Subject();

  queryParams = toSignal(this.store.select(selectRouteQueryParamParam()));

  paginator = signal({
    pageIndex: 0,
    pageSize: 10
  });

  search = new FormControl("");
  baseDate?: DateTime;
  selectedDay: number | undefined;

  expandFilter: boolean = false;
  filterTabs: FilterElement[] = [];

  ngOnInit() {
    if(this.queryParams()) {
      this.expandFilter = true;
    }

    if((this.queryParams() as any)?.search) {
      this.search.setValue((this.queryParams() as any).search!, { emitEvent: false })
    }
    //
    // this.inspectionsFilter$
    //   .pipe(takeUntil(this.subject))
    //   .subscribe((val) => {
    //     this.baseDate = !!val?.query?.dateFrom ? DateTime.fromFormat(val.query.dateFrom.toString(), "yyyy-LL-dd") : DateTime.now().startOf("month");
    //   });
    //
    // this.inspectionsSelectiveFilter$
    //   .pipe(takeUntil(this.subject))
    //   .subscribe((val) => {
    //     this.selectedDay = !!val?.query?.dateFrom ? DateTime.fromFormat(val.query.dateFrom.toString(), "yyyy-LL-dd").day : -1;
    //   });
    //
    // this.search.valueChanges.pipe(
    //   debounceTime(250),
    //   distinctUntilChanged(),
    //   takeUntil(this.subject)
    // ).subscribe(res => {
    //   this.searchInspection({
    //     ...this.queryParams(),
    //     search: res || undefined,
    //   }, false);
    // });
  }

  constructor() {
    effect(() => {

      // const params = {
      //   ...this.queryParams()
      // } as InspectionTable;
      //
      // const dateFrom = (params?.dateFrom ? DateTime.fromFormat(params.dateFrom.toString() ?? "", "yyyy-LL-dd") : DateTime.now())
      //   .startOf("month");
      //
      // const inspectionsFilter: QueryAll<InspectionFilter> = {
      //   query: {
      //     dateFrom: dateFrom.toFormat("yyyy-LL-dd"),
      //     dateTo: params.dateTo ?? DateTime.now().endOf("month").toFormat("yyyy-LL-dd")
      //   },
      // };
      //
      // // prevent reload of the monthly inspections
      // if (!this.baseDate?.equals(dateFrom)) {
      //   this.store.dispatch(InspectionActions.editInspectionFilter({ filters: inspectionsFilter }));
      // }
      //
      // if (!!params.selectedDay) {
      //   const selectiveInspectionsFilter: QueryAll<InspectionFilter> = {
      //     query: {
      //       value: params.search || "",
      //       dateFrom: dateFrom.set({day: params.selectedDay}).toFormat("yyyy-LL-dd"),
      //       dateTo: dateFrom.set({day: params.selectedDay}).endOf("day").toFormat("yyyy-LL-dd")
      //     },
      //     populate: "setup.customer user"
      //   };
      //
      //   this.store.dispatch(InspectionActions.editSelectiveInspectionFilter({ filters: selectiveInspectionsFilter }));
      // } else {
      //   this.store.dispatch(InspectionActions.resetSelectiveInspection());
      // }

    }, { allowSignalWrites: true });

  }

  searchInspection(payload: any/*InspectionTable*/, resetPageIndex?: boolean): void {
    // if(resetPageIndex) {
    //   payload = { ...payload, pageIndex: 0 };
    // }
    //
    // this.store.dispatch(RouterActions.go({ path: ["inspections"], extras: { queryParams: payload } }));
  }

  manageMonthChange(calendarSpec: { selectedDay: number, baseDate: DateTime }) {
    this.searchInspection({
      ...this.queryParams(),
      dateFrom: calendarSpec.baseDate.startOf("month").toFormat("yyyy-LL-dd"),
      dateTo: calendarSpec.baseDate.endOf("month").toFormat("yyyy-LL-dd"),
      selectedDay: calendarSpec.selectedDay === -1 ? undefined : calendarSpec.selectedDay,
    }, false);
  }

  toggleFilter(): void {
    this.expandFilter = !this.expandFilter;

    if(!this.expandFilter) {
      this.filterTabs.forEach(tab => {
        tab.options.forEach(o => {
          if(o.checked) {
            // this.onSelectedOption(tab.field, o);
            o.checked = false;
          }
        })
      });
    }
  }

  getDateCounters(dayNumber: number, inspections: any[], baseDate: DateTime) {
    // const date = baseDate.set({ day: dayNumber }).startOf("day");
    //
    // const filteredInspections = inspections.filter((inspection) => {
    //   return date.equals(DateTime.fromISO(inspection.date as string).startOf("day"));
    // });
    //
    // if(!filteredInspections.length) {
    //   return undefined;
    // }
    //
    // return filteredInspections.reduce((previousValue, currentValue) => ({
    //   pending: +(currentValue.inspectionStatus === InspectionStatus.PENDING) + previousValue.pending,
    //   done: +(currentValue.inspectionStatus === InspectionStatus.DONE) + previousValue.done,
    // }), { accepted: 0, pending: 0, rejected: 0, done: 0 })
    return { pending: 3, done: 1 }
  }

}
