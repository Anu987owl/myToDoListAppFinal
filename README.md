# myToDoListAppFinal

This project is a clean, secure, and user-friendly web application for managing the user's daily tasks. It combines a simple login system with a powerful To-Do list that remembers tasks and even reminds the user about unfinished work from yesterday.

Main Features -------------------
This app is designed to help the user organize their day and stay focused.

Secure Login: The application starts with a simple login page to control access to the user's personal task list.

Username: user@ | Password: password

Persistent Storage: All the user's tasks are automatically saved in the browser using Local Storage. They'll be there waiting for the user when they return.

Yesterday's Task Alert: When a user logs in, the app checks if the user had any incomplete tasks from their last session. It gives the user a pop-up alert to remind them not to put them off again!

Task Management: The user can easily add, edit, delete, and mark tasks as complete with a simple checkbox.

Filtering and Sorting: The list automatically sorts completed tasks to the bottom.

The user can click buttons to quickly view All tasks, only Active (unfinished) tasks, or only Completed tasks.

Logout Function: Includes a simple logout button that clears the user's session status, requiring login again next time.


Technologies Used and their purpose ---------
HTML	Creates the structure for all three pages: Main, Login, and To-Do List.
JavaScript  Powers all the complex logic, including login validation, local storage management, task saving, filtering, and the daily reminder alert.
CSS	Provides the modern, clean, and colorful styling for a great user experience.


How to Use --------
The user opens the Main Page (index.html).

The user clicks the link to go to Login.

The user enters the required Username and Password (user@ / password).

Once logged in, the user will see the To-Do List page.

The user types a task into the box and clicks "Add a Task" or presses Enter.

The user uses the checkbox to mark tasks as done.

The user uses the Edit (pencil) or Delete (X) icons to manage their tasks.
