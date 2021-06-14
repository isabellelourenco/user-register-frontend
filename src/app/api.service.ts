import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Users } from './model/users';
import { Address } from './model/address';
import { Phone } from './model/phone';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${apiUrl}/user/list/`)
      .pipe(
        tap(users => console.log('fetched users')),
        catchError(this.handleError('getUsers', []))
      );
  }

  getUsersById(id: string): Observable<Users> {
    const url = `${apiUrl}/user/details/${id}`;
    return this.http.get<Users>(url).pipe(
      tap(_ => console.log(`fetched users id=${id}`)),
      catchError(this.handleError<Users>(`getUsersById id=${id}`))
    );
  }

  getPhoneById(id: string): Observable<Phone> {
    console.log("CHEGOU NO SERVICE PHONEID: " + id)
    const url = `/api/phone/details/${id}`;
    return this.http.get<Phone>(url).pipe(
      tap(_ => console.log(`fetched Phone id=${id}`)),
      catchError(this.handleError<Phone>(`getPhoneById id=${id}`))
    );
  }

  getAddressById(id: string): Observable<Address> {
    console.log("CHEGOU NO SERVICE ADDRESSID: " + id)
    const url = `/api/address/details/${id}`;
    return this.http.get<Address>(url).pipe(
      tap(_ => console.log(`fetched address id=${id}`)),
      catchError(this.handleError<Address>(`getAddressById id=${id}`))
    );
  }

  addUsers(users: Users): Observable<Users> {
    const url = `${apiUrl}/user/register`;
    return this.http.post<Users>(url, users, httpOptions).pipe(
      tap((c: Users) => console.log(`added users w/ id=${c.id}`)),
      catchError(this.handleError<Users>('addUsers'))
    );
  }

  updateUsers(id: string, users: Users): Observable<any> {
    const url = `${apiUrl}/user/update/${id}`;
    return this.http.put(url, users, httpOptions).pipe(
      tap(_ => console.log(`updated users id=${id}`)),
      catchError(this.handleError<any>('updateUsers'))
    );
  }

  updatePhone(id: string, phone: Phone): Observable<any> {
    const url = `${apiUrl}/phone/update/${id}`;
    return this.http.put(url, phone, httpOptions).pipe(
      tap(_ => console.log(`updated phone id=${id}`)),
      catchError(this.handleError<any>('updatePhone'))
    );
  }

  updateAddress(id: string, address: Address): Observable<any> {
    const url = `${apiUrl}/address/update/${id}`;
    return this.http.put(url, address, httpOptions).pipe(
      tap(_ => console.log(`updated address id=${id}`)),
      catchError(this.handleError<any>('updateAddress'))
    );
  }

  deleteUsers(id: string): Observable<Users> {
    const url = `${apiUrl}/user/delete/${id}`;
    return this.http.delete<Users>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted users id=${id}`)),
      catchError(this.handleError<Users>('deleteUsers'))
    );
  }

  addAddress(address: Address, userId: string): Observable<Address> {
    console.log('CHEGOU NO ADDADDRESS ' + address.zipCode)
    const url = `${apiUrl}/address/register/${userId}/${address.zipCode}`;
    return this.http.post<Address>(url, address, httpOptions).pipe(
      tap((c: Address) => console.log(`added users w/ id=${c.id}`)),
      catchError(this.handleError<Address>('addAddress'))
    );
  }

  addPhone(phone: Phone, userId: string): Observable<Phone> {
    const url = `${apiUrl}/phone/register/${userId}`;
    return this.http.post<Phone>(url, phone, httpOptions).pipe(
      tap((c: Phone) => console.log(`added users w/ id=${c.id}`)),
      catchError(this.handleError<Phone>('addPhone'))
    );
  }

  getPDF(id : string): Observable<Blob>
     {
         console.log("CHEGOU NO REPORT: " + id)
         const url = `/api/user/get-file/${id}`;

         const headers = new HttpHeaders({ 'Content-Type': 'application/json', responseType : 'blob'});

         return this.http.get<Blob>(url, { headers : headers,responseType : 
         'blob' as 'json'});
     }

  /*getReport(id: string): Observable<Users> {
    console.log("CHEGOU NO REPORT: " + id)
    const url = `/api/user/get-file/${id}`;
    return this.http.get<Users>(url);
  }*/


}
