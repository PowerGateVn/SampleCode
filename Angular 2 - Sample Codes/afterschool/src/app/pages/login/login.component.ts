import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DbService } from '../../services/db.service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public dbService: DbService, private _route: Router) {
  }

  ngOnInit() {
  }

  username: string = '';
  password: string = '';
  message: string = '';

  signUp() {
    this.dbService.insert('admin', {
      password: Md5.hashStr("123123"),
      username: "tuanvu"
    });
  }

  login() {
    this.dbService.select('admin').on('value', snapshot => {
      for (let item in snapshot.val()) {
        let message: string = '';
        if (snapshot.val()[item].username === this.username && snapshot.val()[item].password === Md5.hashStr(this.password)) {
          localStorage.setItem("adminUser", Md5.hashStr(this.username + this.password).toString());
          message = '';
          this._route.navigate(['status']);
        } else if (this.username === "") {
          this.message = "Username is required!";
        } else if (this.password === "") {
          this.message = "Password is required!";
        } else if (this.password.length < 6) {
          this.message = "Password must be at least 6 characters!";
        } else {
          this.message = "Username or password is not correct!";
        }
      }
    });
  }

}
