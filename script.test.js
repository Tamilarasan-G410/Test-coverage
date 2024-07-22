const fs = require('fs');
const path = require('path');
const { whole } = require('./script.js');
const Chance = require('chance');
const chance = new Chance();

describe('Javascript testing', () => {
  let inputBox;
  let showtasks;
  let form;
  let errormessage;
  let inputButton;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, 'todolist.html'), 'utf8');
    document.body.innerHTML = html;
    whole(); // Initialize event listeners and other setup

    inputBox = document.querySelector("#inputtask");
    showtasks = document.querySelector(".showtasks");
    form = document.querySelector("#form");
    errormessage = document.querySelector(".error-message");
    inputButton = document.querySelector(".button");
  });
  describe('Add functionality testing',()=>{
    test('should add a new task when input is valid', () => {
      // Set up the input value and simulate form submission
      let randomString = chance.string();
      inputBox.value = randomString;
      form.dispatchEvent(new Event('submit'));

      // Check that the task was added to the DOM
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe(randomString);
      expect(errormessage.innerHTML).toBe('Task added successfully');
    });

    test('should show an error message when input is empty', () => {
      // Set up the input value and simulate form submission
      inputBox.value = '';
      form.dispatchEvent(new Event('submit'));

      // Check that no task was added and the error message is displayed
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot be empty.');
    });

    test('should show an error message when input starts with a space', () => {
      // Set up the input value and simulate form submission
      inputBox.value = ' New Task';
      form.dispatchEvent(new Event('submit'));

      // Check that no task was added and the error message is displayed
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot start with a space.');
    });
    test('should add a new task when input is valid when the add button is pressed', () => {
      // Set up the input value and simulate form submission
      inputBox.value = 'New Task';
      inputButton.dispatchEvent(new Event('click'));

      // Check that the task was added to the DOM
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe('New Task');
      expect(errormessage.innerHTML).toBe('Task added successfully');
    });

    test('should show an error message when input is empty when the add button is pressed', () => {
      // Set up the input value and simulate form submission
      inputBox.value = '';
      inputButton.dispatchEvent(new Event('click'));

      // Check that no task was added and the error message is displayed
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot be empty.');
    });

    test('should show an error message when input starts with a space when the add button is pressed', () => {
      // Set up the input value and simulate form submission
      inputBox.value = ' New Task';
      inputButton.dispatchEvent(new Event('click'));

      // Check that no task was added and the error message is displayed
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(0);
      expect(errormessage.innerHTML).toBe('Taskname cannot start with a space.');
    });
  })
  describe("Delete functionality testing",()=>{
    test('should delete a specific task when its delete button is clicked', () => {
      // Add a task to be deleted
      inputBox.value = 'Task to delete';
      form.dispatchEvent(new Event('submit'));

      // Verify that the task was added
      let tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe('Task to delete');

      // Add another task to have multiple tasks
      inputBox.value = 'Another task';
      form.dispatchEvent(new Event('submit'));

      // Verify that both tasks were added
      tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(2);

      // Get the delete button for the first task
      const deleteButton = tasks[0].querySelector(".deletebtn");

      // Simulate the delete button click
      deleteButton.click();

      // Verify that only the clicked task was removed
      tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector(".taskname").value).toBe('Another task');
    });
  })
  describe("Complete task functionality testing",()=>{
    test('should mark a task as completed when the completion button is clicked', () => {
      // Add a task to be marked as completed
      inputBox.value = 'Task to complete';
      form.dispatchEvent(new Event('submit'));
  
      // Verify that the task was added
      const tasks = showtasks.querySelectorAll(".showtasks1");
      expect(tasks.length).toBe(1);
      const task = tasks[0];
      const taskName = task.querySelector(".taskname");
      const checkButton = task.querySelector(".checkbtn");
      
      // Verify initial state
      expect(task.getAttribute("data-status")).toBe('assigned');
      const computedStyle = window.getComputedStyle(taskName);
      expect(computedStyle.backgroundColor).toBe('aliceblue');
      expect(checkButton.querySelector(".checkbtni").src).toContain('radio-button.png');
      
      // Simulate the completion button click
      checkButton.click();
  
      // Verify that the task is now marked as completed
      expect(task.getAttribute("data-status")).toBe('completed');
      expect(computedStyle.backgroundColor).toBe('#D0D0D0');
      expect(checkButton.querySelector(".checkbtni").src).toContain('check-mark.png');
    });
  
    test('should unmark a task as completed when the completion button is clicked again', () => {
      // Add a completed task first
      inputBox.value = 'Completed task';
      form.dispatchEvent(new Event('submit'));
  
      const tasks = showtasks.querySelectorAll(".showtasks1");
      const task = tasks[0];
      const checkButton = task.querySelector(".checkbtn");
      const taskName = task.querySelector(".taskname");
      
      // Mark the task as completed
      checkButton.click();
      // Verify completion
      expect(task.getAttribute("data-status")).toBe('completed');
  
      // Simulate the completion button click again to unmark
      checkButton.click();
  
      // Verify that the task is now unmarked as completed
      expect(task.getAttribute("data-status")).toBe('assigned');
      const computedStyle = window.getComputedStyle(taskName);
      expect(computedStyle.backgroundColor).toBe('aliceblue');
      expect(checkButton.querySelector(".checkbtni").src).toContain('radio-button.png');
    });
  })
});



