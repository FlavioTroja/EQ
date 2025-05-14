import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from "../../../../components/search/search.component";
import { TableComponent } from "../../../../components/table/table.component";
import { TableSkeletonComponent } from "../../../../components/skeleton/table-skeleton.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { getCustomersPaginate } from "../../store/selectors/customers.selectors";
import { FormControl } from "@angular/forms";
import { Sort, TableButton } from "../../../../models/Table";
import *  as RouterActions from "../../../../core/router/store/router.actions";
import { toSignal } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { ModalComponent, ModalDialogData } from "../../../../components/modal/modal.component";
import * as CustomerActions from "../../../customers/store/actions/customers.actions";
import { createSortArray, truncatePillText } from "../../../../../utils/utils";
import { CustomerFilter, CustomerTable, PartialCustomer } from "../../../../models/Customer";
import { MatIconModule } from "@angular/material/icon";
import { selectRouteQueryParamParam } from "../../../../core/router/store/router.selectors";
import { FilterElement, FilterOption } from "../../../../models/Filters";
import { Query } from "../../../../../global";
import { Subject } from "rxjs";
import { Address } from "../../../../models/Address";
import { HyperPillComponent } from "../../../../components/pill/hyper-pill.component";

@Component({
  selector: 'app-list-customer',
  standalone: true,
  imports: [ CommonModule, SearchComponent, TableComponent, TableSkeletonComponent, MatDialogModule, MatIconModule, HyperPillComponent ],
  template: `
    <div class="grid gap-3">

      <div class="grow">
        <app-search [search]="search"/>
      </div>

      <div *ngIf="customerPaginate$ | async as customerPaginate else skeleton">
        <app-table
          [dataSource]="customerPaginate"
          [columns]="columns"
          [displayedColumns]="displayedColumns"
          [paginator]="paginator"
          [buttons]="buttons"
          (onPageChange)="changePage($event)"
          (onPageSizeChange)="changePageSize($event)"
          (onSortChange)="changeSort($event)"/>
      </div>
    </div>
    <ng-template #nameRow let-row>
      <div class="flex flex-col justify-center">
        <h1>{{ row.name }}</h1>
      </div>
    </ng-template>
    
    <ng-template #locationRow let-row>
      <div class="flex gap-2">
        <div class="flex flex-col justify-center" *ngIf="!!row?.locations?.at(0)?.address">
          <app-hyper-pill iconName="distance" [text]="truncatePillText(row?.locations?.at(0)?.address)" class="!cursor-default !pointer-events-none"/>
        </div>
        <div class="flex flex-col justify-center">
          <div class="flex bg-gray-100 font-bold self-center border rounded-full px-2 py-1" *ngIf="row.locations?.length > 1">
            +{{ row.locations?.length-1 }}
          </div>
        </div>
      </div>
    </ng-template>
    
    <ng-template #contactRow let-row>
      <div class="flex flex-col justify-center">
        <div class="flex flex-row gap-1">
          <div class="flex accent items-center px-2 py-1 gap-1 rounded" *ngIf="!!row?.email">
            <mat-icon class="material-symbols-rounded">mail</mat-icon>
            {{ row?.email }}
          </div>
          <div class="flex accent items-center px-2 py-1 gap-1 rounded" *ngIf="!!row?.phoneNumber">
            <mat-icon class="material-symbols-rounded">call</mat-icon>
            {{ row?.phoneNumber }}
          </div>
        </div>
      </div>
    </ng-template>

    <ng-template #skeleton>
      <app-table-skeleton [columns]="columns"/>
    </ng-template>
  `,
  styles: []
})
export default class ListCustomerComponent implements OnInit, AfterViewInit {
  @ViewChild("nameRow") nameRow: TemplateRef<any> | undefined;
  @ViewChild("locationRow") locationRow: TemplateRef<any> | undefined;
  @ViewChild("contactRow") contactRow: TemplateRef<any> | undefined;

  store: Store<AppState> = inject(Store);
  customerPaginate$ = this.store.select(getCustomersPaginate);
  dialog = inject(MatDialog);
  subject = new Subject();
  queryParams = toSignal(this.store.select(selectRouteQueryParamParam()));

  typeValues: number[] | undefined;

  columns: any[] = [];
  displayedColumns: string[] = [];

  buttons: TableButton<PartialCustomer>[] = [
    { iconName: "delete", bgColor: "red", callback: elem => this.openDialog(elem) },
    { iconName: "edit", bgColor: "orange", callback: elem => this.store.dispatch(RouterActions.go({ path: [`customers/${elem.id}`] })) },
    { iconName: "visibility", bgColor: "sky", callback: elem => this.store.dispatch(RouterActions.go({ path: [`customers/${elem.id}/view`] })) }
  ];

  paginator = signal({
    pageIndex: 0,
    pageSize: 10
  });

  sorter: WritableSignal<Sort[]> = signal([{ active: "createdAt", direction: "desc" }]);

  search = new FormControl("");

  expandFilter: boolean = false;
  filterTabs: FilterElement[] = [];

  filters: Query<CustomerFilter> = {
    query: {},
    options: {
      populate: "addresses",
      limit: this.paginator().pageSize,
      page: (this.paginator().pageIndex + 1),
      sort: createSortArray(this.sorter())
    }
  };

  ngAfterViewInit() {
    Promise.resolve(null).then(() => {
      this.columns = [
        {
          columnDef: 'name',
          header: 'Nome',
          template: this.nameRow,
          width: "15rem",
          sortable: true
        },
        {
          columnDef: 'location',
          header: 'Sedi collegate',
          template: this.locationRow,
          width: "20rem",
          sortable: true
        },
        {
          columnDef: 'contact',
          header: 'Contatto',
          template: this.contactRow,
          width: "30rem",
          sortable: true
        },
      ];
      this.displayedColumns = [...this.columns.map(c => c.columnDef), "actions"];
    })
  }

  openDialog(customer: PartialCustomer) {
    const dialogRef: any = this.dialog.open(ModalComponent, {
      backdropClass: "blur-filter",
      data: <ModalDialogData> {
        title: "Conferma rimozione",
        content: `
        Si sta eliminando il cliente ${customer.name}.
        <br>
        Questa operazione non è reversibile.
        `,
        buttons: [
          { iconName: "delete", label: "Elimina", bgColor: "remove", onClick: () => dialogRef.close(true) },
          { iconName: "clear", label: "Annulla",  onClick: () => dialogRef.close(false) }
        ]
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(!result) {
        return;
      }
      this.deleteCustomer(customer);
    });
  }

  ngOnInit() {
    if(this.queryParams()) {
      this.expandFilter = true;
    }

    if((this.queryParams() as CustomerTable)?.search) {
      this.search.setValue((this.queryParams() as CustomerTable).search!, { emitEvent: false })
    }

    this.search.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntil(this.subject)
    ).subscribe(res => {
      this.searchCustomer({
        ...this.queryParams(),
        search: res || undefined,
      }, true);
    });
  }

  constructor() {
    effect(() => {

      const params = {
        ...this.queryParams()
      } as CustomerTable;

      this.typeValues = params.typeValues?.split(",").map(i => +i);

      this.filters = {
        ...this.filters,
        query: {
          value: params.search || "",
        },
        options: {
          populate: this.filters.options?.populate,
          limit: +params.pageSize! || 10,
          page: params.pageIndex ? (+params.pageIndex + 1) : 1,
          sort: createSortArray(this.sorter())
        }
      };

      this.store.dispatch(CustomerActions.editCustomerFilter({ filters: this.filters }));
      this.updatePaginator({
        pageSize: +params.pageSize! || 10,
        pageIndex: params.pageIndex ? (+params.pageIndex) : 0,
      });

    }, { allowSignalWrites: true });

  }

  searchCustomer(payload: CustomerTable, resetPageIndex?: boolean): void {
    if(resetPageIndex) {
      payload = { ...payload, pageIndex: 0 };
    }

    this.store.dispatch(RouterActions.go({ path: ["customers"], extras: { queryParams: payload } }));
  }

  private deleteCustomer(row: PartialCustomer) {
    this.store.dispatch(CustomerActions.deleteCustomer({ id: row.id! }));
  }

  updatePaginator({ pageIndex, pageSize }: { pageIndex: number, pageSize: number }) {
    this.paginator.update(() => ({ pageIndex, pageSize }));
  }

  changePage(evt: number): void {
    this.searchCustomer({
      ...this.queryParams(),
      pageIndex: evt - 1
    });
  }

  changePageSize(evt: number): void {
    this.searchCustomer({
      ...this.queryParams(),
      pageIndex: 0,
      pageSize: evt
    });
  }

  changeSort(evt: Sort) {
    this.sorter.mutate(value => {
      value[0] = (evt?.direction === "asc" || evt?.direction === "desc" ? evt : {} as Sort);
    });
  }

  getBillingAddress(addresses: Address[]) {
    const billAddress = addresses.find(a => a.billing);

    if(!billAddress) {
      return addresses[0];
    }
    return billAddress;
  }

  toggleFilter(): void {
    this.expandFilter = !this.expandFilter;

    if(!this.expandFilter) {

      this.filterTabs.forEach(tab => {
        tab.options.forEach(o => {
          if(o.checked) {
            this.onSelectedOption(tab.field, o);
            o.checked = false;
          }
        })
      });

    }
  }

  onSelectedTab(tab: FilterElement) {
    this.filterTabs = this.filterTabs.map((elem) => {
      if(elem.name === tab.name) {
        elem.popUp = !elem.popUp;
        elem.iconName = elem.iconName === "plus" ? "minus" : "plus";
      } else {
        elem.popUp = false;
        elem.iconName = "plus";
      }
      return elem;
    });
  }

  onSelectedOption(tabField: string, option: FilterOption) {

    this.filterTabs = this.filterTabs.map((elem) => {
      if(elem.field === tabField) {
        if(!option.checked) {
          elem.selectIds = [ ...elem.selectIds, option.id ];
          return elem;
        }
        elem.selectIds = elem.selectIds.filter(id => id !== option.id);
      }
      return elem;
    });

    this.searchCustomer({
      ...this.queryParams(),
      typeValues: this.filterTabs.find(t => t.field === "typeValues")?.selectIds.join(",") || undefined,
    }, true);

  }


  protected readonly truncatePillText = truncatePillText;
}
