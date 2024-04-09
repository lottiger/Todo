const addBtn = document.querySelector('.add-btn');
const inputTask = document.querySelector('.input-task');
const form = document.querySelector('.form');
const errorMsg = document.querySelector('.error-msg');
const output = document.querySelector('.output');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-btn');

let tasks = [];
// Create the elements for tasks
function createTaskElement(taskTitle, taskId) {
    const task = document.createElement('div');
    task.classList.add('task');

    const newTask = document.createElement('li');
    newTask.innerText = taskTitle;
    newTask.classList.add('list-item');
    newTask.setAttribute('id', `task${taskId}`);
    task.appendChild(newTask);

    // Add check button
    const checkBtn = document.createElement('button');
    checkBtn.classList.add('check-btn');
    checkBtn.type = 'button';
    checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    task.appendChild(checkBtn);

    checkBtn.setAttribute('aria-label', 'Check task')


    checkBtn.addEventListener('click', async (e) => {
       
        const taskIndex = tasks.findIndex(t => t._id === taskId);
    
        // Toggle the completed status of the task
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
    
        const res = await fetch(`http://localhost:8080/api/todos/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                title: taskTitle,
                completed: tasks[taskIndex].completed,
            }),
        });
    
        if (res.status === 200) {
            console.log('Uppgift uppdaterad');
            
            // Update the task style in the DOM based on its new completed status
            if (tasks[taskIndex].completed) {
                newTask.style.textDecoration = 'line-through';
                newTask.style.textDecorationColor = 'brown';
            } else {
                newTask.style.textDecoration = 'none';
            }
        } else {
            console.log('Fel vid uppdatering av uppgift');
        }
        console.log(res);
        console.log(tasks);
      
    });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        // deleteBtn.type = 'button';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        task.appendChild(deleteBtn);

        deleteBtn.setAttribute('aria-label', 'Delete task')

        deleteBtn.addEventListener('click', async (e) => {
        

        const taskIndex = tasks.findIndex(task => task._id === taskId);
       
        closeBtn.addEventListener('click', function (e) {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

    
        // If the task is not completed, do not delete it
        if (!tasks[taskIndex].completed) {
            console.log('Cannot delete task that is not completed');
            modal.style.display = 'block';
            return;
        }
        
        const res = await fetch(`http://localhost:8080/api/todos/${taskId}`, {
            method: 'DELETE',
        });


        if (res.status === 200 ) {
            console.log('Successfully deleted task');
            task.remove();
        } 
            
        task.remove();
    });

        return task;
}

    function createTaskList(tasks) {
    const task = createTaskElement(tasks.title, tasks._id);
    output.appendChild(task);
}

    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (inputTask.value.trim() === '') {
        errorMsg.style.display = 'block';

        setTimeout(function () {
            errorMsg.style.display = 'none';
        }, 2000);

        return;   
    }

    const response = await fetch('http://localhost:8080/api/todos', {
    
    // 
    
    method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            title: inputTask.value,
        }),
    });
    if (response.status !== 201) {
        return;
    }
    const data = await response.json();
    
    tasks.push(data);
    // Call createTaskList after adding the task to the tasks array
    createTaskList(data); 
    
    inputTask.value = ''; 
    inputTask.focus(); 
});

    addBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    // Trigger the form submit event
    form.dispatchEvent(new Event('submit')); 
});

    const getTasks = async () => {
    const res = await fetch('http://localhost:8080/api/todos/')

    if (res.status !== 200) {
        console.log('Error fetching data');
        return;
    }
    const data = await res.json();

    data.forEach(task => {
        tasks.push(task);
        const taskElement = createTaskElement(task.title, task._id)
       
        if (task.completed) {
            taskElement.querySelector('.list-item').style.textDecoration = 'line-through';
            taskElement.querySelector('.list-item').style.textDecorationColor = 'brown';
        }
       
        output.appendChild(taskElement);

    });
};
getTasks();