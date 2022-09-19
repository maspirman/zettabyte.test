import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../shared/api.service';
import * as alertify from 'alertifyjs'

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  editdata: any;
  constructor(private builder: FormBuilder, private dialog: MatDialog, private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.id != '' && this.data.id != null) {
      this.api.GetCompanybycode(this.data.id).subscribe(response => {
        this.editdata = response;
        this.companyform.setValue({
          id: this.editdata.id, first_name: this.editdata.first_name, last_name: this.editdata.last_name,
          civility: this.editdata.civility, email: this.editdata.email, entity: this.editdata.entity, company_name: this.editdata.company.name, user_type: this.editdata.company.user_type, status: this.editdata.status
        });
      });
    }
  }

  companyform = this.builder.group({
    id: this.builder.control({ value: '', disabled: true }),
    first_name: this.builder.control('', Validators.required),
    last_name: this.builder.control('', Validators.required),
    civility: this.builder.control('', Validators.required),
    email: this.builder.control('', Validators.required),
    entity: this.builder.control('', Validators.required),
    company_name: this.builder.control('', Validators.required),
    user_type: this.builder.control('', Validators.required),
    status: this.builder.control(true),
  });

  SaveCompany() {
    if (this.companyform.valid) {
      const Editid = this.companyform.getRawValue().id;
      if (Editid != '' && Editid != null) {
        this.api.UpdateComapny(Editid, this.companyform.getRawValue()).subscribe(response => {
          this.closepopup();
          alertify.success("Updated successfully.")
        });
      } else {
        this.api.CreateComapny(this.companyform.value).subscribe(response => {
          this.closepopup();
          alertify.success("saved successfully.")
        });
      }
    }
  }

  closepopup() {
    this.dialog.closeAll();
  }

}
