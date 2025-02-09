// Seleciona os elementos do DOM
const inputElement = document.querySelector(".nova-tarefa-input");
const addTaskButton = document.querySelector(".nova-tarefa-button");
const tasksContainer = document.querySelector(".tarefas-container");

// Função para validar o input
const validateInput = () => inputElement.value.trim().length > 0;

// Função para adicionar uma nova tarefa
const handleAddTask = () => {
    const inputIsValid = validateInput();

    if (!inputIsValid) {
        inputElement.classList.add("error");
        return;
    }

    // Cria o container da tarefa
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("tarefas-item");

    // Cria o conteúdo da tarefa
    const taskContent = document.createElement("p");
    taskContent.innerText = inputElement.value;

    // Adiciona evento de clique para marcar como concluída
    taskContent.addEventListener("click", () => handleClick(taskContent));

    // Cria o ícone de deletar
    const deleteItem = document.createElement("i");
    deleteItem.classList.add("fas", "fa-trash");

    // Adiciona evento de clique para deletar a tarefa
    deleteItem.addEventListener("click", () => {
        taskItemContainer.remove();
    });

    // Adiciona o conteúdo e o ícone de deletar ao container da tarefa
    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    // Adiciona o container da tarefa ao container de tarefas
    tasksContainer.appendChild(taskItemContainer);

    // Limpa o input e remove a classe de erro
    inputElement.value = "";
    inputElement.classList.remove("error");

    // Atualiza o localStorage
    updateLocalStorage();
};

// Função para marcar/desmarcar tarefa como concluída
const handleClick = (taskContent) => {
    const tasks = tasksContainer.querySelectorAll(".tarefas-item");

    for (const task of tasks) {
        const paragraph = task.querySelector("p");
        if (paragraph && paragraph.isSameNode(taskContent)) {
            paragraph.classList.toggle("completed");
        }
    }

    // Atualiza o localStorage
    updateLocalStorage();
};

// Função para deletar uma tarefa
const handleDeleteClick = (taskItemContainer, taskContent) => {
    const tasks = tasksContainer.childNodes;

    for (const task of tasks) {
        const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent)
        if (currentTaskIsBeingClicked) {
            taskItemContainer.remove();
        }
    }
};

// Função para lidar com a mudança no input
const handleInputChange = () => {
    if (validateInput()) {
        inputElement.classList.remove("error");
    }    
};

// Função para atualizar o localStorage
const updateLocalStorage = () => {
    const tasks = tasksContainer.childNodes;

    const localStorageTasks = [...tasks]
        .filter(task => task.nodeType === 1) 
        .map(task => {
            const content = task.querySelector("p");
            const isCompleted = content.classList.contains("completed");

            return { description: content.innerText, isCompleted };
        });

    localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
};

// Função para carregar as tarefas do localStorage
const refreshTasksUsingLocalStorage = () => {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

    if (!Array.isArray(tasksFromLocalStorage)) return;  // Verifica se é um array válido

    tasksFromLocalStorage.forEach(task => {
        const taskItemContainer = document.createElement("div");
        taskItemContainer.classList.add("tarefas-item");

        const taskContent = document.createElement("p");
        taskContent.innerText = task.description;

        if (task.isCompleted) {
            taskContent.classList.add("completed");
        }

        taskContent.addEventListener("click", () => handleClick(taskContent));

        const deleteItem = document.createElement("i");
        deleteItem.classList.add("fas", "fa-trash");

        deleteItem.addEventListener("click", () => {
            taskItemContainer.remove();
            updateLocalStorage(); // Atualiza o localStorage após a exclusão
        });

        taskItemContainer.appendChild(taskContent);
        taskItemContainer.appendChild(deleteItem);

        tasksContainer.appendChild(taskItemContainer);
    });
};


// Carrega as tarefas do localStorage ao iniciar
refreshTasksUsingLocalStorage();

// Adiciona eventos aos botões e inputs
addTaskButton.addEventListener("click", handleAddTask);
inputElement.addEventListener("input", handleInputChange);
