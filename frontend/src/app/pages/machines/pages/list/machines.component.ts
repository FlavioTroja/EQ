import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    effect,
    inject, OnInit,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { createSortArray } from "../../../../../utils/utils";
import { AppState } from "../../../../app.config";
import { ModalComponent, ModalDialogData } from "../../../../components/modal/modal.component";
import { SearchComponent } from "../../../../components/search/search.component";
import { TableSkeletonComponent } from "../../../../components/skeleton/table-skeleton.component";
import { TableComponent } from "../../../../components/table/table.component";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { selectRouteQueryParamParam } from "../../../../core/router/store/router.selectors";
import { getLabelFromMachineType, MachineTable, PartialMachine } from "../../../../models/Machine";
import { Sort, TableButton } from "../../../../models/Table";
import * as MachinesActions from "../../store/actions/machines.actions";
import { getMachinesPaginate } from "../../store/selectors/machines.selectors";

@Component({
  selector: 'app-machines',
  standalone: true,
  template: `
    <div class="grid gap-3">
      <app-search [search]="search" />
      <div *ngIf="machinePaginate$ | async as machinePaginate else skeleton">
        <app-table [dataSource]="machinePaginate"
                   [columns]="columns"
                   [displayedColumns]="displayedColumns"
                   [paginator]="paginator"
                   [buttons]="buttons"
                   (onPageChange)="changePage($event)"
                   (onPageSizeChange)="changePageSize($event)"
                   (onSortChange)="changeSort($event)"
        />
      </div>
    </div>
    
    <ng-template #skeleton>
      <app-table-skeleton [columns]="columns" />
    </ng-template>

    <ng-template #nameRow let-row>
      <div class="flex self-center gap-2">
        <div class="flex flex-col justify-center">{{ row?.name }}</div>
        <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 fit-content border" *ngIf="!!row.type">
          <mat-icon class="material-symbols-rounded">category</mat-icon>
          {{ getLabelFromMachineType[row.type] }}
        </div>
      </div>
    </ng-template>
  `,
  styles: [``],
  imports: [ CommonModule, SearchComponent, TableComponent, TableSkeletonComponent, MatDialogModule, MatIconModule ]
})
export default class MachinesComponent implements AfterViewInit, OnInit {
  @ViewChild("nameRow") nameRow: TemplateRef<any> | undefined;
  
  store: Store<AppState> = inject(Store);
  subject = new Subject();
  dialog = inject(MatDialog);
  machinePaginate$ = this.store.select(getMachinesPaginate)
  
  queryParams = toSignal(this.store.select(selectRouteQueryParamParam()));

  columns: any[] = [];
  displayedColumns: string[] = [];

  buttons: TableButton<PartialMachine>[] = [
    { iconName: "delete", bgColor: "red", callback: elem => this.openDialog(elem) },
    { iconName: "edit", bgColor: "orange", callback: elem => this.store.dispatch(RouterActions.go({ path: [`machines/${elem.id}`] })) },
    { iconName: "visibility", bgColor: "sky", callback: elem => this.store.dispatch(RouterActions.go({ path: [`machines/${elem.id}/view`] })) }
  ];

  paginator = signal({
      pageIndex: 0,
      pageSize: 10
  });

  sorter: WritableSignal<Sort[]> = signal([{ active: "createdAt", direction: "desc" }]);

  search = new FormControl("");

  ngAfterViewInit() {
    Promise.resolve(null).then(() => {
      this.columns = [
        {
          columnDef: 'name',
          header: 'Nome',
          template: this.nameRow,
          width: "35rem",
          sortable: true
        },
      ];
      this.displayedColumns = [...this.columns.map(c => c.columnDef), "actions"];
    })
  }

  ngOnInit(): void {

    if((this.queryParams() as MachineTable)?.search) {
      this.search.setValue((this.queryParams() as MachineTable).search!, { emitEvent: false })
    }

    this.search.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntil(this.subject)
    ).subscribe(res => {
      this.searchMachine({
        ...this.queryParams(),
        search: res || undefined,
      }, true);
    });
  }

  openDialog(machine: PartialMachine) {
    const dialogRef: any = this.dialog.open(ModalComponent, {
      backdropClass: "blur-filter",
      data: <ModalDialogData> {
        title: "Conferma rimozione",
        content: `
          Si sta eliminando il fornitore ${machine.name}.
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
      this.deleteMachine(machine);
    });
  }

  constructor() {
    // Questo effect viene triggerato ogni qual volta un dei signal presenti all'interno cambia di valore
    effect(() => {

      const params = {
        ...this.queryParams()
      } as MachineTable;

      this.store.dispatch(
        MachinesActions.loadMachines({
          query: {
            query: {
              value: params.search || "",
            },
            options: {
              populate: 'address',
              limit: +params.pageSize! || 10,
              page: params.pageIndex ? (+params.pageIndex + 1) : 1,
              sort: createSortArray(this.sorter())
            }
          }
        })
      );

      this.updatePaginator({
        pageSize: +params.pageSize! || 10,
        pageIndex: params.pageIndex ? (+params.pageIndex) : 0,
      });
    }, { allowSignalWrites: true })
  }

  searchMachine(payload: MachineTable, resetPageIndex?: boolean): void {
    if(resetPageIndex) {
      payload = { ...payload, pageIndex: 0 };
    }

    this.store.dispatch(RouterActions.go({ path: ["machines"], extras: { queryParams: payload } }));
  }

  private deleteMachine(row: PartialMachine) {
    this.store.dispatch(MachinesActions.deleteMachine({ id: row.id! }));
  }

  updatePaginator({ pageIndex, pageSize }: { pageIndex: number, pageSize: number }) {
    this.paginator.update(() => ({ pageIndex, pageSize }));
  }

  changePage(evt: number): void {
    this.searchMachine({
      ...this.queryParams(),
      pageIndex: evt - 1
    });
  }

  changePageSize(evt: number): void {
    this.searchMachine({
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

  protected readonly getLabelFromMachineType = getLabelFromMachineType;
}
