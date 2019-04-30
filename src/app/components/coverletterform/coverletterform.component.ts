import { Component, OnInit } from '@angular/core';
import { CoverLetterInfo } from '../../models/CoverLetterInfo';

@Component({
  selector: 'app-coverletterform',
  templateUrl: './coverletterform.component.html',
  styleUrls: ['./coverletterform.component.css']
})
export class CoverletterformComponent implements OnInit {

  // info: CoverLetterInfo;
  info: CoverLetterInfo;
  submitted = false;

  constructor() { }

  ngOnInit() {
    this.info = new CoverLetterInfo();
  }

  onSubmit() {
    this.submitted = true;
  }

  newInfo() {
    console.log(this.info);
  }

}
