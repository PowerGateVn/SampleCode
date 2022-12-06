import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-avatar-user',
  templateUrl: 'avatar-user.component.html',
  styleUrls: ['avatar-user.component.scss'],
})
export class AvatarUserComponent implements OnInit {

  @Input() imgSize;
  @Input() imageAvatarCurrent;
  @Input() nameAvatar;
  userName: any;
  constructor() { }

  ngOnInit() {
   // console.log(this.imageAvatarCurrent);
  }
}
