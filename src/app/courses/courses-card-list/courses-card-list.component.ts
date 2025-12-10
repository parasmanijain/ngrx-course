import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Course } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditCourseDialogComponent } from "../edit-course-dialog/edit-course-dialog.component";
import { defaultDialogConfig } from "../shared/default-dialog-config";
import { CourseEntityService } from "../services/course-entity.service";
import { MatCard, MatCardHeader, MatCardTitle, MatCardImage, MatCardContent, MatCardActions } from "@angular/material/card";
import { MatButton, MatMiniFabButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: "courses-card-list",
    templateUrl: "./courses-card-list.component.html",
    styleUrls: ["./courses-card-list.component.scss"],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardImage,
        MatCardContent,
        MatCardActions,
        MatButton,
        RouterLink,
        MatMiniFabButton,
        MatIcon,
    ],
})
export class CoursesCardListComponent implements OnInit {
  @Input()
  courses: Course[];

  @Output()
  courseChanged = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private courseService: CourseEntityService
  ) {}

  ngOnInit() {}

  editCourse(course: Course) {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: "Edit Course",
      course,
      mode: "update",
    };

    this.dialog
      .open(EditCourseDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.courseChanged.emit());
  }

  onDeleteCourse(course: Course) {
    this.courseService.delete(course).subscribe(
      () => console.log("Delete completed"),
      (err) => console.log("Deleted failed", err)
    );
  }
}
