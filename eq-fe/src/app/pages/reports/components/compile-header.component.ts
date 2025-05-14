import {
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

export interface HeaderItem {
  id: string;
  name: string;
  completed: boolean;
}

@Component({
  selector: "app-compile-header",
  standalone: true,
  template: `
    <div class="grid rounded bg-foreground shadow"
         [ngClass]="componentStyle">
      <div #scrollContainer
           class="flex items-center grow overflow-x-auto snap-x snap-mandatory scroll-smooth whitespace-nowrap no-scrollbar gap-2 px-2 pt-4">
        <span *ngFor="let item of items, index as i"
              [id]="item.id"
              class="whitespace-nowrap cursor-pointer select-none"
              [class.font-bold]="item.id === selectedItem?.id"
              (click)="changeSelectedItem(i)">
          {{ item.name }}
        </span>
        <span class="flex grow"></span>
      </div>
      <div class="flex items-baseline w-full gap-1 p-1">
        <div *ngFor="let item of items, index as i"
             class="grow rounded-full h-1 cursor-pointer"
             [ngClass]="getBarClasses(item)"
             (click)="changeSelectedItem(i)">
        </div>
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  styles: [``]
})
export class CompileHeaderComponent implements OnChanges {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  @Input({ required: false }) items: HeaderItem[] = [
    { id: '', name: 'Diagnostica 1', completed: false },
    { id: '', name: 'Diagnostica 2', completed: false },
    { id: '', name: 'Diagnostica 3', completed: false },
    { id: '', name: 'Diagnostica TC', completed: false },
    { id: '', name: 'Diagnostica OPT', completed: false }
  ];
  @Input({ required: false }) selectedItem?: HeaderItem = this.items.at(0);
  /** ensure that such style has a <name> css class and a <icon-name> css class associated with it */
  @Input({ required: false }) componentStyle?: 'accent' | 'compile' | 'success' = 'accent';
  @Input({ required: false }) viewOnly: boolean = false;

  @Output() headerClick: EventEmitter<number> = new EventEmitter<number>();

  initialScrollWidth: number = 0;

  changeSelectedItem(index: number): void {
    this.headerClick.emit(index);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedItem = changes["selectedItem"]?.currentValue;
    if(!!selectedItem) {
      this.updateScrollContainer(selectedItem.id)
    }
  }

  updateScrollContainer(tabElementId: string): void {
    const tabElement = document.getElementById(tabElementId);

    if (!!tabElement && !!this.scrollContainer.nativeElement) {
      //set the initial scroll width so we have a base for the padding
      if(!this.initialScrollWidth) {
        this.initialScrollWidth = this.scrollContainer.nativeElement.scrollWidth;
      }

      console.log(this.scrollContainer.nativeElement.offsetWidth)
      // ensure the padding is positive
      const paddingRight = Math.max(this.scrollContainer.nativeElement.offsetWidth - (this.initialScrollWidth - (tabElement.offsetLeft - this.scrollContainer.nativeElement.offsetLeft - 18)), 0);
      // get the max padding from the old and the new padding (for the smooth animation in case of a 'go to previous item')
      this.scrollContainer.nativeElement.style.paddingRight = Math.max((this.scrollContainer.nativeElement.scrollWidth - this.initialScrollWidth), paddingRight) + 'px';
      // scroll to the element offset (and keep some of the previous visible [the value that is hardcoded])
      this.scrollContainer.nativeElement.scrollTo({
        left: tabElement.offsetLeft - this.scrollContainer.nativeElement.offsetLeft - 18,
        behavior: 'smooth'
      });
      // set the padding to the real value for avoiding overscroll after the scroll animation end (in this case is 300ms)
      setTimeout(() => {
        this.scrollContainer.nativeElement.style.paddingRight = paddingRight + 'px';
      }, 300);
    }
  }

  getBarClasses(item: HeaderItem): string[] {
    let classes: string[] = ['icon-'+this.componentStyle];

    if(!item.completed && this.selectedItem?.id !== item.id) {
      classes.push('opacity-50');
    }

    if(this.selectedItem?.id === item.id) {
      classes.push('shadow border border-white h-2');
    }

    return classes;
  }
}