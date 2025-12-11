import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { courseUpdated } from "../course.actions";
import { Course } from "../model/course";
import { AppState } from "../../reducers";

@Component({
  selector: "course-dialog",
  templateUrl: "./edit-course-dialog.component.html",
  styleUrls: ["./edit-course-dialog.component.scss"],
  standalone: false,
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
    private store: Store<AppState>
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

    const update: Update<Course> = {
      id: course.id,
      changes: course,
    };

    this.store.dispatch(courseUpdated({ update }));

    this.dialogRef.close();
  }
}
