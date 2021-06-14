import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Users } from '../model/users';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  
  displayedColumns: string[] = ['name', 'lastName','gender','options'];
  data: Users[] = [];
  isLoadingResults = true;
  dataSource = new MatTableDataSource(this.data);

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }
 

  ngOnInit(): void {
    this.api.getUsers()
    .subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
      this.dataSource = new MatTableDataSource(this.data);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

  deleteUser(id: any) {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}