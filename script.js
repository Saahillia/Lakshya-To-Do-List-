document.addEventListener("DOMContentLoaded",() =>{
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const emptyImage = document.querySelector(".empty-image");
    const todoscontainer = document.querySelector(".todos-container");
    const progressbar = document.getElementById("progressbar");
    const progressNumber = document.getElementById("numbers");

    const toggleEmptyState = () =>{
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todoscontainer.style.width = taskList.children.length > 0? '100%' : '50%';
    }

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
    
        progressbar.style.width = totalTasks? `${(completedTasks / totalTasks) * 100}% `: '0%';
        progressNumber.textContent = `${completedTasks}/${totalTasks}`;

        if(checkCompletion && totalTasks > 0 && completedTasks === totalTasks ){
            launchConfetti();
        }
    };

    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li =>({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTaskFromLocalStorage = () =>{
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgress();
    };

    const addTask = (text, completed = false, checkCompletion = true) =>{
        const taskText = text || taskInput.value.trim();
        if(!taskText){
            return;
        }
        const li = document.createElement("li");

        li.innerHTML =`
        <input type="checkbox" class="checkbox" ${completed ? 'checked': ' '}>
        <span>${taskText}</span>
        <div class= "task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editbtn = li.querySelector('.edit-btn');

        if(completed){
            li.classList.add('completed');
            editbtn.disabled = true;
            editbtn.style.opacity = '0.5';
            editbtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change',() =>{
            const ischecked = checkbox.checked;
            li.classList.toggle('completed', ischecked);
            editbtn.disabled = ischecked;
            editbtn.style.opacity = ischecked? '0.5' : '1';
            editbtn.style.pointerEvents = ischecked? 'none' : 'auto';
            updateProgress();
            saveTaskToLocalStorage();
        });

        editbtn.addEventListener('click',() =>{
            if(!checkbox.checked){
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click',() => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });

        taskList.appendChild(li);
        taskInput.value = "";
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();
    };
    addTaskBtn.addEventListener("click", () =>addTask());
    taskInput.addEventListener("keypress",(e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            addTask();
        }
    });
    loadTaskFromLocalStorage();
});




const launchConfetti = () => {
    const duration = 15 * 1000,
  animationEnd = Date.now() + duration,
  defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const interval = setInterval(function() {
  const timeLeft = animationEnd - Date.now();

  if (timeLeft <= 0) {
    return clearInterval(interval);
  }

  const particleCount = 50 * (timeLeft / duration);

  // since particles fall down, start a bit higher than random
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
  );
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  );
}, 250);
};

