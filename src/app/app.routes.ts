import {Routes} from '@angular/router';
import {AddPersonPageComponent} from "./pages/add-person-page/add-person-page.component";
import {ListOfPeoplePageComponent} from "./pages/list-of-people-page/list-of-people-page.component";

export const routes: Routes = [
  {path: 'add-person', component: AddPersonPageComponent},
  {path: 'list-of-people', component: ListOfPeoplePageComponent},
  {path: '', redirectTo: '/add-person', pathMatch: 'full'}, // Default route
  {path: '**', redirectTo: '/add-person'},
];
