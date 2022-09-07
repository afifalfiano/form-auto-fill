import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, last } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'form-auto-fill';
  dataSubmit = {};
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const data = localStorage.getItem('FORM_DATA');
    if (data !== null) {

      const log = this.decryptLocalStorage();
      console.log(log, 'log');
      this.form = this.fb.group({
        // step 1
        name: [log.name],
        nim: [log.nim],
        email: [log.email],
        address: [log.address],
        // step 2
        topic1: [log.topic1],
        topic2: [log.topic2],
        topic3: [log.topic3],
        topic4: [log.topic4],
        // step 3
        topic5: [log.topic5],
        topic6: [log.topic6],
        topic7: [log.topic7],
        topic8: [log.topic8],
      })
    } else {
      this.form = this.fb.group({
        // step1
        name: [''],
        nim: [''],
        email: [''],
        address: [''],
        // step2
        topic1: [''],
        topic2: [''],
        topic3: [''],
        topic4: [''],
        // step3
        topic5: [''],
        topic6: [''],
        topic7: [''],
        topic8: [''],
      })
    }

    this.form.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(response => {
      this.encryptLocalStorage(response);
    });
  }

  onSubmit(): void {
    this.dataSubmit = this.form.value;
    this.form.reset();
    setTimeout(() => {
      localStorage.removeItem('FORM_DATA');
    }, 1000);
  }

  private encryptLocalStorage(data: any) {
    //Encrypt Info
    const encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(data), 'Key 12345').toString());
    localStorage.setItem('FORM_DATA', encryptInfo);
  }

  private decryptLocalStorage() {
    // Decrypt Info
    const dataLocal = localStorage.getItem('FORM_DATA');
    if (dataLocal !== null) {
      const data = CryptoJS.AES.decrypt(decodeURIComponent(dataLocal), 'Key 12345'); 
      const decryptedInfo = JSON.parse(data.toString(CryptoJS.enc.Utf8));
      return decryptedInfo;
    }
  }

}
