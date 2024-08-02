const fs = require('fs');
const path = require('path');
const Chance = require('chance');
const chance = new Chance();
describe('HTML Testing', () => {
  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, 'todolist.html'), 'utf8');
    document.body.innerHTML = html;
  });
  test('All html components are correctly displayed', () => {
    //query-selectors
    const titleElement = document.querySelector('.title');
    const inputElement = document.querySelector('#inputtask');
    const addButton = document.querySelector('.button');
    const navBarElement = document.querySelector('nav');
    const radioButtons = navBarElement.querySelectorAll('input[type="radio"]');
    const allRadioButton = navBarElement.querySelector('#all');
    const messageContainer = document.querySelector('.message-container');
    const noTasksMessage = messageContainer.querySelector('.no-tasks-message');
    const noAssignedTasksMessage = messageContainer.querySelector('.no-assigned-tasks-message');
    const noCompletedTasksMessage = messageContainer.querySelector('.no-completed-tasks-message');
    const showTasks = document.querySelector(".showtasks");
    const deleteAllButton = document.querySelector('.delete-all');
    const errormessagecontainer=document.querySelector('.error-message');
    const toastMessage=document.querySelector('.toast')
    const overlay=document.querySelector('.overlay')

    //Whether the title is displayed and the check the text content of title
    expect(titleElement).not.toBeNull();
    expect(titleElement.textContent).toBe('To-Do List');

    //Whether the input text box is displayed and check its attributes
    expect(inputElement).not.toBeNull();
    expect(inputElement.getAttribute('placeholder')).toBe('Enter the task');
    expect(inputElement.getAttribute('autocomplete')).toBe('off');
    expect(inputElement.maxLength).toBe(150);
    
    //Whether the add button is displayed and check its title and type
    expect(addButton).not.toBeNull();
    expect(addButton.textContent).toBe('Add');
    expect(addButton.disabled).toBe(false)
    expect(addButton.getAttribute('type')).toBe('submit');
    
    //Whether the nav bar is displayed
    expect(navBarElement).not.toBeNull();
    
    //Whether there are three options in the nav bar and they are all,assigned,completed
    expect(radioButtons.length).toBe(3);
    const labels = [];
    radioButtons.forEach(radioButton => {
      const label = document.querySelector(`label[for="${radioButton.id}"]`);
      if (label) {
        labels.push(label.textContent);
      }
    });
    expect(labels).toEqual(["All", "Assigned", "Completed"]);
    
    //Whether the all option is selected initially
    expect(allRadioButton.checked).toBe(true)
    
    //whether the display of all no task messages are set to none initially
    expect(window.getComputedStyle(noTasksMessage).display).toBe('none');
    expect(window.getComputedStyle(noAssignedTasksMessage).display).toBe('none');
    expect(window.getComputedStyle(noCompletedTasksMessage).display).toBe('none');
    
    //Whether the task board is displayed 
    expect(showTasks).not.toBeNull();
    
    //Whether the delete all button is displayed and check its title
    expect(deleteAllButton).not.toBeNull();
    expect(deleteAllButton.textContent).toBe('Delete all tasks');
    expect(deleteAllButton.disabled).toBe(false)
   
    //Whether the errormessage is present and empty initially
    expect(errormessagecontainer).not.toBeNull();
    expect(errormessagecontainer.textContent).toBe('')
    
    //Whether the toast message is present and empty initially
    expect(toastMessage).not.toBeNull();
    
    //Whether the overlay is present and empty initially
    expect(overlay).not.toBeNull();
    expect(overlay.textContent).toBe('');
  }); 
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
  let navBarElement;
  let allRadioButton;
  let assignedRadioButton;
  let completedRadioButton;
  let randomString = chance.string();
  let randomString2 = chance.string();
  const addTask = (taskName, status = 'assigned') => {
    inputBox.value = taskName;
    form.dispatchEvent(new Event('submit'));
    const task = showtasks.querySelector(".showtasks1:last-child");
    task.setAttribute('data-status', status);
  };

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
    navBarElement = document.querySelector('nav');
    allRadioButton = navBarElement.querySelector('#all');
    assignedRadioButton = navBarElement.querySelector('#assigned');
    completedRadioButton = navBarElement.querySelector('#completed');

    jest.resetModules();
    require('./script.js');
  
    // mock timers
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    //mock local storage
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
      inputBox.value = randomString;
      form.dispatchEvent(new Event('submit'));
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString);
      expect(errormessage.innerHTML).toBe('Task added successfully');
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1500);
      jest.runAllTimers();
      expect(allRadioButton.checked).toBe(true)
      expect(assignedRadioButton.checked).toBe(false)
      expect(completedRadioButton.checked).toBe(false)
      expect(errormessage.innerHTML).toBe("");
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: randomString, status: "assigned" }]));
      let ctasks = showtasks.querySelectorAll(".showtasks1[data-status='completed']");
      expect(ctasks.length).toBe(0);
    });
    
    test('When adding a task in completed section it automatically moves to all section',()=>{
      completed.click()
      inputBox.value = randomString;
      form.dispatchEvent(new Event('submit'));
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString);
      expect(errormessage.innerHTML).toBe('Task added successfully');
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1500);
      jest.runAllTimers();
      expect(allRadioButton.checked).toBe(true)
      expect(errormessage.innerHTML).toBe("");
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: randomString, status: "assigned" }]));
    })

    test('When adding a task in assigned section it automatically moves to all section',()=>{
      assigned.click()
      inputBox.value = randomString;
      form.dispatchEvent(new Event('submit'));
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString);
      expect(errormessage.innerHTML).toBe('Task added successfully');
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1500);
      jest.runAllTimers();
      expect(allRadioButton.checked).toBe(true)
      expect(errormessage.innerHTML).toBe("");
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: randomString, status: "assigned" }]));
    })

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
      inputBox.value = randomString;
      expect(inputButton.disabled).toBe(false);
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
  describe ('Error message disapperance testing',()=>{
    test('Error message disapperance while focusing/typing the inputbox',()=>{
      inputBox.value = '';
      form.submit()
      inputBox.focus();
      expect(errormessage.innerHTML).toBe('');
      
      inputBox.value = '';
      form.submit()
      const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      inputBox.dispatchEvent(inputEvent);
      expect(errormessage.innerHTML).toBe('');
    })
  })
  describe("Complete task functionality testing", () => {
    test('should mark a task as completed when the completion button is clicked', () => {
      addTask(randomString)
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      const taskName = tasks[0].querySelector(".taskname");
      const checkButton = tasks[0].querySelector(".checkbtn");
      expect(tasks[0].getAttribute("data-status")).toBe('assigned');
      const computedStyle = window.getComputedStyle(taskName);
      expect(computedStyle.backgroundColor).toBe('aliceblue');
      expect(checkButton.querySelector(".checkbtni").src).toContain('radio-button.png');
      expect(checkButton.disabled).toBe(false);
      checkButton.click();
      expect(tasks[0].getAttribute("data-status")).toBe('completed');
      expect(window.getComputedStyle(taskName).backgroundColor).toBe('rgb(208, 208, 208)'); 
      expect(checkButton.querySelector(".checkbtni").src).toContain('check-mark.png');
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should unmark a task as completed when the completion button is clicked again', () => {
      addTask(randomString)

      const tasks = showtasks.querySelectorAll(".showtasks1");
      const checkButton = tasks[0].querySelector(".checkbtn");
      const taskName = tasks[0].querySelector(".taskname");
      checkButton.click();
      expect(tasks[0].getAttribute("data-status")).toBe('completed');
      checkButton.click();
      expect(tasks[0].getAttribute("data-status")).toBe('assigned');
      const computedStyle = window.getComputedStyle(taskName);
      expect(computedStyle.backgroundColor).toBe('aliceblue');
      expect(checkButton.querySelector(".checkbtni").src).toContain('radio-button.png');
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
  describe("Delete functionality testing", () => {
    test('should delete a specific task when its delete button is clicked', () => {
      addTask(randomString)
      let tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString);
      addTask(randomString2)
      tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(2);
      const deleteButton = tasks[0].querySelector(".deletebtn");
      expect(deleteButton.querySelector(".deletebtni").src).toContain('bin.png');
      expect(deleteButton.disabled).toBe(false);
      deleteButton.click();
      tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString2);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
  describe('Edit functionality testing', () => {
    test('should enable editing when edit button is clicked', () => {
      addTask(randomString)
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
      addTask(randomString)
      const task = showtasks.querySelector(".showtasks1");
      const editButton = task.querySelector(".editbtn");
      editButton.click(); // Enter edit mode
      const taskName = task.querySelector(".taskname");
      taskName.value = randomString2;
      editButton.click(); // Save task
      expect(taskName.readOnly).toBe(true);
      expect(taskName.style.outline).toBe('none');
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: randomString2, status: 'assigned' }]));
    });

    test('should show error message and not save if task name is empty when saving', () => {
      addTask(randomString)
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
      addTask(randomString)
      const task = showtasks.querySelector(".showtasks1");
      const editButton = task.querySelector(".editbtn");
      editButton.click(); // Enter edit mode
      const taskName = task.querySelector(".taskname");
      taskName.value = randomString2;
      taskName.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(taskName.readOnly).toBe(true);
      expect(taskName.style.outline).toBe('none');
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: randomString2, status: 'assigned' }]));
    });

    test('Should not save the the task when other keys are pressed while editing',()=>{
      addTask(randomString)
      const task = showtasks.querySelector(".showtasks1");
      const editButton = task.querySelector(".editbtn");
      editButton.click(); // Enter edit mode
      const taskName = task.querySelector(".taskname");
      taskName.value = randomString2;
      const randomKeys = ['Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Space'];
      randomKeys.forEach(key => {
        const event = new KeyboardEvent('keydown', { key });
        taskName.dispatchEvent(event);
      expect(localStorage.setItem).not.toHaveBeenCalledWith("tasks", JSON.stringify([{ name: randomString2, status: 'assigned' }]));
      })
    })

    test('should prevent editing if another task is being edited', () => {
      addTask(randomString)
      addTask(randomString2)
      let tasks = showtasks.querySelectorAll(".showtasks1");
      const editButton1= tasks[0].querySelector(".editbtn");
      const editButton2= tasks[1].querySelector(".editbtn");
      editButton1.click();
      editButton2.click();
      expect(tasks[0].querySelector(".taskname").readOnly).toBe(false); 
      expect(tasks[1].querySelector(".taskname").readOnly).toBe(true); 
    });

    test('Delete all button should be disabled while editing',()=>{
      addTask(randomString)
      let tasks = showtasks.querySelector(".showtasks1");
      const editButton= tasks.querySelector(".editbtn");
      editButton.click();
      expect(deleteAllButton.disabled).toBe(true);
    })
    test('Input box should be disabled while editing',()=>{
      addTask(randomString)
      let tasks = showtasks.querySelector(".showtasks1");
      const editButton= tasks.querySelector(".editbtn");
      editButton.click();
      expect(inputBox.disabled).toBe(true);
    })
    test('Add button should be disabled while editing',()=>{
      addTask(randomString)
      let tasks = showtasks.querySelector(".showtasks1");
      const editButton= tasks.querySelector(".editbtn");
      editButton.click();
      expect(inputButton.disabled).toBe(true);
    })
  });
  describe('No task message testing',()=>{
    test('should display the no tasks available message when there are no tasks', () => {
      expect(noTasksMessage.style.display).toBe('block');
    });
  
    test('should display no assigned tasks message when there are no assigned tasks', () => {
      addTask(randomString, 'completed');
      addTask(randomString2, 'completed');
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
      addTask(randomString);
      addTask(randomString2);
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
  describe('filterTasks function testing', () => {
    beforeEach(() => {
      filterTasks = require('./script.js').filterTasks;
    });
    test('should show all tasks when "all" filter is selected', () => {
      addTask(randomString);
      addTask(randomString2, 'completed');
      all.click();
      filterTasks('all');
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(2);
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString);
      expect(tasks[1].querySelector(".taskname").value).toBe(randomString2);
    });

    test('should show only assigned tasks when "assigned" filter is selected', () => {
      addTask(randomString);
      addTask(randomString2, 'completed');
      assigned.click();
      filterTasks('assigned');
      let tasks = showtasks.querySelectorAll(".showtasks1[data-status='assigned']");
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString);
      expect(tasks.length).toBe(1);
    });

    test('should show only completed tasks when "completed" filter is selected', () => {
      addTask(randomString);
      addTask(randomString2, 'completed');
      completed.click();
      filterTasks('completed');
      let tasks = showtasks.querySelectorAll(".showtasks1[data-status='completed']");
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString2);
      expect(tasks.length).toBe(1);
    });

    test('should show no tasks when "completed" filter is selected and there are no completed tasks', () => {
      addTask(randomString);
      addTask(randomString2);
      completed.click();
      filterTasks('completed');
      let tasks = showtasks.querySelectorAll(".showtasks1[data-status='completed']");
      expect(tasks.length).toBe(0);
    });

    test('should show no tasks when "assigned" filter is selected and there are no assigned tasks', () => {
      addTask(randomString, 'completed');
      addTask(randomString2, 'completed');
      assigned.click();
      filterTasks('assigned');
      let tasks = showtasks.querySelectorAll(".showtasks1[data-status='assigned']");
      expect(tasks.length).toBe(0);
    });
  });
  describe("Delete-all functionality testing",()=>{
    test('should delete all tasks when delete all button is clicked', () => {
      addTask(randomString)
      addTask(randomString2)
      let tasksBeforeDeleteAll = showtasks.querySelectorAll(".showtasks1");
      expect(tasksBeforeDeleteAll.length).toBe(2);
      expect(deleteAllButton.disabled).toBe(false);
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
      expect(deleteAllButton.innerHTML).toBe("Delete all tasks");
      expect(deleteAllButton.title).toBe("Delete all the tasks")
      assigned.click();
      expect(deleteAllButton.innerHTML).toBe("Delete all assigned tasks");
      expect(deleteAllButton.title).toBe("Delete all assigned tasks")
      completed.click();
      expect(deleteAllButton.innerHTML).toBe("Delete all completed tasks");
      expect(deleteAllButton.title).toBe("Delete all completed tasks")
      all.click();
      expect(deleteAllButton.innerHTML).toBe("Delete all tasks");
      expect(deleteAllButton.title).toBe("Delete all tasks");
    })
    test('should not delete tasks when confirmation is canceled', () => {
      addTask(randomString)
      addTask(randomString2)
      deleteAllButton.click();
      const toastCancel = document.querySelector("#toast-cancel");
      toastCancel.click();
      const remainingTasks = document.querySelectorAll(".showtasks1");
      expect(remainingTasks.length).toBe(2);
    });
    test('Delete all button should be disabled when there are no tasks',()=>{
      deleteAllButton.click();
      expect(deleteAllButton.disabled).toBe(true)
    })
    test('should not delete tasks and handle empty tasksToRemove array correctly', () => {
      const {deleteAllTasks}=require("./script.js")
      addTask(randomString,'completed')
      assigned.click()
      deleteAllTasks()
      const toastConfirm = document.querySelector("#toast-confirm");
      toastConfirm.click();
      expect(document.querySelectorAll(".showtasks1").length).toBe(1); 
  });
  
  })
  describe('Delete all tasks depending upon the filter testing', () => {
    beforeEach(()=>{
      addTask(randomString);
      addTask(randomString2, 'completed');
    })

    test('should delete all tasks when "all" filter is applied and confirm message is shown', () => {
      deleteAllButton.click();
      const toastConfirm = document.querySelector("#toast-confirm");
      toastConfirm.click();
      expect(document.querySelectorAll(".showtasks1").length).toBe(0);
      expect(errormessage.style.color).toBe("green");
      expect(errormessage.innerHTML).toBe("Tasks deleted successfully.");
    });
    test('should delete only assigned tasks when "assigned" filter is applied and confirm message is shown', () => {
      assigned.click();
      deleteAllButton.click();
      const toastConfirm = document.querySelector("#toast-confirm");
      toastConfirm.click();
      const remainingTasks = document.querySelectorAll(".showtasks1");
      expect(remainingTasks.length).toBe(1);
      expect(remainingTasks[0].querySelector(".taskname").value).toBe(randomString2);
      expect(errormessage.style.color).toBe("green");
      expect(errormessage.innerHTML).toBe("Tasks deleted successfully.");
    });

    test('should delete only completed tasks when "completed" filter is applied and confirm message is shown', () => {
      completed.click()
      deleteAllButton.click();
      const toastConfirm = document.querySelector("#toast-confirm");
      toastConfirm.click();
      const remainingTasks = showtasks.querySelectorAll(".showtasks1");
      expect(remainingTasks.length).toBe(1);
      expect(remainingTasks[0].querySelector(".taskname").value).toBe(randomString);
      expect(errormessage.style.color).toBe("green");
      expect(errormessage.innerHTML).toBe("Tasks deleted successfully.");
    });
  });
  describe('showToast Function testing', () => {
    beforeEach(() => { 
      showToast = require('./script.js').showToast;
      toast = document.querySelector("#toast");
      toastMessage = document.querySelector("#toast-message");
      toastConfirm = document.querySelector("#toast-confirm");
      toastCancel = document.querySelector("#toast-cancel");
      overlay = document.querySelector(".overlay");
    });
  
    test('should display toast and overlay, and call onConfirm when confirm button is clicked', () => {
      const onConfirm = jest.fn();
      showToast('Test Message', onConfirm, () => {});
  
      expect(toast.style.display).toBe('flex');
      expect(overlay.style.display).toBe('block');
      expect(toastMessage.textContent).toBe('Test Message');
      
      toastConfirm.dispatchEvent(new Event('click'));
  
      expect(onConfirm).toHaveBeenCalled();
      expect(toast.style.display).toBe('none');
      expect(overlay.style.display).toBe('none');
    });
  
    test('should display toast and overlay, and call onCancel when cancel button is clicked', () => {
      const onCancel = jest.fn();
      showToast('Test Message', () => {}, onCancel);

      expect(toast.style.display).toBe('flex');
      expect(overlay.style.display).toBe('block');
      expect(toastMessage.textContent).toBe('Test Message');
  
      toastCancel.dispatchEvent(new Event('click'));
  
      expect(onCancel).toHaveBeenCalled();
      expect(toast.style.display).toBe('none');
      expect(overlay.style.display).toBe('none');
    });
    test('should not call onConfirm if not provided and confirm button is clicked', () => {
      const onConfirm = jest.fn(); 
      showToast('Test Message', null, null); 
      toastConfirm.click(); 
      expect(onConfirm).not.toHaveBeenCalled(); 
      expect(toast.style.display).toBe('none');
      expect(overlay.style.display).toBe('none');
    });
    test('should hide toast and overlay after 10 seconds if no action is taken', () => {
      jest.useFakeTimers();
      const onCancel = jest.fn();
      showToast('Test Message', () => {}, onCancel);

      expect(toast.style.display).toBe('flex');
      expect(overlay.style.display).toBe('block');

      jest.advanceTimersByTime(10000);
  
      expect(toast.style.display).toBe('none');
      expect(overlay.style.display).toBe('none');
      expect(onCancel).toHaveBeenCalled();
  
      jest.useRealTimers();
    });
  });
  describe('Toast message testing',()=>{
    test('Toast message testing in different filters',()=>{
      const toast=document.querySelector(".toast")
      const toastMessage=toast.querySelector("#toast-message")
      const toastConfirm = document.querySelector("#toast-confirm");
      addTask(randomString)
      all.click()
      deleteAllButton.click();
      expect(toastMessage.textContent).toBe('Do you want to delete all tasks?')
      toastConfirm.click();
      addTask(randomString)
      assigned.click()
      deleteAllButton.click()
      expect(toastMessage.textContent).toBe('Do you want to delete all assigned tasks?')
      toastConfirm.click();
      addTask(randomString,'completed')
      completed.click()
      deleteAllButton.click();
      expect(toastMessage.textContent).toBe('Do you want to delete all completed tasks?')
    })
  })
  describe('Load tasks from local storage', () => {
    beforeEach(() => {
      loadTasksFromLocalStorage = require('./script.js').loadTasksFromLocalStorage;
      const mockTasks = [
        { name: randomString, status: 'assigned' },
        { name: randomString2, status: 'completed' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
    });
  
    test('should load tasks from localStorage on DOMContentLoaded', () => {
      loadTasksFromLocalStorage();
      const taskContainers = document.querySelectorAll('.showtasks1');
        expect(taskContainers.length).toBe(2);

        const firstTask = taskContainers[0];
        expect(firstTask.querySelector('.taskname').value).toBe(randomString);
        expect(firstTask.getAttribute('data-status')).toBe('assigned');
        expect(firstTask.querySelector('.checkbtni').src).toContain('radio-button.png');

        const secondTask = taskContainers[1];
        expect(secondTask.querySelector('.taskname').value).toBe(randomString2);
        expect(secondTask.getAttribute('data-status')).toBe('completed');
        expect(secondTask.querySelector('.checkbtni').src).toContain('check-mark.png');
    });
  
    test('should not display any tasks if localStorage is empty', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify([]));
      loadTasksFromLocalStorage();
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
    });
    test('should persist tasks after page reload', () => {
      loadTasksFromLocalStorage(); 
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(2);
    });
    test('should handle null from localStorage', () => {
      localStorage.getItem.mockReturnValue(null);
      loadTasksFromLocalStorage();
      const tasks = document.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
  });
    
  });
  describe('Individual functions testing',()=>{
    test('Testing allTasks(),assignedTaks(),completedTasks() function',()=>{
      const {assignedTasks,allTasks,completedTasks}=require("./script.js")
      addTask(randomString);
      addTask(randomString2, 'completed');
      assignedTasks()
      const tasks=document.querySelectorAll(".showtasks1[data-status='assigned']")
      tasks.forEach(task => {
        expect(task.style.display).toBe('flex');
      })
      allTasks()
      const atasks=document.querySelectorAll(".showtasks1")
      atasks.forEach(task => {
        expect(task.style.display).toBe('flex');
      })
      const ctasks = showtasks.querySelectorAll(".showtasks1[data-status='completed']");
      completedTasks()
      ctasks.forEach(task => {
        expect(task.style.display).toBe('flex');
      })
    }) 
    test('update delete all button text function testing',()=>{
      const {updateDeleteAllButtonText}=  require('./script.js')
      all.click()
      updateDeleteAllButtonText();
      expect(deleteAllButton.innerHTML).toBe("Delete all tasks")
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
      const {createButton}=require("./script.js")
      addTask(randomString);
      const task = showtasks.querySelector(".showtasks1");
      createButton("editbtn", "./images/edit.png", "editbtni","Edit the task")
      const editButton=task.querySelector('.editbtn')
      expect(editButton.querySelector(".editbtni").src).toContain('edit.png');
      expect(editButton.title).toBe('Edit the task');
      createButton("checkbtn", "./images/radio-button.png", "checkbtni","Complete the task")
      const completeButton=task.querySelector('.checkbtn')
      expect(completeButton.querySelector(".checkbtni").src).toContain('radio-button.png');
      expect(completeButton.title).toBe('Complete the task');
      createButton("deletebtn", "./images/bin.png", "deletebtni","Delete the task")
      const deleteButton=task.querySelector('.deletebtn')
      expect(deleteButton.querySelector(".deletebtni").src).toContain('bin.png');
      expect(deleteButton.title).toBe("Delete the task");
    })
    test('checkForEmptystates function',()=>{
      const {checkForEmptyStates}=require("./script.js")
      const taskContainer = document.createElement('div');
      taskContainer.className = 'showtasks1';
      taskContainer.setAttribute('data-status', 'pending');
      document.body.appendChild(taskContainer);
      checkForEmptyStates('all'); 
      expect(noTasksMessage.style.display).toBe('block');
      expect(noCompletedTasksMessage.style.display).toBe('none');
      expect(noAssignedTasksMessage.style.display).toBe('none');
      expect(deleteAllButton.disabled).toBe(true);
    });
  })
});

