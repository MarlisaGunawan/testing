import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { errorMessage } from '../shared/error-message';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  today = new Date();
  stats = { total: 0, waiting: 0, registered: 0 };
  apiError = '';

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.api.getTodayQueue().subscribe(
      list => {
        this.stats.total = list.length;
        this.stats.waiting = list.filter(q => q.status === 'waiting').length;
        this.stats.registered = list.filter(q => q.status === 'registered').length;
      },
      err => this.apiError = errorMessage(err)
    );
  }

  changePage(path) {
    this.router.navigate(['/' + path]);
  }

}
