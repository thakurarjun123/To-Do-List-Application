// Get references to DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Function to show a temporary message box
function showMessageBox(message, type = 'error') {
    let messageBox = document.getElementById('messageBox');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'messageBox';
        messageBox.classList.add('message-box');
        document.body.appendChild(messageBox);
    }

    messageBox.textContent = message;
    // Reset classes to ensure correct styling for type
    messageBox.classList.remove('bg-red-500', 'bg-green-500', 'show');
    if (type === 'error') {
        messageBox.classList.add('bg-red-500');
    } else if (type === 'success') {
        messageBox.classList.add('bg-green-500');
    }

    messageBox.classList.add('show'); // Make it visible

    setTimeout(() => {
        messageBox.classList.remove('show'); // Hide after 3 seconds
    }, 3000);
}


// Function to load tasks from local storage
function loadTasks() {
    // Retrieve tasks from local storage or initialize an empty array if none exist
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Clear the current list before loading to prevent duplicates
    taskList.innerHTML = '';
    // Iterate over the tasks and create list items for each
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

// Function to save tasks to local storage
function saveTasks() {
    // Get all task items from the DOM
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        // Extract task text and completion status
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    // Save the tasks array to local storage as a JSON string
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to add a task to the DOM
function addTaskToDOM(taskText, isCompleted = false) {
    // Create a new list item element
    const listItem = document.createElement('li');
    listItem.classList.add('task-item', 'flex', 'items-center', 'justify-between', 'p-3', 'rounded-lg', 'bg-gray-50', 'hover:bg-gray-100', 'transition', 'duration-150', 'ease-in-out');

    // If the task is completed, add the 'completed' class
    if (isCompleted) {
        listItem.classList.add('completed');
    }

    // Create a span element for the task text
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.classList.add('flex-grow', 'text-lg', 'text-gray-700', 'cursor-pointer');

    // Create a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn', 'ml-4', 'px-4', 'py-2', 'rounded-md', 'text-sm', 'font-medium', 'shadow-sm', 'hover:shadow-md');

    // Append the task text and delete button to the list item
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteBtn);
    // Append the list item to the task list
    taskList.appendChild(listItem);

    // Add event listener to toggle completion status when task text is clicked
    taskSpan.addEventListener('click', () => {
        listItem.classList.toggle('completed'); // Toggle 'completed' class
        saveTasks(); // Save updated tasks to local storage
    });

    // Add event listener to delete the task when the delete button is clicked
    deleteBtn.addEventListener('click', () => {
        listItem.remove(); // Remove the list item from the DOM
        saveTasks(); // Save updated tasks to local storage
    });
}

// Event listener for the "Add Task" button
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim(); // Get and trim the input value
    if (taskText !== '') { // Check if the input is not empty
        addTaskToDOM(taskText); // Add the task to the DOM
        saveTasks(); // Save the new task to local storage
        taskInput.value = ''; // Clear the input field
        showMessageBox('Task added successfully!', 'success');
    } else {
        showMessageBox('Please enter a task!', 'error');
    }
});

// Allow adding tasks by pressing Enter key in the input field
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTaskBtn.click(); // Simulate a click on the add button
    }
});

// Load tasks when the page loads
window.onload = loadTasks;
