// TO DO LIST ALGORITHM
// CREATE AN ARRAY TO STORE TODO ITEMS
// ADD EVENT LISTENER TO THE BUTTON
// WHEN THE BUTTON IS CLICKED, GET THE VALUE FROM THE INPUT FIELD
// ADD THE VALUE TO THE ARRAY

// Initialize flatpickr on the date input <!--Added for the sake of iphone display that does not fully support styling <input type="date"> -->
    /*flatpickr(".date-input", {
        dateFormat: "d/m/Y"  // Format as DD/MM/YYYY
    });*/

let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

let todo = document.querySelector('.add-button');
let myList = document.querySelector('.list-container');

todo.addEventListener('click', function () {
    let inputElement = document.querySelector('.input');
    let name = inputElement.value.trim(); // Get the value from the input field and  trim deletes whitespace
    let dueDateInput = document.querySelector('.date-input');
    let dueDateValue = dueDateInput.value; 
    
    if (name === '') {
        alert('Please enter a task.') //makes the task input required
        return;
    }

    if (dueDateInput.value === '') {
        alert('Please enter a date.') //makes the date input required
        return;
    }

    todoList.push({ name: name, completed: false, dueDate: dueDateValue }); // Add the new task/date to the array
    localStorage.setItem('todoList', JSON.stringify(todoList)); // Save to localStorage after adding
    
    //RESET THE INPUT FIELD AFTER ADDING
    inputElement.value = '';
    dueDateInput.value = ''; 
    renderList();
})

function renderList() {

    myList.innerHTML = ''; // Clear old list
    todoList.forEach((item, index) => { 
    
        // Create Checkbox Element
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('todo-checkbox');
        checkbox.checked = item.completed; 
        
        // When checkbox is clicked 'completed' class
        checkbox.addEventListener('change', function () {
            item.completed = checkbox.checked; // Update object state
            localStorage.setItem('todoList', JSON.stringify(todoList)); // Save updated state
                
            if (item.completed) {
                listItem.classList.add('completed'); // CSS will style this as "done"
            } else {
                listItem.classList.remove('completed');
            }
        
        });

        let listItem = document.createElement('li'); // creates HTML for the list item
        listItem.classList.add('list-item');
        
        if (item.completed) {
            listItem.classList.add('completed');
        }
        
        // Creates span for text
        let textItem = document.createElement('span');
        textItem.textContent = item.name; 
        textItem.classList.add('text-item');

         // Grouping Checkbox and text in a DIV for CSS styling
        let contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');

        // Appending checkbox and text to a Div (contentContainer)
        contentContainer.appendChild(checkbox);
        contentContainer.appendChild(textItem);

        //Add Due Date
        let dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = `(${new Date(item.dueDate).toLocaleDateString()})`;
        dueDateSpan.classList.add('due-date');

        //creates delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');

        // Grouping DueDate and DeleteBtn in a DIV for CSS styling
        let contentDiv = document.createElement('div');
        contentDiv.classList.add('content-container2');

        // Appending DueDate and DeleteBtn to a Div (contentContainer)
        contentDiv.appendChild(dueDateSpan);
        contentDiv.appendChild(deleteButton);

        // Add event listener to delete button
        deleteButton.addEventListener('click', function () {
        todoList.splice(index, 1); //removes from todolist array

        // Display deleted Item
        document.querySelector('.list-delete').textContent = `Last Delete: ${item.name}`;
        localStorage.setItem('lastDeleted', item.name); // Save last deleted item to localStorage

        // Saving to localStorage
        localStorage.setItem('todoList', JSON.stringify(todoList));
        
        renderList();// Re-render the updated list after deletion
});

        // Puts the text and delete button inside list item
        listItem.appendChild(contentContainer);
        listItem.appendChild(contentDiv);
        
        // Adds the list item to the unordered list
        myList.appendChild(listItem);

        console.log(todoList);
    });
}
    

// EVENT LISTENER FOR ENTER KEY
// This allows the user to press Enter to add a todo item
let handle = document.querySelectorAll('input');
handle.forEach(input => {
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            document.querySelector('.add-button').click();
        }
    });
});

// Clear and Restore All Buttons
let clearButton = document.querySelector('.clear-button');
let restoreButton = document.querySelector('.restore-button');
let confirmModal = document.querySelector('.confirm-modal');
let confirmYes = document.querySelector('.confirm-yes');
let confirmNo = document.querySelector('.confirm-no');

// Clear Button
clearButton.addEventListener('click', function () {
    confirmModal.classList.remove('hidden'); // Show confirmation modal
});

// Yes Confirmation
confirmYes.addEventListener('click', function () {
    localStorage.setItem('backupList', JSON.stringify(todoList)); 
    todoList = [];
    localStorage.removeItem('todoList');
    document.querySelector('.list-delete').textContent = '';

    renderList(); // Update the UI
    confirmModal.classList.add('hidden'); // Hide confirmation modal
});

// No Confirmation
    confirmNo.addEventListener('click', function () {
    confirmModal.classList.add('hidden');
});

// Restore Button
restoreButton.addEventListener('click', function () {
    let backupList = JSON.parse(localStorage.getItem('backupList'));
    if (backupList && backupList.length > 0) {
        todoList = backupList;
        localStorage.setItem('todoList', JSON.stringify(todoList));
        renderList(); // Update the UI
    } else {
        alert('No backup found to restore.');
    }
});


// Render existing list on page load
renderList();