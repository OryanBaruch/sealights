import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {MatCard, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDialog} from "@angular/material/dialog";
import {Observable, of} from "rxjs";
import {Country, Person} from "../../../interfaces/interfaces";
import {ApiService} from "../../api-service/api-service.service";
import {HttpClientModule} from "@angular/common/http";
import {AddAddressComponent} from "../../add-address/add-address.component";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";

@Component({
  selector: 'app-add-person-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatIcon,
    HttpClientModule,
    AddAddressComponent,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './add-person-page.component.html',
  styleUrl: './add-person-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPersonPageComponent implements OnInit {
  addPersonForm: FormGroup;
  countries$: Observable<Country[]> = of([])
  countryId: number;

  constructor(
    private fb: FormBuilder, private dialog: MatDialog,
    private apiService: ApiService,
  ) {
    this.addPersonForm = this.fb.group({
      name: ['', Validators.required],
      birthdate: [''],
      addresses: this.fb.array([this.createAddressGroup()])
    });
  }

  ngOnInit(): void {
    this.countries$ = this.apiService.getCountries()
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      countryId: [''],
      cityId: ['']
    });
  }

  get addresses(): FormArray {
    return this.addPersonForm.get('addresses') as FormArray;
  }

  isFormValid(): boolean {
    const userNameValid = this.addPersonForm.get('name')?.valid;
    const addressesArrayValid = this.addPersonForm.get('addresses').valid;
    return userNameValid && addressesArrayValid;
  }

  onSubmit(): void {
    if (this.addPersonForm.valid) {
      const formData = {...this.addPersonForm.value, id: 5};

      if (formData.birthdate) {
        formData.birthdate = this.formatDate(formData.birthdate);
      }
      this.createPerson$(formData)
    }
    this.addPersonForm.reset();
  }

  private createPerson$(person: Person): void {
    this.apiService.createPerson(person).subscribe()
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
