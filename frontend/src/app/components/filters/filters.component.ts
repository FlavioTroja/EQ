import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input, OnChanges,
  Output, SimpleChanges, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { FilterElement } from "../../models/Filters";
import { VerticalScrollDirective } from "../../shared/directives/vertical-scroll.directive";
import { DateOptionsComponent } from "./addons/date-options.component";

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ReactiveFormsModule, FormsModule, VerticalScrollDirective, DateOptionsComponent ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('showUp', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(-3em)'}),
        animate('150ms'),
      ]),
      transition(':leave', [
        animate('150ms',
          style({opacity: 0, transform: 'translateY(-3em)'}),
        ),
      ])
    ]),
    trigger('iconRotation', [
      state('plus', style({ transform: 'rotate(0deg)' })),
      state('minus', style({ transform: 'rotate(45deg)' })),
      transition('plus => minus', animate('100ms')),
      transition('minus => plus', animate('100ms'))
    ]),
    trigger('appear', [
      transition(':enter', [
        style({opacity: 1}),
        animate('50ms'),
      ]),
      transition(':leave', [
        animate('150ms',
          style({opacity: 0}),
        ),
      ])
    ]),
  ],
  template: `
    <div class="flex-col rounded-full">
      <div class="flex flex-wrap gap-3.5" *ngIf="showFilter" [@showUp]="showFilter">
        <div *ngFor="let tab of filterTabs, index as i">
          <div class="bg-gray-300 border-2 rounded-full px-1.5 py-0.5 cursor-pointer" (click)="tab.onSelectedTab ? tab.onSelectedTab(tab) : null"
               [ngClass]="{'border-gray-600' : tab.selectIds.length > 0 || tab.popUp}"
          >
            <div class="flex">
              <mat-icon (click)="removeTargetFilter(tab.field, tab.iconName)" [@iconRotation]="tab.iconName" class="material-symbols-rounded">add</mat-icon>
              {{ tab.name }}
              <div *ngIf="tab.selectIds.length > 0">
                <div class="ml-1">
                  | {{ tab.selectIds.length }}
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overscroll-auto overflow-auto mt-1 rounded-md shadow-lg b-1.5 absolute z-[120]" [@appear]="tab.popUp" *ngIf="tab.popUp" appVerticalScroll>
            <div></div>
            <div class="sticky top-0 bg-white z-10 px-2" *ngIf="tab.searcher">
              <div class="relative w-full">
                <input type="text" class="shadow-md bg-foreground text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5"
                       [formControl]="tab.searchValue!"
                       #searchValue
                       placeholder="Cerca">

                <button type="button" class="absolute inset-y-0 end-0 flex items-center pe-3">
                  <mat-icon class="material-symbols-rounded">search</mat-icon>
                </button>
              </div>
            </div>
            <div class="p-2 max-h-80" *ngIf="!tab.datePicker">
              <div *ngFor="let option of tab.options, index as i">
                <label class="checkbox">
                  {{ option.name }}
                  <input type="checkbox" [value]="option.id" [(ngModel)]="option.checked" (click)="tab.onSelectOption ? tab.onSelectOption(tab.field, option) : null">

                  <span class="checkmark"></span>
                </label>
              </div>
            </div>

            <div class="p-2" *ngIf="tab.datePicker">
              <app-date-options
                [tabField]="tab.field"
                [options]="tab.options"
                [dateIntervalPicker]="tab.dateIntervalPicker"
                (onSelectInterval)="tab.onSelectOption ? tab.onSelectOption(tab.field, $event) : null"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class FiltersComponent implements OnChanges {
  @ViewChild("searchValue") searchValueRef: ElementRef<any> | undefined;

  @Input() showFilter: boolean = false;
  @Input({ required: true }) filterTabs: FilterElement[] = [];
  @Output() onRemoveFiltersFromSingleTab = new EventEmitter<string>();
  elementRef = inject(ElementRef);

  @HostListener("document:click", ['$event.target'])
  popDownOption(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    const isDatepicker = document.getElementsByClassName("cdk-overlay-pane mat-datepicker-popup").item(0);
    if(!clickedInside && !isDatepicker) {
      this.filterTabs.forEach(t => {

          t.popUp = false;
          t.iconName = "plus";

      });
    }
  }

  getOptionName(tab: FilterElement, id: number) {
    return tab.options.find(elem => elem.id === id)?.name || "";
  }

  removeTargetFilter(tabField: string, iconName: string) {
    if(iconName === "plus") {
      return;
    }
    this.onRemoveFiltersFromSingleTab.emit(tabField)
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => this.searchValueRef ? this.searchValueRef!.nativeElement.focus() : null, 0);
  }

}
