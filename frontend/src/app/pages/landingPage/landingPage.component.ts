import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    template: `
    <div class="flex flex-col pt-5 pb-12 gap-5">
      <div class="text-center">
        <h2 class="text-2xl font-bold p-1">landionh page</h2>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-2">
        paragraph
      </div>
    </div>
  `,
    styles: [``],
    imports: [ CommonModule ]
})
export default class HomeComponent {

}
