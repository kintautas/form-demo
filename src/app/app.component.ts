import {Component} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, AbstractControl, ValidatorFn, FormGroup, FormArray} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class MyErrorStateMatcherPwd implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return control.parent.errors && control.parent.errors['notSame']
  }
}

export function emailExistsValidator(control: AbstractControl) {
    const forbidden = control.value == "test@test.com"
    return forbidden ? {forbiddenName: {value: control.value}} : null;
}



export function checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.get('password').value;
  let confirmPass = group.get('repeatPassword').value;

  return pass === confirmPass ? null : { notSame: true }     
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  myForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
  email: new FormControl('', [
    Validators.required,
    Validators.email,
    emailExistsValidator
  ]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    friends: new FormArray([])
  }, { validators: checkPasswords})

  friendForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('', [Validators.email, Validators.required])
  })
  

  matcher = new MyErrorStateMatcher();
  matcherPwd = new MyErrorStateMatcherPwd();
  get email() { return this.myForm.get('email'); }
  get name() { return this.myForm.get('name'); }
  get password() { return this.myForm.get('name'); }

  get friendEmail() { return this.friendForm.get('email') }
  get friendName() { return this.friendForm.get('name') }

  arrayItems = []



  get friendArray() {
      return this.myForm.get('friends') as FormArray;
   }
  addItem() {
    var item = new FormControl({ name: this.friendName.value, email: this.friendEmail.value })
    var aItem = ({ name: this.friendName.value, email: this.friendEmail.value })
      this.arrayItems.push(aItem);
      this.friendArray.push(item);
   }
   removeItem() {
      this.arrayItems.pop();
      this.friendArray.removeAt(this.friendArray.length - 1);
   }
  
  submit() {
    console.log(this.myForm.value)
  }
}


