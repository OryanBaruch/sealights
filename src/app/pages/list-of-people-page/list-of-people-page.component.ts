import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import {Person} from "../../../interfaces/interfaces";
import {ApiService} from "../../api-service/api-service.service";
import {AgGridAngular, AgGridModule} from 'ag-grid-angular';
import {MatButton} from "@angular/material/button";
import {ColDef} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

@Component({
  selector: 'app-list-of-people-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButton, AgGridAngular],
  templateUrl: './list-of-people-page.component.html',
  styleUrls: ['./list-of-people-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListOfPeoplePageComponent implements OnInit {
  private apiService = inject(ApiService);
  public personsData$: Observable<Person[]>;

  public columnDefs: ColDef[];

  ngOnInit(): void {
    this.columnDefs = this.generateColumnDefs();
    this.personsData$ = this.apiService.getPersons();
  }

  generateColumnDefs(): ColDef[] {
    const fields: { [key: string]: any } = {
      id: {headerName: 'ID', sortable: true},
      name: {headerName: 'Name', sortable: true},
      birthdate: {
        headerName: 'Birthdate',
        sortable: true,
        valueFormatter: this.dateFormatter
      },
      addresses: {
        headerName: 'Addresses Count',
        valueGetter: (params) => params.data.addresses.length,
        sortable: true
      }
    };

    return Object.entries(fields).map(([field, config]) => ({
      field,
      ...config
    }));
  }

  dateFormatter(params: any): string {
    const date = new Date(params.value);
    return date ? date.toLocaleDateString() : '';
  }

}
