import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { ApiService } from '../shared/api.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { errorMessage } from '../shared/error-message';
import { DEPARTMENTS, Visitor, VisitorQuery } from '../shared/models';

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.css']
})
export class VisitorListComponent implements OnInit {
  columns = ['createdAt', 'queueNumber', 'name', 'gender', 'age', 'phone', 'department',
    'doctor', 'visitType', 'complaint', 'actions'];
  departments = DEPARTMENTS;
  filters: FormGroup;

  visitors: Visitor[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  sort: Sort = { active: 'createdAt', direction: 'desc' };
  loading = false;
  exporting = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.filters = this.fb.group({ search: [''], department: [''], from: [null], to: [null] });
    this.load();
  }

  private buildQuery(): VisitorQuery {
    const f = this.filters.value;
    return {
      search: (f.search || '').trim(),
      department: f.department,
      from: f.from ? moment(f.from).format('YYYY-MM-DD') : '',
      to: f.to ? moment(f.to).format('YYYY-MM-DD') : '',
      sort: this.sort.active,
      order: this.sort.direction
    };
  }

  load() {
    this.loading = true;
    const query = { ...this.buildQuery(), page: this.pageIndex + 1, limit: this.pageSize };
    this.api.getVisitors(query).subscribe(
      res => {
        this.loading = false;
        this.visitors = res.items;
        this.total = res.total;
      },
      err => {
        this.loading = false;
        this.snack(errorMessage(err));
      }
    );
  }

  search() {
    this.pageIndex = 0;
    this.load();
  }

  clearFilters() {
    this.filters.reset({ search: '', department: '', from: null, to: null });
    this.search();
  }

  onPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  onSort(sort: Sort) {
    this.sort = sort;
    this.pageIndex = 0;
    this.load();
  }

  age(birthDate: string): string {
    return birthDate ? String(moment().diff(moment(birthDate), 'years')) : '-';
  }

  remove(v: Visitor) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete visitor', message: `Delete ${v.name}${v.queueNumber ? ' (' + v.queueNumber + ')' : ''}?`, confirmText: 'Delete' }
    }).afterClosed().subscribe(ok => {
      if (!ok) { return; }
      this.api.deleteVisitor(v._id).subscribe(
        () => {
          this.snackBar.open('Visitor deleted', 'Close', { duration: 3000, panelClass: 'snack-success' });
          if (this.visitors.length === 1 && this.pageIndex > 0) { this.pageIndex--; }
          this.load();
        },
        err => this.snack(errorMessage(err))
      );
    });
  }

  /** Downloads every visitor matching the current filters as a CSV file (opens in Excel). */
  exportCsv() {
    this.exporting = true;
    this.api.getVisitors({ ...this.buildQuery(), page: 1, limit: 1000 }).subscribe(
      res => {
        this.exporting = false;
        const header = ['Created Time', 'Queue', 'Name', 'NIK', 'Gender', 'Date of Birth', 'Phone', 'Email',
          'Address', 'City', 'Department', 'Doctor', 'Visit Type', 'Complaint', 'Remark'];
        const rows = res.items.map(v => [
          moment(v.createdAt).format('YYYY-MM-DD HH:mm'), v.queueNumber, v.name, v.idNumber, v.gender,
          v.birthDate ? moment(v.birthDate).format('YYYY-MM-DD') : '', v.phone, v.email, v.address, v.city,
          v.department, v.doctor, v.visitType, v.complaint, v.remark
        ]);
        const csv = [header, ...rows]
          .map(r => r.map(cell => '"' + String(cell == null ? '' : cell).replace(/"/g, '""') + '"').join(','))
          .join('\r\n');
        // BOM so Excel reads UTF-8 correctly.
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visitors-${moment().format('YYYYMMDD-HHmm')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
      err => {
        this.exporting = false;
        this.snack(errorMessage(err));
      }
    );
  }

  private snack(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000, panelClass: 'snack-error' });
  }
}
