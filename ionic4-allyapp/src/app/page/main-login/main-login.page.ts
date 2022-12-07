import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { validateEmail } from 'src/app/services/custom-validate.service';
import { Router, ActivatedRoute } from '@angular/router';

import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { messageError, responseMessage } from 'src/app/constants/message';
import { grantType, expiresLogin, userStatus } from 'src/app/constants/config';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { AuthInfo } from 'src/app/interfaces/auth';
import { localstorageName } from 'src/app/constants/config';
import { LoadingController, Events } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-main-login',
  templateUrl: './main-login.page.html',
  styleUrls: ['./main-login.page.scss'],
})
export class MainLoginPage implements OnInit {
  formLogin: FormGroup;
  hideInputEmail: any = false;
  hideInputPassword: any = true;
  displayBtnConnect: any = false;
  messageErr: string;
  messageInvalid: string;

  passwordType: any = 'password';
  passwordIcon: any = 'eye-off';

  AuthInfo: AuthInfo[];
  disableClickForgotPassword = false;
  messageSuccess: string;
  showSignIn: any = true;
  messageInactive: string;


  constructor(private fb: FormBuilder, private router: Router,
              private authService: AuthService, private events: Events,
              public apiService: ApiService, public loadingController: LoadingController,
              private route: ActivatedRoute, public loadingService: LoadingService,
              private googlePlus: GooglePlus
  ) { }

  ngOnInit() {
    this.initForm();
    this.onChanges();
  }

  initForm() {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, validateEmail]],
      password: ['', [Validators.required]]
    });
  }

  onChanges() {
    if (!this.hideInputEmail && this.hideInputPassword) {
      this.formLogin.get('email').valueChanges.subscribe(val => {
        this.messageErr = '';
        const errRequired = this.formLogin.get('email').hasError('required');
        const errIncorrectEmail = this.formLogin.get('email').hasError('validateEmail');
        if (val.length !== 0) {
          this.messageInvalid = '';
          this.messageSuccess = '';
        }
        if (!errRequired && !errIncorrectEmail) {
          this.displayBtnConnect = true;
        } else {
          this.displayBtnConnect = false;
          if (errRequired) {
            this.messageErr = messageError.required;
          }
          if (errIncorrectEmail) {
            this.messageErr = messageError.formatEmail;
          }
        }
      });
    }
    if (this.hideInputEmail && !this.hideInputPassword) {
      this.formLogin.get('password').valueChanges.subscribe(val => {
        this.messageErr = '';
        const errRequired = this.formLogin.get('password').hasError('required');
        if (!errRequired || val.length !== 0) {
          this.displayBtnConnect = true;
          this.messageInvalid = '';
        } else {
          this.displayBtnConnect = false;
          this.messageErr = messageError.requiredPassword;
        }
      });
    }
    // if (!this.hideInputEmail && !this.hideInputPassword) {
    //   this.formLogin.get('email').valueChanges.subscribe(val => {
    //     const errRequired = this.formLogin.get('email').hasError('required');
    //     const errIncorrectEmail = this.formLogin.get('email').hasError('validateEmail');

    //     this.formLogin.get('password').valueChanges.subscribe(value => {
    //       if (!errRequired && !errIncorrectEmail && (value.length !== 0 )) {
    //         this.displayBtnConnect = true;
    //       } else {
    //         this.messageErr = '';
    //         this.displayBtnConnect = false;
    //       }
    //     });
    //   });
    // }
  }

  SignIn() {
    this.showSignIn = false;
    this.messageInactive = '';
  }

  nextPassword() {
    this.hideInputPassword = false;
    this.hideInputEmail = true;
    this.displayBtnConnect = false;
    this.messageSuccess = '';
    this.messageInvalid = '';
    this.onChanges();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async login() {
    const error = this.formLogin.invalid;
    if (error) {
      return;
    } else {
      this.loadingService.showLoading();
      const value = {
        grant_type: grantType.password,
        email: this.formLogin.get('email').value,
        password: this.formLogin.get('password').value
      };
      await this.authService.getAccessToken(value)
        .subscribe((result: any) => {
          const showLoading = true;
          this.gotoHomePage(showLoading);
        }, err => {
          if (err.error.error == userStatus.userInactive) {
            this.gotoSignIn();
            this.messageInactive = responseMessage.messageInactive;
          } else {
            this.goToStepEmail();
            this.messageInvalid = messageError.invalid;
          }
          this.loadingService.hideLoading();
        });
    }
  }

  gotoSignIn() {
    this.showSignIn = true;
    this.hideInputPassword = true;
    this.hideInputEmail = false;
    this.formLogin.patchValue({email: '', password: '' });
    this.messageErr = '';
  }

  async gotoHomePage(loading) {
    await this.apiService.prepareUserInfo();
    this.router.navigate(['/tabs/tab1'], {queryParams : { dontNeedPrepareUserInfo: true }});
    // console.log('gotoHomePage');
    loading && this.loadingService.hideLoading();
  }

  goToStepEmail() {
    this.hideInputEmail = false;
    this.hideInputPassword = true;
    this.formLogin.patchValue({ password: '' });
    this.messageErr = '';
    this.displayBtnConnect = true;
  }
  forgotPassword() {
    const email = this.formLogin.get('email').value;
    if (!email) { return; }
    this.disableClickForgotPassword = true;
    this.authService.forgotPassword(email).subscribe(
      (res) => {
        console.log('HTTP response', res);
        this.goToStepEmail();
        this.messageSuccess = responseMessage.forgotPasswordSuccess;
      },
      (err) => {
        this.disableClickForgotPassword = false;
        console.log('HTTP Error', err);
        const { error } = err;
        this.goToStepEmail();
        this.messageInvalid = error && error.message ? error.message : responseMessage.forgotPasswordError;
      },
      () => {
        this.disableClickForgotPassword = false;
        console.log('HTTP request completed.');
      });
  }
  signInWithGoogle() {
    this.googlePlus.login({
      offline: true
    })
      .then(res => {
        alert('sucess:' + JSON.stringify(res));
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        alert('err: ' + JSON.stringify(err));
      });
  }
}
