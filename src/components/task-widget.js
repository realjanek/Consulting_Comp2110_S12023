import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { BASE_URL } from '../config.js';
import { getUser, storeUser, deleteUser} from '../auth.js';


class TaskWidget extends LitElement {

    static properties = {
        _tasks: { state: true },
        _user: { state: true },
        _userLoggedIn: { state: true },
        taskURL: { type: String },
        _pendingStyle: { state: true },
        _completedStyle: { state: true },
        _addTaskStyle: { state: true },
        _numberTasks: { state: true, type: Number},
    }



    constructor() {
        super();
        this._numberTasks=20;
        this.taskURL = `${BASE_URL}tasks`;
        this._completedStyle = html`
            .completed-list {
            display: none;
            }
        `;
        this._addTaskStyle = html`
            .add-task-form {
            display: none;
            }
            `;
        this._pendingStyle = html`
            .pending-list {
            display: block;
            }
            `;
    }

    static styles = css`
      :host {
        display: block;


      }

      .tasks-header {
        text-align: left;
        padding: 10px;
      }


      .open-button {
        grid-area: open-button;
      }

      .tasks-header h1 {
        padding-left: 10px;

      }

      .tasks-list {
        min-height: 300px;
        max-height: 800px;
        overflow-y: scroll;
        width: 100%;
      }

      .completed-task {
        text-align: left;
        padding-left: 20px;
      }

      .pending-task {
        text-align: left;
        padding-left: 20px;
      }

      .completed-task {
        text-decoration: line-through;
      }

      .completed-task input {

        float: left;
      }

      .pending-task input {

        float: left;
      }

      .tab {
        overflow: hidden;
        background-color: #f1f1f1f1;
        border: 1px solid #d7d7d7;
      }

      .tab button {
        background-color: #f1f1f1;
        float: left;
        width: 33%;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        transition: 0.3s;
        font-size: 1.5em;
        color: black;
      }

      .tab button:hover {
        background-color: #ddd;
      }

      .tab button.active {
        background-color: rgb(211, 255, 255);
        border: 1px solid #d7d7d7;
      }


      .pending-task input {
        float: left;
        padding: 10px;
        background-color: #2eea13;
      }

      .pending-task input:hover {
        background-color: rgba(12, 124, 0, 0.78);
      }

      .pending-task label {
        
        width: 70%;
        padding: 10px;
        min-height: 20px;
      }

      .pending-task {
        border: 1px solid #808080;
        width: 90%;
        padding: 30px;

      }

      pending-task h4 {
        padding: 0;

      }
    `;

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('user', (e) => { this.updateUser(e) });
        this._user = getUser();
        this.getTaskList();


    }

    getTaskList() {
        //Null check for if user not logged in
        if (!this._user) {
            return;
        }
        let url = this.taskURL + '?count=' + this._numberTasks;
        let options = {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + this._user.token,
            }
        }
        fetch(url,options)
            .then(response => response.json())
            .then(tasks => {
                this._tasks = tasks;
            });
    }

    //form function to add a task
    addTask(event) {
        event.preventDefault();
        const text = this.shadowRoot.getElementById('task-content').value;
        fetch(this.taskURL, {
            method: 'post',
            body: JSON.stringify({text}),
            headers: {
                'Authorization': 'Basic ' + this._user.token,
                'Content-Type': 'application/json'}
        }).then(result => result.json()).then(response => {
            console.log(response);
        })
        this.getTaskList();
    }

    changeChecked(event){
        event.preventDefault();
        let id = event.target.id;
        const status = event.target.name;
        let url = this.taskURL + '/' + id;
        console.log(url);
        console.log(status);
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({status}),
            headers: {
                'Authorization': 'Basic ' + this._user.token,
                'Content-Type': 'application/json'}
        }).then(result => result.text()).then(response => {
            this.getTaskList();
            console.log(response);
        })


        }
    changeTab(event){
        event.preventDefault();
        let tab = event.target.id;
        this.shadowRoot.getElementById('pending-tab').className = 'tablinks';
        this.shadowRoot.getElementById('completed-tab').className = 'tablinks';
        this.shadowRoot.getElementById('add-task-tab').className = 'tablinks';
        event.target.className += ' active';
        console.log('change tab');
        this._pendingStyle = html`
            .pending-list {
            display: none;
            }
        `;
        this._completedStyle = html`
            .completed-list {
            display: none;
            }
        `;
        this._addTaskStyle = html`
            .add-task-form {
            display: none;
            }
            `;
        if (tab === 'pending-tab'){
            this._pendingStyle = html`
            .pending-list {
            display: block;
            }
            `;
        }else if (tab === 'completed-tab'){
            this._completedStyle = html`
            .completed-list {
            display: block;
            }
            `;
        }else if (tab === 'add-task-tab'){
            this._addTaskStyle = html`
            .add-task-form {
            display: block;
            }
            `;
        }

    }


    loadMoreTasks(event){
        this._numberTasks+=10;
        this.getTaskList();
    }
    render() {
        console.log('rendering');
        if (!this._tasks || !this._user)
            return html`
                <h3 class="login-error">Login to access tasks</h3>
            `

        return html`
            <style>
            ${this._pendingStyle}
            ${this._completedStyle}
            ${this._addTaskStyle}
            </style>
        <div class="tasks-header">
                <h1 id="tasks-header-text">Tasks</h1>
        </div>
        <div class="tab">
            <button class="tablinks active" id="pending-tab" @click=${this.changeTab}>Pending</button>
            <button class="tablinks" id="completed-tab" @click=${this.changeTab}>Completed</button>
            <button class="tablinks" id="add-task-tab" @click=${this.changeTab}>Add Task</button>
        </div>
        <div class="add-task-form">
            <h3>Add Task</h3>
            <form @submit=${this.addTask}>

                <textarea rows="5" cols="75" id="task-content" name="task-content" form="add-task-form">Add Task Details Here</textarea>
                <input type='submit' value='Add Task'>
            </form>
            
        </div>
        <div class="pending-list task-list">
            <h3>Pending Tasks</h3>
            ${this._tasks.tasks.filter(task => task.status === 'pending').map(task => html`
                
        <div class="pending-task">
                <h4>Task ${task.id}</h4>
                <label for="${task.id}"><p>${task.text}</p></label>
            <input class="complete-button" type="button" id="${task.id}" name="complete" value="Complete" @click="${this.changeChecked}" >
        </div>
        `)}
        <input type="button" id="load-more-pending" value="Load More" @click="${this.loadMoreTasks}" >
        </div>
        <div class="completed-list task-list">
            <h3>Completed Tasks</h3>
            ${this._tasks.tasks.filter(task => task.status === 'complete').map(task => html`
                
        <div class="completed-task">
            <input type="button" id="${task.id}" name="pending" value="Set Pending" @click="${this.changeChecked}" >
            <label for="${task.id}">Task ${task.id}: ${task.text}</label>
            
            </div>
        `)}
            <input type="button" id="load-more" value="Load More" @click="${this.loadMoreTasks}" >
        </div>
        `;
    }

    updateUser(e) {
        this._userLoggedIn = e;
        console.log('logged ' + this._userLoggedIn);
        this._user = getUser();
        this.getTaskList();

    }
}

customElements.define('task-widget', TaskWidget);