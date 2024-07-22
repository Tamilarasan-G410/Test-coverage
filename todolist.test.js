const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './todolist.html'), 'utf8');
document.documentElement.innerHTML=html.toString();
describe('To-Do List', () => {
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
