import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CompileHeaderComponent } from "../../components/compile-header.component";
import { FillInContainerComponent } from "../../components/fill-in-container.component";
import { MeasurementCardComponent } from "../../components/measurement-card.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { FormBuilder, Validators } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { getRouterUrl } from "../../../../core/router/store/router.selectors";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { InputComponent } from "../../../../components/input/input.component";

@Component({
  selector: "app-compile-machine",
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <app-compile-header componentStyle="compile"/>
      <div class="flex flex-col gap-2">
        <div class="text-xl font-bold">INFORMAZIONI GENERALI</div>
        <div class="flex flex-col gap-2">
          <app-input class="grow" [formControl]="f.load" label="Carico" id="load" type="string" unitMeasure="mAmin/sett" />
          <app-input class="grow" [formControl]="f.phantom" label="Phantom" id="phantom" type="string" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-xl font-bold">COMPILAZIONI</div>
        <app-fill-in-container componentStyle="success" title="Condizioni di Irradiazione 1" (onClick)="compileReport()"/>
        <app-fill-in-container componentStyle="success" title="Condizioni di Irradiazione 2" (onClick)="compileReport()"/>
        <app-fill-in-container componentStyle="success" title="Condizioni di stallo" (onClick)="compileReport()"/>
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    CompileHeaderComponent,
    FillInContainerComponent,
    InputComponent,
  ],
  styles: [``]
})
export default class CompileMachinesComponent {
  store: Store<AppState> = inject(Store);
  fb = inject(FormBuilder);

  path = toSignal(this.store.select(getRouterUrl));

  productForm = this.fb.group({
    load: ["", Validators.required],
    phantom: ["", Validators.required]
  });

  get f() {
    return this.productForm.controls;
  }

  compileReport(): void {
    this.store.dispatch(RouterActions.go({ path: [`${this.path()}/measurements`] }));
  }
}