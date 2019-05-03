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

  @ViewChild('fileInput') fileInput: File;
  fileUrl: any;
  info: CoverLetterInfo;

  constructor() { }

  ngOnInit() {
    this.info = new CoverLetterInfo();
  }

  fileChange(event) {
    // Ensure file was given
    if (event.target.files.length === 0) { return; }

    // Ensure correct type
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/application\/vnd.openxmlformats-officedocument.wordprocessingml.document\/*/) == null) {
      throw new TypeError('File must be *.docx');
    }

    // Retrieve file URL
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
        // Replace placeholders with info values
        doc.render();
      } catch (error) {
        const e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        };
        console.log(JSON.stringify({ error: e }));
        throw error;
      }

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      // Save the generated document
      saveAs(out, `MarielMartinez_CoverLetterAndResume_${this.info.companyName}.docx`);
    });
  }
}
