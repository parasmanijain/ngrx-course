import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CourseEntityService } from "../services/course-entity.service";
import { Course } from "../model/course";

interface DialogData {
  dialogTitle: string;
  course?: Course;
  mode: "create" | "update";
}

@Component({
  selector: "course-dialog",
  templateUrl: "./edit-course-dialog.component.html",
  styleUrls: ["./edit-course-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  providers: [CourseEntityService],
})
export class EditCourseDialogComponent {
  form!: UntypedFormGroup;

  dialogTitle: string;

  course?: Course;

  mode: "create" | "update";

  loading$!: Observable<boolean>;

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: DialogData,
    private coursesService: CourseEntityService,
  ) {
    this.dialogTitle = data.dialogTitle;
    this.course = data.course;
    this.mode = data.mode;

    const formControls = {
      description: ["", Validators.required],
      category: ["", Validators.required],
      longDescription: ["", Validators.required],
      promo: [false, []],
    };

    if (this.mode === "update") {
      this.form = this.fb.group(formControls);
      if (data.course) {
        this.form.patchValue({ ...data.course });
      }
    } else if (this.mode === "create") {
      this.form = this.fb.group({
        ...formControls,
        url: ["", Validators.required],
        iconUrl: ["", Validators.required],
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.form.valid) {
      return;
    }

    const course: Partial<Course> = {
      ...this.course,
      ...this.form.value,
    };

    if (this.mode === "update" && this.course) {
      this.coursesService.update(course as Course);
      this.dialogRef.close();
    } else if (this.mode === "create") {
      this.coursesService.add(course as Course).subscribe((newCourse) => {
        console.log("New Course", newCourse);
        this.dialogRef.close();
      });
    }
  }
}
