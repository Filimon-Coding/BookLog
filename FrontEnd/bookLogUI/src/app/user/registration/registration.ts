import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  standalone: true, 
  imports: [ReactiveFormsModule],
  templateUrl: './registration.html',
  styles: ``,
})
export class Registration {
  form: any; 
  constructor(public formBuilder: FormBuilder ){
 

  // Jeg kommer tilbake til denne error melding 
  // Det er pga intialisting before formbuilder


  this.form = this.formBuilder.group({
    fullName :[''],
    eMail :[''],
    password :[''],
    confirmPassword :[''],
    
  })

}
}
