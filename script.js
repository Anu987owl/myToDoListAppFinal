document.addEventListener('DOMContentLoaded', () => {
    const simpleBtn = document.getElementById('simpleBtn');
    const toDooAppSection = document.querySelector('.to-do-appSection');
    const newTaskInput = document.getElementById('newTask-input');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterAllBtn = document.getElementById('filterAll');
    const filterActiveBtn = document.getElementById('filterActive');
    const filterCompletedBtn = document.getElementById('filterCompleted');
    const currentDateElement = document.getElementById('currentDate'); // New element reference
    const logoutBtn = document.getElementById('logoutBtn'); // Reference to the logout button


    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all'; // 'all', 'active', 'completed'

    // --- NEW DATE & ALERT LOGIC START ---

    // Function to format a Date object into a readable string (e.g., "July 23, 2025")
    const getFormattedDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Function to get a date string in YYYY-MM-DD format for storage/comparison
    const getDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const todayString = getDateString(today);

    // Get last login date from local storage
    const lastLoginDateString = localStorage.getItem('lastLoginDate');

    // Display current date
    currentDateElement.textContent = `Date: ${getFormattedDate(today)}`;

    // Check for undone tasks from yesterday
    if (lastLoginDateString && lastLoginDateString !== todayString) {
        // Calculate yesterday's date
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayString = getDateString(yesterday);

        // Filter tasks that were undone on yesterday's date
        // (Assuming tasks don't get a "createdDate" property yet. If they did, we'd check that too)
        const undoneYesterdayTasks = tasks.filter(task =>
            !task.completed
        );

        if (undoneYesterdayTasks.length > 0) {
            const undoneTaskNames = undoneYesterdayTasks.map(task => `• ${task.text}`).join('\n');
            alert(`
            It looks like you had some tasks undone from ${getFormattedDate(yesterday)}:

            ${undoneTaskNames}

            Don't leave it for tomorrow... again!
            `);
        }
    }

    // Update last login date to today's date
    localStorage.setItem('lastLoginDate', todayString);

    // --- NEW DATE & ALERT LOGIC END ---


    // Function to save tasks to local storage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to render tasks based on the current filter
    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear existing tasks

        // Sort tasks: Incomplete tasks first, then completed tasks
        const sortedTasks = [...tasks].sort((a, b) => {
            // If 'a' is completed and 'b' is not, 'a' comes after 'b' (1)
            if (a.completed && !b.completed) return 1;
            // If 'b' is completed and 'a' is not, 'b' comes after 'a' (-1)
            if (!a.completed && b.completed) return -1;
            // Otherwise, maintain original order (or sort by ID/text if preferred)
            return 0;
        });


        const filteredTasks = sortedTasks.filter(task => { // Use sortedTasks here
            if (currentFilter === 'active') {
                return !task.completed;
            } else if (currentFilter === 'completed') {
                return task.completed;
            }
            return true; // 'all' filter
        });

        if (filteredTasks.length === 0 && tasks.length > 0 && (currentFilter === 'active' || currentFilter === 'completed')) {
            const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = `No ${currentFilter} tasks.`;
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.color = '#777';
            noTasksMessage.style.fontStyle = 'italic';
            taskList.appendChild(noTasksMessage);
            return;
        } else if (tasks.length === 0) {
             const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = `Start by adding a task!`;
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.color = '#777';
            noTasksMessage.style.fontStyle = 'italic';
            taskList.appendChild(noTasksMessage);
            return;
        }


        filteredTasks.forEach((task) => { // Removed index as it's not strictly needed here
            const listItem = document.createElement('li');
            listItem.setAttribute('data-id', task.id);
            if (task.completed) {
                listItem.classList.add('completed');
            }

            // Create a checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
            listItem.appendChild(checkbox); // Add checkbox before task text


            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = task.text;


            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('task-actions');

            const editButton = document.createElement('button');
            editButton.innerHTML = '&#9998;'; // Pencil icon for edit
            editButton.classList.add('edit-btn');
            editButton.title = 'Edit Task';
            editButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent issues if clicking near checkbox
                editTask(task.id);
            });

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&#10006;'; // Cross icon for delete
            deleteButton.classList.add('delete-btn');
            deleteButton.title = 'Delete Task';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent issues if clicking near checkbox
                deleteTask(task.id);
            });

            listItem.appendChild(taskTextSpan);
            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(deleteButton);
            listItem.appendChild(actionsDiv);
            taskList.appendChild(listItem);
        });
    };

    // Function to add a new task
    const addTask = () => {
        const taskText = newTaskInput.value.trim();

        if (taskText === '') {
            alert('Please enter a task!');
            return; // Stop execution if input is empty
        }

        // Check for duplicate tasks (case-insensitive)
        const isDuplicate = tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase());

        if (isDuplicate) {
            alert('This task already exists!');
            newTaskInput.value = ''; // Clear input field
            return; // Stop execution if it's a duplicate
        }

        const newTask = {
            id: Date.now(), // Unique ID for each task
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        newTaskInput.value = ''; // Clear input field
        saveTasks();
        renderTasks();
    };

    // Function to toggle task completion
    const toggleTaskCompletion = (id) => {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks(); // Re-render to apply sorting
    };

    // Function to delete a task
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    // Function to edit a task
    const editTask = (id) => {
        const taskToEdit = tasks.find(task => task.id === id);
        if (taskToEdit) {
            const newText = prompt('Edit task:', taskToEdit.text);
            if (newText !== null) { // User didn't click cancel
                const trimmedText = newText.trim();
                if (trimmedText === '') {
                    alert('Task cannot be empty!');
                    return;
                }
                // Check for duplicate after editing (excluding the task being edited)
                const isDuplicateAfterEdit = tasks.some(task =>
                    task.id !== id && task.text.toLowerCase() === trimmedText.toLowerCase()
                );

                if (isDuplicateAfterEdit) {
                    alert('A task with this name already exists!');
                    return;
                }

                tasks = tasks.map(task =>
                    task.id === id ? { ...task, text: trimmedText } : task
                );
                saveTasks();
                renderTasks();
            }
        }
    };

    // Function to set active filter button
    const setActiveFilter = (filterBtn) => {
        document.querySelectorAll('.opt-filters button').forEach(btn => {
            btn.classList.remove('active');
        });
        filterBtn.classList.add('active');
    };

    // Event Listeners

    // Scroll to the to-do app section when "Start adding tasks" is clicked
    simpleBtn.addEventListener('click', () => {
        toDooAppSection.scrollIntoView({ behavior: 'smooth' });
    });

    addTaskBtn.addEventListener('click', addTask);

    newTaskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        setActiveFilter(filterAllBtn);
        renderTasks();
    });

    filterActiveBtn.addEventListener('click', () => {
        currentFilter = 'active';
        setActiveFilter(filterActiveBtn);
        renderTasks();
    });

    filterCompletedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        setActiveFilter(filterCompletedBtn);
        renderTasks();
    });

    // Logout button functionality - MOVED HERE
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn'); // Clear the login status from local storage
            window.location.href = 'login.html'; // Redirect to the login page
        });
    }

    // Initial render of tasks when the page loads
    renderTasks();
    setActiveFilter(filterAllBtn); // Set "All" as active by default
});