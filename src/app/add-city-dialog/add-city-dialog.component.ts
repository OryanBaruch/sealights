import {ChangeDetectionStrategy, Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput, MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-add-city-dialog',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    MatInput,
    MatDialogTitle,
    NgIf,
    MatInputModule
  ],
  templateUrl: './add-city-dialog.component.html',
  styleUrl: './add-city-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCityDialogComponent {
  addCityForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { countryName: string },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCityDialogComponent>
  ) {
    this.addCityForm = this.fb.group({
      cityName: ['', Validators.required]
    });
  }

  onSave(): void {
    if (this.addCityForm.valid) {
      const cityName = this.addCityForm.get('cityName')?.value;
      this.dialogRef.close(cityName);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
