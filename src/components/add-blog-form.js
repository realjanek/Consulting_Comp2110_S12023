import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { BASE_URL } from '../config.js';
import {getUser} from '../auth.js';

class AddBlog extends LitElement {
    static properties = {
        postURL: { type: String },
        _user: { state: true },
        _userLoggedIn: { state: true },
    }

    static styles = css`
      form{
        text-align:left;
      }

      #title{
        width:80%;
      }
        #content{
        width:80%;
        }
      .add-button {
        display: block;
        padding:20px;
        border:1px solid black;
        font-size:20px;
        background-color: #66ffe5;
      }
      .add-button:hover {
        background-color: #00cc99;
      }
  `;

    connectedCallback() {
        super.connectedCallback();
        this._user = getUser();
        window.addEventListener('user', (e) => { this.updateUser(e) });
    }

    constructor() {
        super();
        this.postURL = `${BASE_URL}blog`;
    }

    //form function to add a task
    addBLOG(event) {
        event.preventDefault();
        const title = event.target.title.value;
        const content = this.shadowRoot.getElementById('content').value;
        console.log(JSON.stringify({title, content}));
        fetch(this.postURL, {
            method: 'post',
            body: JSON.stringify({title, content}),
            headers: {
                'Authorization': 'Basic ' + this._user.token,
                'Content-Type': 'application/json'}
        }).then(result => result.json()).then(response => {
            console.log(response);
        })
        //now clear the form
        this.shadowRoot.getElementById('title').value = '';
        this.shadowRoot.getElementById('content').value = '';

    }

    render() {
        if (!this._user)
            return html`
                <h3 class="login-error">
                Login to access form to add blogs
                </h3>
            `

        return html`
            <div class="add-blog-form">
                <h3>Add BLOG</h3>
                <form @submit=${this.addBLOG} id="add-blog">
                    <h3 id="title-text">Title</h3> <input id="title" name="title">
                    <h3 id="content-text">Content</h3> <textarea rows="25" cols="100" id="content" name="content" form="add-blog-form"></textarea>
                    <input class="add-button" type='submit' value='Add BLOG'>
                </form>
            </div>
    `;
    }

    updateUser(e) {
        this._userLoggedIn = e;
        console.log('logged ' + this._userLoggedIn);
        this._user = getUser();
        this.render();

    }
}

customElements.define('add-blog-form',  AddBlog);