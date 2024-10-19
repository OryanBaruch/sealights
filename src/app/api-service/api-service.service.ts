import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {City, Country, Person} from "../../interfaces/interfaces";

@Injectable()
export class ApiService {

  private baseUrl = 'http://localhost:3000/api';  // Base URL for the API

  constructor(private http: HttpClient) {
  }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}/persons`);
  }

  // Create a new person
  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.baseUrl}/person`, person);
  }

  addCity(city: City): Observable<City> {
    return this.http.post<City>(`${this.baseUrl}/city`, city);
  }

  getCitiesByCountryId(countryId: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/cities/${countryId}`);
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/countries`);
  }
}
