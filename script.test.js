const fs = require('fs');
const path = require('path');
const Chance = require('chance');
const chance = new Chance();

describe('Javascript testing', () => {
  let inputBox;
  let showtasks;
  let form;
  let errormessage;
  let inputButton;
  let deleteAllButton;
 

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, 'todolist.html'), 'utf8');
    document.body.innerHTML = html;
  

    inputBox = document.querySelector("#inputtask");
    showtasks = document.querySelector(".showtasks");
    form = document.querySelector("#form");
    errormessage = document.querySelector(".error-message");
    inputButton = document.querySelector(".button");
    deleteAllButton=document.querySelector(".delete-all")
    jest.resetModules();
    require('./script.js');
      // Mock localStorage
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
    // Clear mock localStorage methods
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
    localStorage.clear.mockClear();
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
      expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([{ name: randomString, status: "assigned" }]));
    });
    

    test('should show an error message when input is empty', () => {
      inputBox.value = '';
      form.dispatchEvent(new Event('submit'));

      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot be empty.');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('should show an error message when input starts with a space', () => {
      inputBox.value = ' New Task';
      form.dispatchEvent(new Event('submit'));

      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot start with a space.');
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
      expect(window.getComputedStyle(taskName).backgroundColor).toBe('rgb(208, 208, 208)'); // #D0D0D0 in RGB format
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
    });
  })
  describe('Edit functionality testing', () => {
    test('should enable editing when edit button is clicked', () => {
      inputBox.value = 'Initial Task';
      form.dispatchEvent(new Event('submit'));

      const task = showtasks.querySelector(".showtasks1");
      const editButton = task.querySelector(".editbtn");

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
      expect(tasks[0].querySelector(".taskname").readOnly).toBe(false); // First task should still be readonly
      expect(tasks[1].querySelector(".taskname").readOnly).toBe(true); // Second task should be editable
    });
  });
});
