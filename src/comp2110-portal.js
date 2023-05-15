import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import './components/ad-widget.js';
import './components/weather-widget.js';
import './components/blog-block.js';
import './components/widget-column.js'; 
import './components/login-widget.js';
import './components/task-widget.js';
import './components/currency-widget.js';
import './components/add-blog-form.js';



class Comp2110Portal extends LitElement {
  static properties = {
    header: { type: String },
    _activePage: { state: true },
  }

  static styles = css`
    :host {
      font-size: 15pt;
      margin: auto;
      text-align: center;
      display: grid;
      grid-template-rows: 370px 50px 5fr 100px;
      grid-template-columns: 3fr 2fr;
      grid-template-areas:
    "header header"
    "nav nav"
    "main widgets"
    "footer footer";
    }

    header {
      grid-area: header;   
      background-image: url("src/images/pexels-pixabay-531880.jpg");     
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;

    }

    .logo {
      width: 25%;
      margin-top: 100px;
      margin-left: 20px;

    }

    .logo-content {
      display: block;
      grid-area: header;
      font-weight: 600;
      font-size: 3.5em;
      padding-bottom: 20px;
      padding-left: 120px;
      color: black;
      z-index: 2;
      text-shadow: 0px 2px black;
      border.color
      background-image: url("src/images/logo.png");
      background-size: 100px;
      background-repeat: no-repeat;
    }
  
    .nav {
      grid-area: nav;
      background-color: #313131;
      color: white;
      
    }
    login-widget {
     float: right;
      padding-right: 20px;
    }

    .main {
      grid-area: main;
    }

    widget-column {
      grid-area: widgets;
      padding-top: 5px;
    }

    .app-footer {
      padding-top: 20px;
      grid-area: footer;
      font-size: calc(12px + 0.5vmin);
      align-items: center;
      background-color: #313131;
      color: white;
    }

    .app-footer a {
      margin-left: 5px;
    }
    
    ul .nav-list {
      
      list-style-type: none; !important
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #333;
    }

    li {
      float: left;
    }
    li button {
      font-size: 0.7em;
      display: block;
      color: white;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      background-color: #333;
    }
    li button:hover {
        background-color: #111;
    }
    .main{
      padding-left:20px;
    }

  `;

  constructor() {
    super();
    this.header = 'COMP2110 Portal';
    this._activePage = html`
        add-blog-form {
            display: none;
        }
        task-widget {
            display: none;
        }
        blog-block {
            display: block;
        }
        
    `;
  }

  blogPage() {

    this._activePage = html`
        add-blog-form {
            display: none;
        }
        task-widget {
            display: none;
        }
        blog-block {
            display: block;
        }
        
    `;

  }

    blogForm() {
    console.log("blog form");
    this._activePage = html`
        add-blog-form {
            display: block;
        }
        task-widget {
            display: none;
        }
        blog-block {
            display: none;
        }
        
    `;
    }
    taskPage() {
      console.log("task form");
    this._activePage = html`
        add-blog-form {
            display: none;
        }
        task-widget {
            display: block;
        }
        blog-block {
            display: none;
        }
        
    `;
    }

  render() {
    return html`
      <style>
        ${this._activePage}
      </style>
      <header>
        <div class="logo">
        <a href="#" class="logo-content">${this.header}</a>
        </div>
      </header>
      
      <div class="nav">
        <ul class="nav-list" style="list-style-type: none;margin: 0;padding-left:0;">
        <li><button class="nav-button blog-page" id="blog-page" @click=${this.blogPage}>Blog</button></li>
        <li><button class="nav-button blog-form" id="blog-form-page" @click=${this.blogForm}>Add Blog</button></li>
        <li><button class="nav-button tasks" id="task-page" @click=${this.taskPage}>Tasks</button></li>
        </ul>
        <login-widget></login-widget>
      </div>
      <div class="main">
        <blog-block></blog-block>
        <add-blog-form></add-blog-form>
        <task-widget></task-widget>
      </div>
      <div class="widget-column">    
        <weather-widget></weather-widget>
        <currency-widget></currency-widget>
        <ad-widget></ad-widget>
        <widget-block header="weather"></widget-block>
        <holidays-widget header="holidays-widget"></holidays-widget>
        
      </div>

      <p class="app-footer">
        A product of the COMP2110 Web Development Collective &copy; 2023
      </p>
    `;
  }
}

customElements.define('comp2110-portal', Comp2110Portal);