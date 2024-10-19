import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {ApiService} from "./api-service/api-service.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ApiService]
})
export class AppComponent {
  title = 'sealights';
}
