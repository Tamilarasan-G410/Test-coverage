const fs = require('fs');
const path = require('path');
const Chance = require('chance');
const chance = new Chance();
describe('HTML Testing', () => {
  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, 'todolist.html'), 'utf8');
    document.body.innerHTML = html;
  });
  describe('Title testing', () => {
    test('Title is displayed', () => {
      const titleElement = document.querySelector('.title');
      expect(titleElement).not.toBeNull();
    });

    test('Content of the title is correct', () => {
      const titleElement = document.querySelector('.title');
      expect(titleElement.textContent).toBe('To-Do List');
    });
  });

  describe('Input box testing', () => {
    test('Input bar is displayed', () => {
      const inputElement = document.querySelector('#inputtask');
      expect(inputElement).not.toBeNull();
    });

    test('Placeholder of the input box is correct', () => {
      const inputElement = document.querySelector('#inputtask');
      expect(inputElement.getAttribute('placeholder')).toBe('Enter the task');
    });

    test('Auto-complete is off for the input bar', () => {
      const inputElement = document.querySelector('#inputtask');
      expect(inputElement.getAttribute('autocomplete')).toBe('off');
    });

    test('Max length of the input bar is 150', () => {
      const inputElement = document.querySelector('#inputtask');
      expect(inputElement.maxLength).toBe(150);
    });
  });
  describe('Add button testing', () => {
    test('Add button is displayed', () => {
      const addButton = document.querySelector('.button');
      expect(addButton).not.toBeNull();
    });

    test('Title of the add button is displayed', () => {
      const addButton = document.querySelector('.button');
      expect(addButton.textContent).toBe('Add');
    });

    test('Type of the add button is submit', () => {
      const addButton = document.querySelector('.button');
      expect(addButton.getAttribute('type')).toBe('submit');
    });
  });

  describe('Navigation bar testing', () => {
    test('Navigation bar is displayed', () => {
      const navBarElement = document.querySelector('nav');
      expect(navBarElement).not.toBeNull();
    });

    test('Three options (all, assigned, completed) are displayed in the navigation bar', () => {
      const navBarElement = document.querySelector('nav');
      const radioButtons = navBarElement.querySelectorAll('input[type="radio"]');
      expect(radioButtons.length).toBe(3);
    });

    test('Label of the three options are All, Assigned, Completed', () => {
      const navBarElement = document.querySelector('nav');
      const radioButtons = navBarElement.querySelectorAll('input[type="radio"]');
      const labels = [];
      radioButtons.forEach(radioButton => {
        const label = document.querySelector(`label[for="${radioButton.id}"]`);
        if (label) {
          labels.push(label.textContent);
        }
      });
      expect(labels).toEqual(["All", "Assigned", "Completed"]);
    });

    test('All option is the default selected one', () => {
      const navBarElement = document.querySelector('nav');
      const allRadioButton = navBarElement.querySelector('#all');
      expect(allRadioButton.checked).toBe(true);
    });
  });

  describe('Task board testing', () => {
    test('No tasks available, No assigned tasks, and No completed messages are initially set to display: none', () => {
      const messageContainer = document.querySelector('.message-container');
      const noTasksMessage = messageContainer.querySelector('.no-tasks-message');
      const noAssignedTasksMessage = messageContainer.querySelector('.no-assigned-tasks-message');
      const noCompletedTasksMessage = messageContainer.querySelector('.no-completed-tasks-message');
    
      expect(window.getComputedStyle(noTasksMessage).display).toBe('none');
      expect(window.getComputedStyle(noAssignedTasksMessage).display).toBe('none');
      expect(window.getComputedStyle(noCompletedTasksMessage).display).toBe('none');
    });

    test('Task board is displayed', () => {
      const showTasks = document.querySelector(".showtasks");
      expect(showTasks).not.toBeNull();
    });
  });

  describe('Delete all button testing', () => {
    test('Delete all button is displayed', () => {
      const deleteButton = document.querySelector('.delete-all');
      expect(deleteButton).not.toBeNull();
    });

    test('Title of the delete all button is displayed', () => {
      const deleteButton = document.querySelector('.delete-all');
      expect(deleteButton.textContent).toBe('Delete all Tasks');
    });
  });
  describe('Other components testing',()=>{
    test('Error message container is present but empty initially',()=>{
        const errormessagecontainer=document.querySelector('.error-message');
        expect(errormessagecontainer).not.toBeNull();
        expect(errormessagecontainer.textContent).toBe('')
    })
    test('Toast message container is present',()=>{
        const toastMessage=document.querySelector('.toast')
        expect(toastMessage).not.toBeNull();
    })
    test('Overlay container is present and not displayed initially',()=>{
        const overlay=document.querySelector('.overlay')
        expect(overlay).not.toBeNull();
        expect(overlay.textContent).toBe('');
    })
  })
});
describe('Javascript testing', () => {
  let inputBox;
  let showtasks;
  let form;
  let errormessage;
  let inputButton;
  let deleteAllButton;
  let assigned;
  let completed;
  let all;
  let noTasksMessage;
  let noAssignedTasksMessage;
  let noCompletedTasksMessage; 

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, 'todolist.html'), 'utf8');
    document.body.innerHTML = html;
  

    inputBox = document.querySelector("#inputtask");
    showtasks = document.querySelector(".showtasks");
    form = document.querySelector("#form");
    errormessage = document.querySelector(".error-message");
    inputButton = document.querySelector(".button");
    deleteAllButton=document.querySelector(".delete-all")
    assigned = document.querySelector("#assigned");
    completed = document.querySelector("#completed");
    all = document.querySelector("#all");
    noTasksMessage = document.querySelector('.no-tasks-message');
    noAssignedTasksMessage = document.querySelector('.no-assigned-tasks-message');
    noCompletedTasksMessage = document.querySelector('.no-completed-tasks-message');

    jest.resetModules();
    require('./script.js');

    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  })
  afterEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
    localStorage.clear.mockClear();
    jest.useRealTimers(); 
});

  describe('Add functionality testing', () => {
    test('should add a new task when input is valid', () => {

      const randomString = chance.string();
      inputBox.value = randomString;
      form.dispatchEvent(new Event('submit'));
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString);
      expect(errormessage.innerHTML).toBe('Task added successfully');
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1500);
      jest.runAllTimers();
      expect(errormessage.innerHTML).toBe("");
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: randomString, status: "assigned" }]));
    });
    

    test('should show an error message when input is empty', () => {
      inputBox.value = '';
      form.dispatchEvent(new Event('submit'));

      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot be empty.');
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1800);
      jest.runAllTimers();
      expect(errormessage.innerHTML).toBe("");
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('should show an error message when input starts with a space', () => {
      inputBox.value = ' New Task';
      form.dispatchEvent(new Event('submit'));

      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot start with a space.');
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1800);
      jest.runAllTimers();
      expect(errormessage.innerHTML).toBe("");
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('should add a new task when input is valid when the add button is pressed', () => {
      const randomString = chance.string();
      inputBox.value = randomString;
      inputButton.dispatchEvent(new Event('click'));

      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString);
      expect(errormessage.innerHTML).toBe('Task added successfully');
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: randomString, status: "assigned" }]));
    });

    test('should show an error message when input is empty when the add button is pressed', () => {
      inputBox.value = '';
      inputButton.dispatchEvent(new Event('click'));

      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot be empty.');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('should show an error message when input starts with a space when the add button is pressed', () => {
      inputBox.value = ' New Task';
      inputButton.dispatchEvent(new Event('click'));

      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot start with a space.');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("Delete functionality testing", () => {
    test('should delete a specific task when its delete button is clicked', () => {
      inputBox.value = 'Task to delete';
      form.dispatchEvent(new Event('submit'));

      let tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe('Task to delete');

      inputBox.value = 'Another task';
      form.dispatchEvent(new Event('submit'));

      tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(2);

      const deleteButton = tasks[0].querySelector(".deletebtn");
      expect(deleteButton.querySelector(".deletebtni").src).toContain('bin.png');
      deleteButton.click();

      tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe('Another task');
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe("Complete task functionality testing", () => {
    test('should mark a task as completed when the completion button is clicked', () => {
      inputBox.value = 'Task to complete';
      form.dispatchEvent(new Event('submit'));

      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      const task = tasks[0];
      const taskName = task.querySelector(".taskname");
      const checkButton = task.querySelector(".checkbtn");

      expect(task.getAttribute("data-status")).toBe('assigned');
      const computedStyle = window.getComputedStyle(taskName);
      expect(computedStyle.backgroundColor).toBe('aliceblue');
      expect(checkButton.querySelector(".checkbtni").src).toContain('radio-button.png');

      checkButton.click();

      expect(task.getAttribute("data-status")).toBe('completed');
      expect(window.getComputedStyle(taskName).backgroundColor).toBe('rgb(208, 208, 208)'); 
      expect(checkButton.querySelector(".checkbtni").src).toContain('check-mark.png');
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should unmark a task as completed when the completion button is clicked again', () => {
      inputBox.value = 'Completed task';
      form.dispatchEvent(new Event('submit'));

      const tasks = showtasks.querySelectorAll(".showtasks1");
      const task = tasks[0];
      const checkButton = task.querySelector(".checkbtn");
      const taskName = task.querySelector(".taskname");

      checkButton.click();
      expect(task.getAttribute("data-status")).toBe('completed');

      checkButton.click();

      expect(task.getAttribute("data-status")).toBe('assigned');
      const computedStyle = window.getComputedStyle(taskName);
      expect(computedStyle.backgroundColor).toBe('aliceblue');
      expect(checkButton.querySelector(".checkbtni").src).toContain('radio-button.png');
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
  describe("Delete-all functionality testing",()=>{
    test('should delete all tasks when delete all button is clicked', () => {
      inputBox.value = 'Task 1';
      form.dispatchEvent(new Event('submit'));
      inputBox.value = 'Task 2';
      form.dispatchEvent(new Event('submit'));
      let tasksBeforeDeleteAll = showtasks.querySelectorAll(".showtasks1");
      expect(tasksBeforeDeleteAll.length).toBe(2);
      deleteAllButton.click();
      const toastConfirm = document.querySelector("#toast-confirm");
      toastConfirm.click();
      const tasksAfterDeleteAll = showtasks.querySelectorAll(".showtasks1");
      expect(tasksAfterDeleteAll.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Tasks deleted successfully.');

      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([]));
      expect(setTimeout).toHaveBeenCalledTimes(4);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1500);
      jest.runAllTimers();
      expect(errormessage.innerHTML).toBe("");
    });
    test('The label of the delete-all button should change depending upon the filter',()=>{
      expect(deleteAllButton.innerHTML).toBe("Delete all Tasks");
      assigned.click();
      expect(deleteAllButton.innerHTML).toBe("Delete all assigned tasks");
      completed.click();
      expect(deleteAllButton.innerHTML).toBe("Delete all completed tasks");
      all.click();
      expect(deleteAllButton.innerHTML).toBe("Delete all tasks");
    })
  })
  describe('Edit functionality testing', () => {
    test('should enable editing when edit button is clicked', () => {
      inputBox.value = 'Initial Task';
      form.dispatchEvent(new Event('submit'));

      const task = showtasks.querySelector(".showtasks1");
      const editButton = task.querySelector(".editbtn");
      expect(editButton.querySelector(".editbtni").src).toContain('edit.png');

      editButton.click();
      const taskName = task.querySelector(".taskname");

      expect(taskName.readOnly).toBe(false);
      expect(taskName.style.outline).toBe('2px solid #413f64');
      expect(editButton.querySelector(".editbtni").src).toContain('diskette.png');
      expect(editButton.title).toBe('Save the task');
    });

    test('should save task when save button is clicked after editing', () => {
      inputBox.value = 'Task to Edit';
      form.dispatchEvent(new Event('submit'));

      const task = showtasks.querySelector(".showtasks1");
      const editButton = task.querySelector(".editbtn");
      editButton.click(); // Enter edit mode

      const taskName = task.querySelector(".taskname");
      taskName.value = 'Updated Task';
      editButton.click(); // Save task

      expect(taskName.readOnly).toBe(true);
      expect(taskName.style.outline).toBe('none');
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: 'Updated Task', status: 'assigned' }]));
    });

    test('should show error message and not save if task name is empty when saving', () => {
      inputBox.value = 'Task to Edit';
      form.dispatchEvent(new Event('submit'));
      const task = showtasks.querySelector(".showtasks1");
      const editButton = task.querySelector(".editbtn");
      editButton.click(); // Enter edit mode

      const taskName = task.querySelector(".taskname");
      taskName.value = '';
      editButton.click(); // Try to save task
      expect(taskName.classList.contains('error')).toBe(true);
      expect(taskName.placeholder).toBe('Task cannot be empty!');
      const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      taskName.dispatchEvent(inputEvent);
      expect(taskName.classList.contains('error')).not.toBe(true);
      expect(taskName.placeholder).toBe('');
      
    });


    test('should save task when Enter key is pressed while editing', () => {
      inputBox.value = 'Task to Edit';
      form.dispatchEvent(new Event('submit'));

      const task = showtasks.querySelector(".showtasks1");
      const editButton = task.querySelector(".editbtn");
      editButton.click(); // Enter edit mode

      const taskName = task.querySelector(".taskname");
      taskName.value = 'Updated via Enter';
      taskName.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(taskName.readOnly).toBe(true);
      expect(taskName.style.outline).toBe('none');
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: 'Updated via Enter', status: 'assigned' }]));
    });

    test('should prevent editing if another task is being edited', () => {
      inputBox.value = 'First Task';
      form.dispatchEvent(new Event('submit'));
      inputBox.value = 'Second Task';
      form.dispatchEvent(new Event('submit'));
      let tasks = showtasks.querySelectorAll(".showtasks1");
      const editButton1= tasks[0].querySelector(".editbtn");
      const editButton2= tasks[1].querySelector(".editbtn");
      editButton1.click();
      editButton2.click();
      expect(tasks[0].querySelector(".taskname").readOnly).toBe(false); 
      expect(tasks[1].querySelector(".taskname").readOnly).toBe(true); 
    });

    test('Delete all button should be disabled while editing',()=>{
      inputBox.value = 'First Task';
      form.dispatchEvent(new Event('submit'));
      let tasks = showtasks.querySelector(".showtasks1");
      const editButton= tasks.querySelector(".editbtn");
      editButton.click();
      expect(deleteAllButton.disabled).toBe(true);
    })
    test('Input box should be disabled while editing',()=>{
      inputBox.value = 'First Task';
      form.dispatchEvent(new Event('submit'));
      let tasks = showtasks.querySelector(".showtasks1");
      const editButton= tasks.querySelector(".editbtn");
      editButton.click();
      expect(inputBox.disabled).toBe(true);
    })
    test('Add button should be disabled while editing',()=>{
      inputBox.value = 'First Task';
      form.dispatchEvent(new Event('submit'));
      let tasks = showtasks.querySelector(".showtasks1");
      const editButton= tasks.querySelector(".editbtn");
      editButton.click();
      expect(inputButton.disabled).toBe(true);
    })

  });
  describe ('Error message disapperance testing',()=>{
    test('Error message disapperance while focusing the inputbox',()=>{
      inputBox.value = '';
      form.dispatchEvent(new Event('submit'));
      inputBox.focus();
      expect(errormessage.innerHTML).toBe('');
    })
    test('Error message disapperance while typing in the inputbox',()=>{
      inputBox.value = '';
      const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      inputBox.dispatchEvent(inputEvent);
      expect(errormessage.innerHTML).toBe('');
    })
  })
  describe('Load tasks from local storage', () => {
    beforeEach(() => {
      const mockTasks = [
        { name: 'Task 1', status: 'assigned' },
        { name: 'Task 2', status: 'completed' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
    });
  
    test('should load tasks from localStorage on DOMContentLoaded', () => {
      window.loadTasksFromLocalStorage();
      const taskContainers = document.querySelectorAll('.showtasks1');
        expect(taskContainers.length).toBe(2);

        const firstTask = taskContainers[0];
        expect(firstTask.querySelector('.taskname').value).toBe('Task 1');
        expect(firstTask.getAttribute('data-status')).toBe('assigned');
        expect(firstTask.querySelector('.checkbtni').src).toContain('radio-button.png');

       
        const secondTask = taskContainers[1];
        expect(secondTask.querySelector('.taskname').value).toBe('Task 2');
        expect(secondTask.getAttribute('data-status')).toBe('completed');
        expect(secondTask.querySelector('.checkbtni').src).toContain('check-mark.png');
    });
  
    test('should not display any tasks if localStorage is empty', () => {
      
      localStorage.getItem.mockReturnValue(JSON.stringify([]));
      window.loadTasksFromLocalStorage();
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
    });
    test('should persist tasks after page reload', () => {
      window.loadTasksFromLocalStorage(); 
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(2);
    });
    
  });
  describe('Toast message testing',()=>{
    test('Toast message testing in all filter',()=>{
      inputBox.value='Task is added';
      inputButton.click();
      deleteAllButton.click();
      const toast=document.querySelector(".toast")
      const toastMessage=toast.querySelector("#toast-message")
      expect(toastMessage.textContent).toBe('Do you want to delete all tasks?')
    })
    test('Toast message testing in assigned filter',()=>{
      inputBox.value='Task is added';
      inputButton.click();
      assigned.click()
      deleteAllButton.click();
      const toast=document.querySelector(".toast")
      const toastMessage=toast.querySelector("#toast-message")
      expect(toastMessage.textContent).toBe('Do you want to delete all assigned tasks?')
    })
    test('Toast message testing in completed filter',()=>{
      inputBox.value='Task is added';
      inputButton.click();
      const task = showtasks.querySelector(".showtasks1");
      const checkButton = task.querySelector(".checkbtn");
      checkButton.click()
      completed.click()
      deleteAllButton.click();
      const toast=document.querySelector(".toast")
      const toastMessage=toast.querySelector("#toast-message")
      expect(toastMessage.textContent).toBe('Do you want to delete all completed tasks?')
    })
  })
  describe('Only the particular tasks are displayed in the particular filter',()=>{
    test('All tasks are displayed in all section',()=>{
      inputBox.value = 'First Task';
      form.dispatchEvent(new Event('submit'));
      inputBox.value = 'Second Task';
      form.dispatchEvent(new Event('submit'));
      let tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(2);
    })
    test('Only assigned tasks are displayed in the assigned section',()=>{
      inputBox.value = 'First Task';
      form.dispatchEvent(new Event('submit'));
      inputBox.value = 'Second Task';
      form.dispatchEvent(new Event('submit'));
      let tasks = showtasks.querySelectorAll(".showtasks1");
      const completeButton1= tasks[0].querySelector(".checkbtn");
      completeButton1.click();
      assigned.click()
      let assignedTasks = Array.from(tasks).filter(task => 
      task.getAttribute('data-status') === 'assigned'
        )
      expect(assignedTasks.length).toBe(1)
    })
    test('Only completed tasks are displayed in the completed section',()=>{
      inputBox.value = 'First Task';
      form.dispatchEvent(new Event('submit'));
      inputBox.value = 'Second Task';
      form.dispatchEvent(new Event('submit'));
      let tasks = showtasks.querySelectorAll(".showtasks1");
      const completeButton1= tasks[0].querySelector(".checkbtn");
      completeButton1.click();
      completed.click()
      let completedTasks = Array.from(tasks).filter(task => 
      task.getAttribute('data-status') === 'completed'
        )
      expect(completedTasks.length).toBe(1)
    })
  });

  describe('showToast Function testing', () => {
    beforeEach(() => {
      global.toast = document.querySelector("#toast");
      global.toastMessage = document.querySelector("#toast-message");
      global.toastConfirm = document.querySelector("#toast-confirm");
      global.toastCancel = document.querySelector("#toast-cancel");
      global.overlay = document.querySelector(".overlay");
  

      const { showToast, addTask } = require('./script.js'); 
      global.showToast = showToast;
    });
  
    test('should display toast and overlay, and call onConfirm when confirm button is clicked', () => {
      const onConfirm = jest.fn();
  
      showToast('Test Message', onConfirm, () => {});
  
      expect(global.toast.style.display).toBe('flex');
      expect(global.overlay.style.display).toBe('block');
      expect(global.toastMessage.textContent).toBe('Test Message');
  
      
      global.toastConfirm.dispatchEvent(new Event('click'));
  
      expect(onConfirm).toHaveBeenCalled();
      expect(global.toast.style.display).toBe('none');
      expect(global.overlay.style.display).toBe('none');
    });
  
    test('should display toast and overlay, and call onCancel when cancel button is clicked', () => {
      const onCancel = jest.fn();
  
      showToast('Test Message', () => {}, onCancel);
  
      expect(global.toast.style.display).toBe('flex');
      expect(global.overlay.style.display).toBe('block');
      expect(global.toastMessage.textContent).toBe('Test Message');
  
      
      global.toastCancel.dispatchEvent(new Event('click'));
  
      expect(onCancel).toHaveBeenCalled();
      expect(global.toast.style.display).toBe('none');
      expect(global.overlay.style.display).toBe('none');
    });
  
    test('should hide toast and overlay after 10 seconds if no action is taken', () => {
      jest.useFakeTimers();
  
      const onCancel = jest.fn();
      showToast('Test Message', () => {}, onCancel);
  
      expect(global.toast.style.display).toBe('flex');
      expect(global.overlay.style.display).toBe('block');
  
     
      jest.advanceTimersByTime(10000);
  
      expect(global.toast.style.display).toBe('none');
      expect(global.overlay.style.display).toBe('none');
      expect(onCancel).toHaveBeenCalled();
  
      jest.useRealTimers();
    });
  });

  describe('filterTasks function', () => {
    beforeEach(() => {
      filterTasks = require('./script.js').filterTasks;
    });

    const addTask = (taskName, status = 'assigned') => {
      inputBox.value = taskName;
      form.dispatchEvent(new Event('submit'));
      const task = showtasks.querySelector(".showtasks1:last-child");
      task.setAttribute('data-status', status);
    };

    test('should show all tasks when "all" filter is selected', () => {
      addTask('Task 1');
      addTask('Task 2', 'completed');
      all.click();
      filterTasks('all');

      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(2);
      expect(tasks[0].querySelector(".taskname").value).toBe('Task 1');
      expect(tasks[1].querySelector(".taskname").value).toBe('Task 2');
    });

    test('should show only assigned tasks when "assigned" filter is selected', () => {
      addTask('Task 1');
      addTask('Task 2', 'completed');
      assigned.click();
      filterTasks('assigned');
      let tasks = showtasks.querySelectorAll(".showtasks1[data-status='assigned']");
      expect(tasks[0].querySelector(".taskname").value).toBe('Task 1');
      expect(tasks.length).toBe(1);
    });

    test('should show only completed tasks when "completed" filter is selected', () => {
      addTask('Task 1');
      addTask('Task 2', 'completed');
      completed.click();
      filterTasks('completed');
      let tasks = showtasks.querySelectorAll(".showtasks1[data-status='completed']");
      expect(tasks[0].querySelector(".taskname").value).toBe('Task 2');
      expect(tasks.length).toBe(1);
    });

    test('should show no tasks when "completed" filter is selected and there are no completed tasks', () => {
      addTask('Task 1');
      addTask('Task 2');
      completed.click();
      filterTasks('completed');
      let tasks = showtasks.querySelectorAll(".showtasks1[data-status='completed']");
      expect(tasks.length).toBe(0);
    });

    test('should show no tasks when "assigned" filter is selected and there are no assigned tasks', () => {
      addTask('Task 1', 'completed');
      addTask('Task 2', 'completed');
      assigned.click();
      filterTasks('assigned');
      let tasks = showtasks.querySelectorAll(".showtasks1[data-status='assigned']");
      expect(tasks.length).toBe(0);
    });
  });
  describe('No task message function testing',()=>{
      
    
      const addTask = (taskName, status = 'assigned') => {
        inputBox.value = taskName;
        form.dispatchEvent(new Event('submit'));
        const task = showtasks.querySelector(".showtasks1:last-child");
        task.setAttribute('data-status', status);
      };

    test('should display the no tasks available message when there are no tasks', () => {
      expect(noTasksMessage.style.display).toBe('block');
    });
  
    test('should display no assigned tasks message when there are no assigned tasks', () => {
      
      addTask('Task 1', 'completed');
      addTask('Task 2', 'completed');
      assigned.click();
      expect(noTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('block')
      expect(noCompletedTasksMessage.style.display).toBe('none')
      all.click();
      expect(noTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('none')
      expect(noCompletedTasksMessage.style.display).toBe('none')
      completed.click();
      expect(noTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('none')
      expect(noCompletedTasksMessage.style.display).toBe('none')
    });
    test('should display no completed tasks message when there are no completed tasks', () => {
      
      addTask('Task 1');
      addTask('Task 2');
      assigned.click();
      expect(noTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('none')
      expect(noCompletedTasksMessage.style.display).toBe('none')
      all.click();
      expect(noTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('none')
      expect(noCompletedTasksMessage.style.display).toBe('none')
      completed.click();
      expect(noTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('none')
      expect(noCompletedTasksMessage.style.display).toBe('block')
    });
  })
 
  describe('Delete all tasks depending upon the filter testing', () => {
    const addTask = (taskName, status = 'assigned') => {
      inputBox.value = taskName;
      form.dispatchEvent(new Event('submit'));
      const task = showtasks.querySelector(".showtasks1:last-child");
      task.setAttribute('data-status', status);
    };

    test('should delete all tasks when "all" filter is applied and confirm message is shown', () => {
      addTask('Task 1');
      addTask('Task 2', 'completed');
      deleteAllButton.click();
      const toastConfirm = document.querySelector("#toast-confirm");
      toastConfirm.click();
      expect(document.querySelectorAll(".showtasks1").length).toBe(0);
      expect(errormessage.style.color).toBe("green");
      expect(errormessage.innerHTML).toBe("Tasks deleted successfully.");
    });

    test('should delete only assigned tasks when "assigned" filter is applied and confirm message is shown', () => {
      addTask('Task 1');
      addTask('Task 2', 'completed');
      assigned.click();
      deleteAllButton.click();
      const toastConfirm = document.querySelector("#toast-confirm");
      toastConfirm.click();
      const remainingTasks = document.querySelectorAll(".showtasks1");
      expect(remainingTasks.length).toBe(1);
      expect(remainingTasks[0].querySelector(".taskname").value).toBe('Task 2');
      expect(errormessage.style.color).toBe("green");
      expect(errormessage.innerHTML).toBe("Tasks deleted successfully.");
    });

    test('should delete only completed tasks when "completed" filter is applied and confirm message is shown', () => {
      addTask('Task 1');
      addTask('Task 2', 'completed');
      completed.click()
      deleteAllButton.click();
      const toastConfirm = document.querySelector("#toast-confirm");
      toastConfirm.click();
      const remainingTasks = showtasks.querySelectorAll(".showtasks1");
      expect(remainingTasks.length).toBe(1);
      expect(remainingTasks[0].querySelector(".taskname").value).toBe('Task 1');
      expect(errormessage.style.color).toBe("green");
      expect(errormessage.innerHTML).toBe("Tasks deleted successfully.");
    });
  });
  describe('Individual functions testing',()=>{
    test('Testing assigned tasks function',()=>{
      inputBox.value='task';
      inputButton.click()
      const {assignedTasks}=require("./script.js")
      assignedTasks()
      const tasks=document.querySelectorAll(".showtasks1")
      tasks.forEach(task => {
        expect(task.style.display).toBe('flex');
      })
    }) 
    test('Testing all tasks function',()=>{
      inputBox.value='task';
      inputButton.click()
      inputBox.value='task2';
      inputButton.click()
      const {allTasks}=require("./script.js")
      allTasks()
      const tasks=document.querySelectorAll(".showtasks1")
      tasks.forEach(task => {
        expect(task.style.display).toBe('flex');
      })
    }) 
    test('Testing completed tasks function',()=>{
      inputBox.value='task';
      inputButton.click()
      inputBox.value='task2';
      inputButton.click()
      const tasks = showtasks.querySelectorAll(".showtasks1");
      const checkButton1 = tasks[0].querySelector(".checkbtn");
      const checkButton2 = tasks[1].querySelector(".checkbtn");
      checkButton1.click()
      checkButton2.click()
      const {completedTasks}=require("./script.js")
      completedTasks()
      tasks.forEach(task => {
        expect(task.style.display).toBe('flex');
      })
    }) 
    test('Checkforemptystates function testing',()=>{
      inputBox.value='task';
      inputButton.click()
      inputBox.value='task2';
      inputButton.click()
      const tasks = showtasks.querySelectorAll(".showtasks1");
      const checkButton1 = tasks[0].querySelector(".checkbtn");
      checkButton1.click()
      const {checkForEmptyStates}=require("./script.js")
      checkForEmptyStates(assigned)
      expect(noTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('none')
      expect(noCompletedTasksMessage.style.display).toBe('none')
      checkForEmptyStates(completed)
      expect(noTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('none')
      expect(noCompletedTasksMessage.style.display).toBe('none')
      checkForEmptyStates(all)
      expect(noTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('none')
      expect(noCompletedTasksMessage.style.display).toBe('none')
    })
    
    test('update delete all button text function testing',()=>{
      const {updateDeleteAllButtonText}=  require('./script.js')
      all.click()
      updateDeleteAllButtonText();
      expect(deleteAllButton.innerHTML).toBe("Delete all Tasks")
      assigned.click()
      updateDeleteAllButtonText();
      expect(deleteAllButton.innerHTML).toBe("Delete all assigned tasks")
      expect(deleteAllButton.title).toBe("Delete all assigned tasks")
      completed.click()
      updateDeleteAllButtonText();
      expect(deleteAllButton.innerHTML).toBe("Delete all completed tasks")
      expect(deleteAllButton.title).toBe("Delete all completed tasks")
    })
    test('Create button function testing',()=>{
      inputBox.value='task'
      inputButton.click()
      const {createButton}=require("./script.js")
      const task = showtasks.querySelector(".showtasks1");
      createButton("editbtn", "./images/edit.png", "editbtni","Edit the task")
      const button=task.querySelector('.editbtn')
      expect(button.querySelector(".editbtni").src).toContain('edit.png');
    })
  })
});