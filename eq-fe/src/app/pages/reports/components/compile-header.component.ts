import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

export interface headerItem {
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
           class="flex items-center overflow-x-auto snap-x snap-mandatory scroll-smooth whitespace-nowrap no-scrollbar gap-2 px-2 pt-4">
        <span *ngFor="let item of items, index as i"
              [id]="item+i"
              class="whitespace-nowrap cursor-pointer select-none"
              [class.font-bold]="item === selectedItem"
              (click)="changeSelectedItem(item, i, scrollContainer)">
          {{ item }}
        </span>
        <span class="flex grow"></span>
      </div>
      <div class="flex items-baseline w-full gap-1 p-1">
        <div *ngFor="let item of items, index as i"
             class="grow rounded-full h-1 cursor-pointer"
             [ngClass]="getBarClasses(item)"
             (click)="changeSelectedItem(item, i, scrollContainer)">
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
export class CompileHeaderComponent {
  @Input({ required: false }) items: string[] = ['Diagnostica 1', 'Diagnostica 2', 'Diagnostica 3', 'Diagnostica TC', 'Diagnostica OPT'];
  /** ensure that such style has a <name> css class and a <icon-name> css class associated with it */
  @Input({ required: false }) componentStyle?: 'accent' | 'compile' | 'success' = 'accent';
  @Input({ required: false }) viewOnly: boolean = false;

  selectedItem: string = this.items[0];
  initialScrollWidth: number = 0;

  changeSelectedItem(item: string, index: number, container: HTMLElement): void {
    this.selectedItem = item;
    const tabElement = document.getElementById(item + index);

    if (!!tabElement && !!container) {
      //set the initial scroll width so we have a base for the padding
      if(!this.initialScrollWidth) {
        this.initialScrollWidth = container.scrollWidth;
      }

      // ensure the padding is positive
      const paddingRight = Math.max(container.offsetWidth - (this.initialScrollWidth - (tabElement.offsetLeft - container.offsetLeft - 18)), 0);
      // get the max padding from the old and the new padding (for the smooth animation in case of a 'go to previous item')
      container.style.paddingRight = Math.max((container.scrollWidth - this.initialScrollWidth), paddingRight) + 'px';
      // scroll to the element offset (and keep some of the previous visible [the value that is hardcoded])
      container.scrollTo({
        left: tabElement.offsetLeft - container.offsetLeft - 18,
        behavior: 'smooth'
      });
      // set the padding to the real value for avoiding overscroll after the scroll animation end (in this case is 300ms)
      setTimeout(() => {
        container.style.paddingRight = paddingRight + 'px';
      }, 300);
    }
  }

  getBarClasses(item: string): string[] {
    let classes: string[] = ['icon-'+this.componentStyle];

    if(this.selectedItem !== item) {
      classes.push('opacity-50');
    }

    if(this.selectedItem === item) {
      classes.push('shadow border border-white h-2');
    }

    return classes;
  }
}