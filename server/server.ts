import express, { Application, json } from "express";
import cors from "cors";
import { loginUser } from "./auth.route";
import { getAllCourses, getCourseByUrl } from "./get-courses.route";
import { createCourse } from "./create-course.route";
import { saveCourse } from "./save-course.route";
import { deleteCourse } from "./delete-course.route";
import { searchLessons } from "./search-lessons.route";

const app: Application = express();

app.use(cors({ origin: true }));

app.use(json());

app.route("/api/login").post(loginUser);

app.route("/api/courses").get(getAllCourses);

app.route("/api/course").post(createCourse);

app.route("/api/course/:id").put(saveCourse);

app.route("/api/course/:id").delete(deleteCourse);

app.route("/api/courses/:courseUrl").get(getCourseByUrl);

app.route("/api/lessons").get(searchLessons);

const httpServer = app.listen(9000, () => {
  const address = httpServer.address();
  if (address && typeof address === "object") {
    console.log(
      "HTTP REST API Server running at http://localhost:" + address.port,
    );
  } else {
    console.log("HTTP REST API Server running at http://localhost:9000");
  }
});

httpServer.on("error", (error: any) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      "Port 9000 is already in use. Please close other applications using this port or change the port number.",
    );
  } else {
    console.error("Server error:", error);
  }
  process.exit(1);
});
