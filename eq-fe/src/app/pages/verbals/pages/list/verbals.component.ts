import {
  AfterViewInit,
  Component, effect,
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
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { of, Subject } from "rxjs";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Document, VerbalTable, PartialVerbal } from "../../../../models/Document";
import { PaginateDatasource, Sort, TableButton } from "../../../../models/Table";
import { toSignal } from "@angular/core/rxjs-interop";
import { selectRouteQueryParamParam } from "../../../../core/router/store/router.selectors";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { ModalComponent, ModalDialogData } from "../../../../components/modal/modal.component";
import * as VerbalsActions from "../../../verbals/store/actions/verbals.actions";
import { createSortArray } from "../../../../../utils/utils";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-verbals',
  standalone: true,
  template: `
    <div class="grid gap-3">
      <app-search [search]="search" />
      <div *ngIf="verbalPaginate$ | async as verbalPaginate else skeleton">
        <app-table [dataSource]="verbalPaginate"
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
      <div class="flex flex-col justify-center">{{ row?.name }}</div>
    </ng-template>
  `,
  styles: [``],
  imports: [ CommonModule, SearchComponent, TableComponent, TableSkeletonComponent, MatDialogModule, MatIconModule ]
})
export default class VerbalsComponent implements AfterViewInit, OnInit {
  @ViewChild("nameRow") nameRow: TemplateRef<any> | undefined;

  store: Store<AppState> = inject(Store);
  subject = new Subject();
  dialog = inject(MatDialog);
  verbalPaginate$ = of({ content: [] as Document[] } as PaginateDatasource<Document>);

  queryParams = toSignal(this.store.select(selectRouteQueryParamParam()));

  columns: any[] = [];
  displayedColumns: string[] = [];

  buttons: TableButton<PartialVerbal>[] = [
    { iconName: "delete", bgColor: "red", callback: elem => this.openDialog(elem) },
    { iconName: "edit", bgColor: "orange", callback: elem => this.store.dispatch(RouterActions.go({ path: [`verbals/${elem.id}`] })) },
    { iconName: "visibility", bgColor: "sky", callback: elem => this.store.dispatch(RouterActions.go({ path: [`verbals/${elem.id}/view`] })) }
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
          width: "15rem",
          sortable: true
        },
      ];
      this.displayedColumns = [...this.columns.map(c => c.columnDef), "actions"];
    })
  }

  ngOnInit(): void {

    if((this.queryParams() as VerbalTable)?.search) {
      this.search.setValue((this.queryParams() as VerbalTable).search!, { emitEvent: false })
    }

    this.search.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntil(this.subject)
    ).subscribe(res => {
      this.searchVerbal({
        ...this.queryParams(),
        search: res || undefined,
      }, true);
    });
  }

  openDialog(verbal: PartialVerbal) {
    const dialogRef: any = this.dialog.open(ModalComponent, {
      backdropClass: "blur-filter",
      data: <ModalDialogData> {
        title: "Conferma rimozione",
        content: `
          Si sta eliminando il fornitore ${verbal.name}.
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
      this.deleteVerbal(verbal);
    });
  }

  constructor() {
    // Questo effect viene triggerato ogni qual volta un dei signal presenti all'interno cambia di valore
    effect(() => {

      const params = {
        ...this.queryParams()
      } as VerbalTable;

      this.store.dispatch(
        VerbalsActions.loadVerbals({
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

  searchVerbal(payload: VerbalTable, resetPageIndex?: boolean): void {
    if(resetPageIndex) {
      payload = { ...payload, pageIndex: 0 };
    }

    this.store.dispatch(RouterActions.go({ path: ["verbals"], extras: { queryParams: payload } }));
  }

  private deleteVerbal(row: PartialVerbal) {
    this.store.dispatch(VerbalsActions.deleteVerbal({ id: row.id! }));
  }

  updatePaginator({ pageIndex, pageSize }: { pageIndex: number, pageSize: number }) {
    this.paginator.update(() => ({ pageIndex, pageSize }));
  }

  changePage(evt: number): void {
    this.searchVerbal({
      ...this.queryParams(),
      pageIndex: evt - 1
    });
  }

  changePageSize(evt: number): void {
    this.searchVerbal({
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
}
