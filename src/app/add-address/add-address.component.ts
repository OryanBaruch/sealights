import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AddCityDialogComponent} from '../add-city-dialog/add-city-dialog.component';
import {City, Country} from '../../interfaces/interfaces';
import {Observable, of, switchMap} from 'rxjs';
import {ApiService} from '../api-service/api-service.service';
import {BehaviorSubject} from 'rxjs';
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatCard, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatButton,
    MatIconButton,
    MatFormField,
    MatSelect,
    MatInput,
    MatCard,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    MatOption,
    MatCardTitle
  ],
})
export class AddAddressComponent implements OnInit {
  @Input() formArray: FormArray = this.fb.array([this.createAddressGroup()]);
  @Input() countries: Country[];

  private citiesSubjects: Map<number, BehaviorSubject<City[]>> = new Map();
  private citiesCache: Map<number, City[]> = new Map();
  public cities$: Observable<City[]> = of([]);
  private currentAddressIndex: number;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.initCitiesSubjects();
  }

  get addresses(): FormArray {
    return this.formArray;
  }

  private initCitiesSubjects(): void {
    this.citiesSubjects.set(0, new BehaviorSubject<City[]>([]));
  }

  // Address-related methods
  public addAddress(): void {
    const newIndex = this.addresses.length;
    this.addresses.push(this.createAddressGroup());
    this.addCitySubjectForIndex(newIndex);
  }

  public removeAddress(index: number): void {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
      this.reindexCitiesSubjects();
    }
  }

  private createAddressGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      countryId: [''],
      cityId: ['']
    });
  }

  // City-related methods
  private addCitySubjectForIndex(index: number): void {
    this.citiesSubjects.set(index, new BehaviorSubject<City[]>([]));
  }

  private reindexCitiesSubjects(): void {
    const updatedSubjects = new Map<number, BehaviorSubject<City[]>>();

    this.addresses.controls.forEach((addressControl, index) => {
      const countryId = addressControl.get('countryId')?.value;
      const cachedCities = this.citiesCache.get(countryId) || [];
      const subject = this.citiesSubjects.get(index) ?? new BehaviorSubject<City[]>([]);

      subject.next(cachedCities);
      updatedSubjects.set(index, subject);
    });

    this.citiesSubjects = updatedSubjects;
  }

  public onCountryChange(addressIndex: number): void {
    const countryValue = this.getCountryIdFromAddress(addressIndex);
    if (this.citiesCache.has(countryValue)) {
      this.updateCitiesFromCache(addressIndex, countryValue);
    } else {
      this.fetchAndCacheCitiesForCountry(addressIndex, countryValue);
    }
    this.resetCitySelectionForAddress(addressIndex);
  }

  private getCountryIdFromAddress(addressIndex: number): number {
    return this.addresses.at(addressIndex).get('countryId')?.value;
  }

  private updateCitiesFromCache(addressIndex: number, countryId: number): void {
    const cachedCities = this.citiesCache.get(countryId) || [];
    this.citiesSubjects.get(addressIndex)?.next(cachedCities);
  }

  private fetchAndCacheCitiesForCountry(addressIndex: number, countryId: number): void {
    this.getCitiesForCountry$(countryId).subscribe(cities => {
      this.citiesCache.set(countryId, cities);
      this.citiesSubjects.get(addressIndex)?.next(cities);
    });
  }

  private resetCitySelectionForAddress(addressIndex: number): void {
    this.addresses.at(addressIndex).get('cityId')?.reset();
  }

  private getCitiesForCountry$(countryId: number): Observable<City[]> {
    return this.apiService.getCitiesByCountryId(countryId);
  }

  public openAddCityDialog(addressIndex: number): void {
    const selectedCountry = this.getCountryIdFromAddress(addressIndex);
    if (selectedCountry) {
      const countryName = this.findCountryNameById(selectedCountry);

      const dialogRef = this.dialog.open(AddCityDialogComponent, {
        data: {countryName}
      });

      dialogRef.afterClosed().subscribe((cityName: string) => {
        if (cityName) {
          this.handleNewCity(cityName, selectedCountry, addressIndex);
        }
      });
    }
  }

  private handleNewCity(cityName: string, selectedCountry: number, addressIndex: number): void {
    const newCity: City = {
      id: this.generateRandomId(1000),
      name: cityName,
      countryId: selectedCountry
    };
    this.addCity(newCity, selectedCountry, addressIndex);
  }

  private addCity(city: City, selectedCountry: number, addressIndex: number): void {
    this.apiService.addCity(city).pipe(
      switchMap(() => this.getCitiesForCountry$(selectedCountry))
    ).subscribe({
      next: () => this.handleAddCitySuccess(city, selectedCountry, addressIndex),
      error: (error) => console.error('Error adding city or fetching cities:', error)
    });
  }

  private handleAddCitySuccess(city: City, selectedCountry: number, addressIndex: number): void {
    this.cacheNewCity(city, selectedCountry);
    this.updateCitiesSubjects(addressIndex, selectedCountry);
  }

  private cacheNewCity(city: City, countryId: number): void {
    const cachedCities = this.citiesCache.get(countryId) || [];
    cachedCities.push(city);
    this.citiesCache.set(countryId, cachedCities);
  }

  private updateCitiesSubjects(addressIndex: number, countryId: number): void {
    const cachedCities = this.citiesCache.get(countryId) || [];
    this.citiesSubjects.get(addressIndex)?.next(cachedCities);
    this.updateOtherAddressComponents(countryId);
  }

  private updateOtherAddressComponents(countryId: number): void {
    this.addresses.controls.forEach((addressControl, index) => {
      if (this.getCountryIdFromAddress(index) === countryId) {
        const cachedCities = this.citiesCache.get(countryId) || [];
        this.citiesSubjects.get(index)?.next(cachedCities);
      }
    });
  }

  private findCountryNameById(countryId: number): string {
    return this.countries.find(c => c.id === countryId)?.name || '';
  }

  // Utility methods
  private generateRandomId(max: number): number {
    return Math.floor(Math.random() * (max + 1));
  }

  public getAddressFormGroup(index: number): FormGroup {
    this.currentAddressIndex = index;
    this.cities$ = this.citiesSubjects.get(index)?.asObservable() || of([]);
    return this.formArray.at(index) as FormGroup;
  }
}
