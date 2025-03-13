import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";
import { generateRandomCode } from "../../../../../utils/utils";
import { InputComponent } from "../../../../components/input/input.component";
import { AppState } from "../../../../app.config";

@Component({
  selector: 'app-customer-address-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, MatSelectModule, MatDialogModule],
  template: `
    <div class="flex flex-col gap-2.5">
      <div [formGroup]="departmentFormGroup">
        
      </div>
    </div>
  `,
  styles: []
})
export class CustomerAddressModalComponent implements OnInit, OnDestroy {

  store: Store<AppState> = inject(Store);
  fb = inject(FormBuilder);
  subject = new Subject();

  // addressChanges$ = this.store.select(getCustomerAddressFormActiveChanges)
  //   .pipe(takeUntil(this.subject));
  updateAddress: boolean = false

  departmentFormGroup =  this.fb.group({
    id: [-1],
    code: [generateRandomCode()],
    name: ["", Validators.required],
    sources: [[{}]]
  });

  get f() {
    return this.departmentFormGroup.controls;
  }


  ngOnInit() {
  }

  updateAddressForm(): void {
    this.updateAddress = true;
  }

  ngOnDestroy() {
    this.departmentFormGroup.reset();
  }
}
