import { Component, OnInit, ViewChild } from '@angular/core';
import { CoverLetterInfo } from '../../models/CoverLetterInfo';
import Docxtemplater from 'docxtemplater';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-coverletterform',
  templateUrl: './coverletterform.component.html',
  styleUrls: ['./coverletterform.component.css']
})
export class CoverletterformComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  info: CoverLetterInfo;
  fileUrl: any;
  files: any[];

  constructor() { }

  ngOnInit() {
    this.info = new CoverLetterInfo();
  }

  fileChange(event) {
    this.fileInput = event.target.files[0];

    const mimeType = event.target.files[0].type;
    if (mimeType.match(/application\/vnd.openxmlformats-officedocument.wordprocessingml.document\/*/) == null) {
      console.log('File must be *.docx');
      return;
    }

    const reader = new FileReader();
    this.fileUrl = event.target.files;
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = e => this.fileUrl = reader.result;
  }

  loadFile(url, callback) {
    JSZipUtils.getBinaryContent(url, callback);
  }

  onSubmit() {
    this.loadFile(this.fileUrl, (error, content) => {
      if (error) { throw error; }
      const zip = new JSZip(content);
      const doc = new Docxtemplater().loadZip(zip);
      doc.setData(this.info);
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
      } catch (error) {
        const e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        }
        console.log(JSON.stringify({ error: e }));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
      }

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }); // Output the document using Data-URI

      saveAs(out, `MarielMartinez_CoverLetterAndResume_${this.info.companyName}.docx`);
    });
  }

}
