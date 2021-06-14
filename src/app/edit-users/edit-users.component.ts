import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit {

  usersForm!: FormGroup;
  addressForm!: FormGroup;
  phoneForm!: FormGroup;

  id = '';
  name = '';
  lastName = '';
  dateOfBirth: any = null;
  genderList = ['Feminino', 'Masculino', 'Outros'];
  idPhone = ''
  idAddress = ''
  isLoadingResults = false;

  
  zipCode = '';
  address = '';
  complement = '';
  district = '';
  locale = '';
  uf = '';
  country = '';

  ddd = '';
  number = '';

  userMessage = 'Salvar Usuário';
  userDisabled = false;

  isLinear = false;

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getUsersById(this.route.snapshot.params.id);

    this.usersForm = this.formBuilder.group({
      name : [null, Validators.required],
      lastName : [null, Validators.required],
      gender : [ null, Validators.required],
      dateOfBirth : [null, Validators.required],
      idPhone: [null, Validators.required],
      idAddress: [null, Validators.required]
    })

    this.addressForm = this.formBuilder.group({
      zipCode : [null, Validators.required],
      address : [null, Validators.required],
      complement : [ null, Validators.required],
      district : [null, Validators.required],
      locale : [null, Validators.required],
      uf : [null, Validators.required],
      country : [null, Validators.required],
    })

    this.phoneForm = this.formBuilder.group({
      ddd : [null, Validators.required],
      number : [null, Validators.required]
    })
  }

  getUsersById(id: any) {
    this.api.getUsersById(id).subscribe((data: any) => {
      this.id = data.id;
      this.usersForm.setValue({
        name: data.name,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        idPhone: data.phone.id,
        idAddress: data.address.id
      });
      this.getAddressById(data.address.id)
      this.getPhoneById(data.phone.id)
    });
  }

  getPhoneById(id: any) {
    this.api.getPhoneById(id).subscribe((data: any) => {
      this.idPhone = data.id
      this.phoneForm.setValue({
        ddd: data.ddd,
        number: data.number
      });
    });
  }

  getAddressById(id: any) {
    this.api.getAddressById(id).subscribe((data: any) => {
      this.idAddress = data.id;
      console.log(data)
      console.log(data.value)
      this.addressForm.setValue({
        zipCode : data.zipCode,
        address : data.address,
        complement : data.complement,
        district : data.district,
        locale : data.locale,
        uf : data.uf,
        country : data.country,
      });
    });
  }

  onUsersFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateUsers(this.id, this.usersForm.value)
      .subscribe((res: any) => {
          this.id = res.id;
          this.isLoadingResults = false;
          this.userMessage = 'Usuário criado'
          this.userDisabled = true
          //this.router.navigate(['/users-details', id]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
          
        });
  }

  onPhoneFormSubmit() {
    this.isLoadingResults = true;
    this.api.updatePhone(this.idPhone, this.phoneForm.value)
      .subscribe((res: any) => {
          this.isLoadingResults = false;
          console.log('id do usuáriono phone: ' + this.id)
          this.router.navigate(['/users-details', this.id]);
        }, (err: any) => {
          console.log(err);
          console.log('Deu erro registrando o phone')
          this.isLoadingResults = false;
        });
  }

  onAddressFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateAddress( this.idAddress, this.addressForm.value)
      .subscribe((res: any) => {
          this.isLoadingResults = false;
          console.log('id do usuário no address: ' + this.id)
          //this.router.navigate(['/users-details', id]);
        }, (err: any) => {
          console.log(err);
          console.log('Deu erro registrando o address')
          this.isLoadingResults = false;
        });
  }

  usersDetails() {
    this.router.navigate(['/users-details', this.id]);
  }

}
