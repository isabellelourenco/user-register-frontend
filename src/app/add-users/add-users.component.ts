import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  usersForm!: FormGroup;
  addressForm!: FormGroup;
  phoneForm!: FormGroup;

  name = '';
  lastName = '';
  dateOfBirth: any = null;
  genderList = ['Feminino', 'Masculino','Outros'];
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
  id = '';

  isLinear = false;
  
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.usersForm = this.formBuilder.group({
      name : [null, Validators.required],
      lastName : [null, Validators.required],
      gender : [ null, Validators.required],
      dateOfBirth : [null, Validators.required]
    });

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

  onUsersFormSubmit() {
    this.isLoadingResults = true;
    console.log('USUARIO ADICIONADO' + this.usersForm.value)
    this.api.addUsers(this.usersForm.value)
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
    this.api.addPhone(this.phoneForm.value, this.id)
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
    this.api.addAddress(this.addressForm.value, this.id)
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

}
