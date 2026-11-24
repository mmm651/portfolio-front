import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardHeader } from '../shared/dashboard-header/dashboard-header';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, DashboardHeader],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
