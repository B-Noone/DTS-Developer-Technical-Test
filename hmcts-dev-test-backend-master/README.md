# Backend Readme
Runs on Port 4000 by default.
Requires SQL Server Database running locally, with a database accepting SQL Server Authentication, default port set to 1433.
.env can be configured to connect to a different IP or port along with user login info.
To begin api run:
`npm run dev`

## End Points
### /tasks
Retrieves a list of all tasks in the Database with a `GET` request.

### /task/:id
Retrieves a single Task based on ID with a `GET` request.

### /findTasks?title=Test Title2&status=To Do
Retrieves all tasks matching query parameters with a `GET` request, single or multiple parameters can be used.

### /update/:id?title=&description=A Valid Description&status=Done&due_date=2026-02-03
Updates a specific task based on ID provided with a `PUT` request, accepts multiple query parameters, any unprovided parameters will not change.

### /delete/:id
Deletes a task based on a ID provided with a `DELETE` request.

### /add
Creates a new task based on data provided in body with a `POST` request.