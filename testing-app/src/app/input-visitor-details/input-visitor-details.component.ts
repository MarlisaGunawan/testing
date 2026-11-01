import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { ApiService } from '../shared/api.service';
import { errorMessage } from '../shared/error-message';
import { DEPARTMENTS, QueueTicket, Visitor, VISIT_TYPES } from '../shared/models';

@Component({
  selector: 'app-input-visitor-details',
  templateUrl: './input-visitor-details.component.html',
  styleUrls: ['./input-visitor-details.component.css']
})
export class InputVisitorDetailsComponent implements OnInit {
  @ViewChild('formDir') formDir: FormGroupDirective;

  form: FormGroup;
  departments = DEPARTMENTS;
  visitTypes = VISIT_TYPES;
  doctors: string[] = [];
  waitingQueue: QueueTicket[] = [];
  today = moment();
  saving = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.form = this.fb.group({
      queueNumber: [''],
      name: ['', Validators.required],
      idNumber: ['', Validators.pattern(/^\d{16}$/)],
      gender: [''],
      birthDate: [null],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{8,15}$/)]],
      email: ['', Validators.email],
      address: [''],
      city: [''],
      department: ['', Validators.required],
      doctor: [''],
      visitType: ['General'],
      complaint: [''],
      remark: ['']
    });

    // Doctor list depends on the chosen department.
    this.f.department.valueChanges.subscribe(name => {
      const dept = this.departments.find(d => d.name === name);
      this.doctors = dept ? dept.doctors : [];
      if (this.doctors.indexOf(this.f.doctor.value) < 0) {
        this.f.doctor.setValue('');
      }
    });

    // Coming from the queue page with ?queue=A005 pre-selects that number.
    const preselect = this.route.snapshot.queryParamMap.get('queue') || '';
    this.loadWaitingQueue(preselect);
  }

  loadWaitingQueue(select = '') {
    this.api.getTodayQueue('waiting').subscribe(
      list => {
        this.waitingQueue = list;
        if (select && list.some(q => q.queueNumber === select)) {
          this.f.queueNumber.setValue(select);
        }
      },
      err => this.snack(errorMessage(err), true)
    );
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack('Please complete the required fields.', true);
      return;
    }
    const value = this.form.value;
    const visitor: Visitor = {
      ...value,
      name: value.name.trim(),
      birthDate: value.birthDate ? moment(value.birthDate).format('YYYY-MM-DD') : undefined
    };

    this.saving = true;
    this.api.createVisitor(visitor).subscribe(
      saved => {
        this.saving = false;
        this.snack(`Visitor ${saved.name}${saved.queueNumber ? ' (' + saved.queueNumber + ')' : ''} saved.`);
        this.reset();
        this.loadWaitingQueue();
      },
      err => {
        this.saving = false;
        this.snack(errorMessage(err), true);
      }
    );
  }

  reset() {
    // resetForm also clears the "submitted" state so red errors disappear.
    this.formDir.resetForm({ queueNumber: '', visitType: 'General' });
  }

  private snack(message: string, error = false) {
    this.snackBar.open(message, 'Close', {
      duration: error ? 5000 : 3000,
      panelClass: error ? 'snack-error' : 'snack-success'
    });
  }
}
