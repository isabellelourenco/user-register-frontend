import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Phone } from '../model/phone';
import { Users } from '../model/users';
import { Address } from '../model/address';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.scss']
})
export class UsersDetailsComponent implements OnInit {

  users: Users = { id: null, name: '', lastName: '', gender: '', dateOfBirth: null };
  isLoadingResults = true;

  phone: Phone = {id: null, ddd: '', number: ''};

  address: Address = {id: null, zipCode:'', address:'', complement:'', district:'', locale:'', uf:'', country:''};

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getUsersDetails(this.route.snapshot.params.id);
  }

  getUsersDetails(id: string) {
    this.api.getUsersById(id)
      .subscribe((data: any) => {
        this.users = data;
        console.log(this.users);
        this.isLoadingResults = false;

        this.getPhoneDetails(data.phone.id)
        this.getAddressDetails(data.address.id)
      });
  }

  getPhoneDetails(id: any) {
    this.api.getPhoneById(id).subscribe((data: any) => {
      this.phone = data;
      console.log(this.phone);
      this.isLoadingResults = false;
    });
  }

  getAddressDetails(id: any) {
    this.api.getAddressById(id).subscribe((data: any) => {
      this.address = data;
      console.log(data)
      console.log(this.address);
      this.isLoadingResults = false;
    });
  }

  getReport(id: any) {
    this.api.getPDF(id)
    .subscribe(
      (data: Blob) => {
        var file = new Blob([data], { type: 'application/pdf' })
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL); 
        var a         = document.createElement('a');
        a.href        = fileURL; 
        a.target      = '_blank';
        a.download    = 'relatorio.pdf';
        document.body.appendChild(a);
        a.click();
      },
      (error) => {
        console.log('getPDF error: ',error);
      }
    );

    /*this.api.getReport(id).subscribe((data: any) => {
      var file = new Blob([data], { type: 'application/pdf' })
      var fileURL = URL.createObjectURL(file);

      window.open(fileURL); 
      var a         = document.createElement('a');
      a.href        = fileURL; 
      a.target      = '_blank';
      a.download    = 'bill.pdf';
      document.body.appendChild(a);
      a.click();*/
  }

  deleteUsers(id: any) {
    this.isLoadingResults = true;
    this.api.deleteUsers(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          this.router.navigate(['/users']);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

}
