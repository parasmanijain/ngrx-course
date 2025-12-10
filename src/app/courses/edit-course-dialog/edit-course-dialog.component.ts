import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { Course } from "../model/course";
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Observable } from "rxjs";
import { CoursesHttpService } from "../services/courses-http.service";
import { CourseEntityService } from "../services/course-entity.service";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatFormField, MatInput } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatButton } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "course-dialog",
    templateUrl: "./edit-course-dialog.component.html",
    styleUrls: ["./edit-course-dialog.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatProgressSpinner,
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatSelect,
        MatOption,
        MatSlideToggle,
        MatDialogActions,
        MatButton,
        AsyncPipe,
    ],
})
export class EditCourseDialogComponent {
  form: UntypedFormGroup;

  dialogTitle: string;

  course: Course;

  mode: "create" | "update";

  loading$: Observable<boolean>;

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private coursesService: CourseEntityService
  ) {
    this.dialogTitle = data.dialogTitle;
    this.course = data.course;
    this.mode = data.mode;

    const formControls = {
      description: ["", Validators.required],
      category: ["", Validators.required],
      longDescription: ["", Validators.required],
      promo: ["", []],
    };

    if (this.mode == "update") {
      this.form = this.fb.group(formControls);
      this.form.patchValue({ ...data.course });
    } else if (this.mode == "create") {
      this.form = this.fb.group({
        ...formControls,
        url: ["", Validators.required],
        iconUrl: ["", Validators.required],
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    const course: Course = {
      ...this.course,
      ...this.form.value,
    };

    if (this.mode == "update") {
      this.coursesService.update(course);

      this.dialogRef.close();
    } else if (this.mode == "create") {
      this.coursesService.add(course).subscribe((newCourse) => {
        console.log("New Course", newCourse);

        this.dialogRef.close();
      });
    }
  }
}
