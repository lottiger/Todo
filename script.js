const addBtn = document.querySelector('.add-btn');
const inputTask = document.querySelector('.input-task');
const form = document.querySelector('.form');
const errorMsg = document.querySelector('.error-msg');
const output = document.querySelector('.output');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-btn');

let tasks = [];
// Create the elents for tasks
function createTaskElement(taskTitle, taskId) {
    const task = document.createElement('div');
    task.classList.add('task');

    const newTask = document.createElement('li');
    newTask.innerText = taskTitle;
    newTask.classList.add('list-item');
    newTask.setAttribute('id', `task${taskId}`);
    task.appendChild(newTask);

    // Add the check button
    const checkBtn = document.createElement('button');
    checkBtn.classList.add('check-btn');
    checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    task.appendChild(checkBtn);


    checkBtn.addEventListener('click', async (e) => {
        e.preventDefault();

       
        const taskIndex = tasks.findIndex(t => t._id === taskId);
    
        // Toggle the completed status of the task
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
    
        const res = await fetch(`https://js1-todo-api.vercel.app/api/todos/${taskId}?apikey=f1e85d3b-f2f3-43fb-b1dc-a4e38c451913`, {
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
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        task.appendChild(deleteBtn);

        deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const taskIndex = tasks.findIndex(t => t._id === taskId);
       
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
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
        
        const res = await fetch(`https://js1-todo-api.vercel.app/api/todos/${taskId}?apikey=f1e85d3b-f2f3-43fb-b1dc-a4e38c451913`, {
            method: 'DELETE',
        });


        if (res.status === 200 ) {
            console.log('Successfully deleted task');
            task.remove();
        } else {
            console.log('Error deleting task');
        }
        console.log(res);
    
  
        task.remove();
        console.log(taskId);
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

    const response = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=f1e85d3b-f2f3-43fb-b1dc-a4e38c451913', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            title: inputTask.value,
        }),
    });
    if (response.status !== 201) {
        console.log('Error fetching data');
        return;
    }
    const data = await response.json();
    
    console.log(response);
    
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
    const res = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=f1e85d3b-f2f3-43fb-b1dc-a4e38c451913');

    if (res.status !== 200) {
        console.log('Error fetching data');
        return;
    }
    const data = await res.json();
    console.log(res);

    data.forEach(task => {
        tasks.push(task);
        const taskElement = createTaskElement(task.title, task._id);
       
        if (task.completed) {
            taskElement.querySelector('.list-item').style.textDecoration = 'line-through';
            taskElement.querySelector('.list-item').style.textDecorationColor = 'brown';
        }
       
        output.appendChild(taskElement);

    });
};
getTasks();