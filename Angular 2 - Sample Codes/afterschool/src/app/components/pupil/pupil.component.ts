import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db.service';
import { UploadService } from '../../services/upload.service';
import { DatabaseService } from '../../services/database.service';
import { CommonService } from '../../services/common.service';
import { Upload } from '../../services/upload';
import { Md5 } from 'ts-md5/dist/md5';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
import * as constant from '../../constants/constant';

@Component({
  selector: 'app-pupil',
  templateUrl: './pupil.component.html',
  styleUrls: ['./pupil.component.scss']
})
export class PupilComponent implements OnInit {

  selectedFiles: FileList;
  currentUpload: Upload;
  msgAvatar: string = '';
  arr_url_avatar = [];

  file: any;

  constructor(
    public dbService: DbService,
    public uploadService: UploadService,
    public databaseService: DatabaseService,
    public commonService: CommonService
  ) {
    this.loading = true;
    this.getPupil();
  }

  loading: boolean;

  ngOnInit() {
  }

  reset() {
    this.pupils = [];
    this.formMsg = "";
    this.formMsgValid = "";
    this.getPupil();
    this.loading = false;
  }

  isPhoneNumber(phone_number) {
    return !/^\d+$/.test(phone_number.split(" ").join(""));
  }

  resetFormAddPupil() {
    this.id = '';
    this.formMsg = '';
    this.first_name = '';
    this.last_name = '';
    this.location = '';
    this.tutor = '';
    this.allergies = '';
    this.date_of_birth = '';
    this.home_address = '';
    this.father_mobile = '';
    this.mother_mobile = '';
    this.msgAvatar = '';
  }

  pupils = [];
  getPupil() {
    this.dbService.select('pupils').on('value', res => {
      var items = res.val();
      this.loading = false;
      for (let key in items) {
        items[key].$key = key
        this.pupils.push(items[key]);
      }
    });
  }

  formMsg: string = '';
  formMsgValid: string = "";
  id: string = '';
  first_name: string = '';
  last_name: string = '';
  location: string = '';
  tutor: string = '';
  allergies: string = '';
  date_of_birth: string = '';
  home_address: string = '';
  father_mobile: string = '';
  mother_mobile: string = '';

  addPupil() {
    // Reset message alert & selectedFiles
    this.msgAvatar = '';

    let flag_id: boolean;
    this.pupils.forEach(element => {
      if (parseInt(this.id) === parseInt(element.id)) {
        flag_id = true;
        this.formMsgValid = "";
        this.formMsg = "Duplicated ID!";
      }
    });

    if (!this.id) {
      this.formMsg = constant.MSG_ID_REQUIRED;
      this.formMsgValid = '';
    } else if (!/^\d+$/.test(this.id)) {
      this.formMsg = constant.MSG_ID_NUMBER;
      this.formMsgValid = '';
    } else if (flag_id) {
      this.formMsg = constant.MSG_ID_DUPLICATED;
      this.formMsgValid = '';
    } else if (!this.home_address) {
      this.formMsg = constant.MSG_ADDRESS_REQUIRED;
      this.formMsgValid = '';
    } else if (!this.first_name) {
      this.formMsg = constant.MSG_FIRST_NAME_REQUIRED;
      this.formMsgValid = '';
    } else if (!this.last_name) {
      this.formMsg = constant.MSG_LAST_NAME_REQUIRED;
      this.formMsgValid = '';
    } else if (!this.location) {
      this.formMsg = constant.MSG_LOCATION_REQUIRED;
      this.formMsgValid = '';
    } else if (!this.tutor) {
      this.formMsg = constant.MSG_TUTOR_REQUIRED;
      this.formMsgValid = '';
    } else if (!this.allergies) {
      this.formMsg = constant.MSG_ALLERGIES_REQUIRED;
      this.formMsgValid = '';
    } else if (!this.date_of_birth) {
      this.formMsg = constant.MSG_BIRTHDAY_REQUIRED;
      this.formMsgValid = '';
    } else if (!this.father_mobile) {
      this.formMsg = constant.MSG_FATHER_MOBILE_REQUIRED;
      this.formMsgValid = '';
    } else if (this.isPhoneNumber(this.father_mobile)) {
      this.formMsg = constant.MSG_FATHER_MOBILE_NUMBER;
      this.formMsgValid = '';
    } else if (!this.mother_mobile) {
      this.formMsg = constant.MSG_MOTHER_MOBILE_REQUIRED;
      this.formMsgValid = '';
    } else if (this.isPhoneNumber(this.mother_mobile)) {
      this.formMsg = constant.MSG_MOTHER_MOBILE_NUMBER;
      this.formMsgValid = '';
    } else {
      let flag = true;
      this.pupils.forEach(element => {
        if (parseInt(this.id) === parseInt(element.id)) {
          this.formMsgValid = "";
          this.formMsg = "Duplicated ID!";
          this.loading = false;
          flag = false;
          return false;
        }
      });

      if (flag) {
        if (this.addAvatar){
          let uploadTask = this.uploadService.insertData(this.addAvatar);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snap => {
          }, error => {
            this.formMsgValid = "";
            this.formMsg = constant.MSG_ERR_UPLOAD;
          }, () => {
            var downloadURL = uploadTask.snapshot.downloadURL;
            this.dbService.insert('pupils', {
              id: parseInt(this.id),
              first_name: this.first_name,
              last_name: this.last_name,
              location: this.location,
              tutor: this.tutor,
              allergies: this.allergies,
              date_of_birth: this.date_of_birth,
              home_address: this.home_address,
              father_mobile: this.father_mobile,
              mother_mobile: this.mother_mobile,
              avatar_name: this.addAvatar.name,
              avatar_url: downloadURL
            }).then(() => {
              this.formMsg = "";
              this.formMsgValid = "Successfully added!";
              setTimeout(() => {
                this.loading = false;
                this.showModal = false;
                this.reset();
                this.resetFormAddPupil();
              }, 1500);
            });
            return undefined;
          });
        } else {
          this.dbService.insert('pupils', {
            id: parseInt(this.id),
            first_name: this.first_name,
            last_name: this.last_name,
            location: this.location,
            tutor: this.tutor,
            allergies: this.allergies,
            date_of_birth: this.date_of_birth,
            home_address: this.home_address,
            father_mobile: this.father_mobile,
            mother_mobile: this.mother_mobile,
            avatar_name: '',
            avatar_url: '',
          }).then(() => {
            this.formMsg = "";
            this.formMsgValid = "Successfully added!";
            setTimeout(() => {
              this.loading = false;
              this.showModal = false;
              this.reset();
              this.resetFormAddPupil();
            }, 1500);
          });
        }
      }
    }
  }

  deletePupil($key) {
    let allow = confirm(constant.CONFIRM_DELETE_PUPIL);
    if (allow == true) {
      this.dbService.delete('/pupils', $key).then(() => {
        alert(constant.MSG_DELETE_SUCCESS);
      });
      this.reset();
    }
  }

  editMode: boolean = false;
  showModalUpdate: boolean = false;
  pupilItem = {
    $key: '',
    id: '',
    home_address: '',
    first_name: '',
    last_name: '',
    location: '',
    tutor: '',
    allergies: '',
    date_of_birth: '',
    father_mobile: '',
    mother_mobile: '',
    avatar_name: '',
    avatar_url: ''
  }

  tmp_id: any;
  tmp_avatar_name: any;
  openModalUpdatePupil($key) {
    this.showModalUpdate = !this.showModalUpdate;
    this.dbService.selectByID('pupils', $key).on('value', res => {
      this.pupilItem = {
        $key: $key,
        id: res.val().id,
        home_address: res.val().home_address,
        first_name: res.val().first_name,
        last_name: res.val().last_name,
        location: res.val().location,
        tutor: res.val().tutor,
        allergies: res.val().allergies,
        date_of_birth: res.val().date_of_birth,
        father_mobile: res.val().father_mobile,
        mother_mobile: res.val().mother_mobile,
        avatar_name: res.val().avatar_name,
        avatar_url: res.val().avatar_url,
      };
    });
    this.tmp_id = this.pupilItem.id;
    this.tmp_avatar_name = this.pupilItem.avatar_name;
  }

  updatePupil($key) {
    // Reset message alert & selectedFiles
    this.msgAvatar = '';
    let flag = true;
    this.pupils.forEach(element => {
      if (parseInt(this.pupilItem.id) === parseInt(element.id) && (parseInt(this.pupilItem.id) !== this.tmp_id)) {
        this.formMsgValid = "";
        this.formMsg = "Duplicated ID!";
        flag = false;
      } else if (this.file) {
        if ((this.file.name === element.avatar_name) && (this.tmp_avatar_name !== this.file.name)) {
          this.formMsgValid = "";
          this.formMsg = constant.MSG_FILE_EXIST;
          flag = false;
        }
      }
    });

    if (flag) {
      if (!this.pupilItem.id) {
        this.formMsg = constant.MSG_ID_REQUIRED;
        this.formMsgValid = '';
      } else if (!/^\d+$/.test(this.pupilItem.id)) {
        this.formMsg = constant.MSG_ID_NUMBER;
        this.formMsgValid = '';
      } else if (!this.pupilItem.home_address) {
        this.formMsg = constant.MSG_ADDRESS_REQUIRED;
        this.formMsgValid = '';
      } else if (!this.pupilItem.first_name) {
        this.formMsg = constant.MSG_FIRST_NAME_REQUIRED;
        this.formMsgValid = '';
      } else if (!this.pupilItem.last_name) {
        this.formMsg = constant.MSG_LAST_NAME_REQUIRED;
        this.formMsgValid = '';
      } else if (!this.pupilItem.location) {
        this.formMsg = constant.MSG_LOCATION_REQUIRED;
        this.formMsgValid = '';
      } else if (!this.pupilItem.tutor) {
        this.formMsg = constant.MSG_TUTOR_REQUIRED;
        this.formMsgValid = '';
      } else if (!this.pupilItem.allergies) {
        this.formMsg = constant.MSG_ALLERGIES_REQUIRED;
        this.formMsgValid = '';
      } else if (!this.pupilItem.date_of_birth) {
        this.formMsg = constant.MSG_BIRTHDAY_REQUIRED;
        this.formMsgValid = '';
      } else if (!this.pupilItem.father_mobile) {
        this.formMsg = constant.MSG_FATHER_MOBILE_REQUIRED;
        this.formMsgValid = '';
      } else if (this.isPhoneNumber(this.pupilItem.father_mobile)) {
        this.formMsg = constant.MSG_FATHER_MOBILE_NUMBER;
        this.formMsgValid = '';
      } else if (!this.pupilItem.mother_mobile) {
        this.formMsg = constant.MSG_MOTHER_MOBILE_REQUIRED;
        this.formMsgValid = '';
      } else if (this.isPhoneNumber(this.pupilItem.mother_mobile)) {
        this.formMsg = constant.MSG_MOTHER_MOBILE_NUMBER;
        this.formMsgValid = '';
      } else {
        if (this.file){
          let uploadTask = this.uploadService.insertData(this.file);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snap => {
          }, error => {
            this.formMsgValid = "";
            this.formMsg = constant.MSG_ERR_UPLOAD;
          }, () => {
            var downloadURL = uploadTask.snapshot.downloadURL;
            this.dbService.update('pupils', $key, {
              id: parseInt(this.pupilItem.id),
              home_address: this.pupilItem.home_address,
              first_name: this.pupilItem.first_name,
              last_name: this.pupilItem.last_name,
              location: this.pupilItem.location,
              tutor: this.pupilItem.tutor,
              allergies: this.pupilItem.allergies,
              date_of_birth: this.pupilItem.date_of_birth,
              father_mobile: this.pupilItem.father_mobile,
              mother_mobile: this.pupilItem.mother_mobile,
              avatar_name: this.file.name,
              avatar_url: downloadURL
            }).then(() => {
              this.formMsg = "";
              this.formMsgValid = constant.MSG_UPDATE_SUCCESS;
              setTimeout(() => {
                this.showModal = false;
                this.reset();
                this.cancelModalUpdate();
              }, 1500);
              this.selectedFiles = null;
              this.arr_url_avatar = [];
            });
            return undefined;
          });
        } else {
          this.dbService.update('pupils', $key, {
            id: parseInt(this.pupilItem.id),
            home_address: this.pupilItem.home_address,
            first_name: this.pupilItem.first_name,
            last_name: this.pupilItem.last_name,
            location: this.pupilItem.location,
            tutor: this.pupilItem.tutor,
            allergies: this.pupilItem.allergies,
            date_of_birth: this.pupilItem.date_of_birth,
            father_mobile: this.pupilItem.father_mobile,
            mother_mobile: this.pupilItem.mother_mobile
          }).then(() => {
            this.formMsg = "";
            this.formMsgValid = constant.MSG_UPDATE_SUCCESS;
            setTimeout(() => {
              this.showModal = false;
              this.reset();
              this.cancelModalUpdate();
            }, 1500);
          });
        }
      }
    }
  }
  cancelModalUpdate() {
    this.showModalUpdate = false;
    this.formMsgValid = "";
    this.formMsg = "";
    this.msgAvatar = '';
  }

  showModal: boolean = false;
  cancelModal() {
    this.selectedFiles = null;
    this.showModal = false;
    this.resetFormAddPupil();
  }
  showModalPopup() {
    this.showModal = true;
  }

  searchText: string = '';
  fieldsort: "";
  isDesc: boolean = false;
  direction: number;
  orderBy(col) {
    this.fieldsort = col;
    this.isDesc = !this.isDesc; // direction : decrease | increase
    this.direction = this.isDesc ? 1 : -1; // direction flag
  }

  updateSelect($event) {
    this.file = $event.target.files[0];
  }

  addAvatar: any;
  uploadAvatar($event) {
    this.addAvatar = $event.target.files[0];
  }

}
