import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CompileHeaderComponent } from "../../components/compile-header.component";
import { FillInContainerComponent } from "../../components/fill-in-container.component";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { FormBuilder } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { getRouterUrl } from "../../../../core/router/store/router.selectors";

@Component({
  selector: "app-compile-departments",
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <app-compile-header/>
      <div class="flex flex-col gap-2">
        <div class="text-xl font-bold">MACCHINE</div>
        <app-fill-in-container componentStyle="compile" title="Telecomandato Villa MOVIPLAN IC" (onClick)="compileReport()"/>
        <app-fill-in-container componentStyle="compile" title="Telecomandato Villa MOVIPLAN IC" (onClick)="compileReport()"/>
        <app-fill-in-container componentStyle="compile" title="Telecomandato Villa MOVIPLAN IC" (onClick)="compileReport()"/>
        <app-fill-in-container componentStyle="compile" title="Telecomandato Villa MOVIPLAN IC" (onClick)="compileReport()"/>
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    CompileHeaderComponent,
    FillInContainerComponent,
  ],
  styles: [``]
})
export default class CompileDepartmentsComponent {
  store: Store<AppState> = inject(Store);
  fb = inject(FormBuilder);

  path = toSignal(this.store.select(getRouterUrl));

  compileReport(): void {
    this.store.dispatch(RouterActions.go({ path: [`${this.path()}/67b88f0f8e203c19fgf5afb9`] }));
  }
}