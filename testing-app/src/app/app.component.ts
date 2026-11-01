import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'testing-app';
  hospitalName = environment.hospitalName;
  now = new Date();
  private timer: any;

  ngOnInit(): void {
    this.timer = setInterval(() => this.now = new Date(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
