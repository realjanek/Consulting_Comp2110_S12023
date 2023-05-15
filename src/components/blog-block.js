/**
 * A Blog widget that displays blog posts pulled from 
 * an API
 * 
 * <blog-block></blog-block>
 */

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { BASE_URL } from '../config.js';

class BlockBlock extends LitElement {
  static properties = {
    _posts: { state: true },
    _pageLimit: {type: Number},
    _pageCurrent: {type: Number}

  }

  static styles = css`
  :host {
    margin: 1em;
    padding-left: 40px;
  }
  .blog-header {
    text-align: left;
    float: left;
    width: 100%;
    padding-bottom: 20px;
  }
  .blogpost {
    text-align: left;
    border-bottom: 1px solid black;
  }
  .blogpost h2 {
    text-transform: capitalize;
  }
  h1 {
    text-align: left;
    font-size: 2em;
  }
  .page-number {
    display: inline-block;
    margin: 0;
  }


  `;

  constructor() {
    super();

    let options = `?start=1&count=50`
    const url = `${BASE_URL}blog${options}`;
    this._pageCurrent = 1;
    this._pageLimit = 5;
    this.pagePosts();
  }

  // A simple formatter that just splits text into paragraphs and 
  // wraps each in a <p> tag
  // a fancier version could use markdown and a third party markdown
  // formatting library
  static formatBody(text) {
    if(text) {
      const paragraphs = text.split('\r\n')
      return paragraphs.map(paragraph => html`<p>${paragraph}</p>`)
    }
  }


  //Function that gets posts for current page
  pagePosts() {
    let start = (this._pageCurrent*this._pageLimit)-this._pageLimit;
    let options = `?start=${start}&count=${this._pageLimit}`
    const url = `${BASE_URL}blog${options}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
          this._posts = data.posts;
        });
        this.render();
  }

  //Page loader to load pages and avoid any null values
  pageLoad() {
    let temp = [];
    for (let g = 0; g < this._posts.length; g++) {
      if (this._posts[g]!=null) {
        temp.push(this._posts[g])
      }
    }
    this._posts = temp;
  }

  //Increments page up 
  pageNext(event) {
      this._pageCurrent++;
      this.pagePosts();
  }

  //Increments page Down 
  pagePrev(event) {
    if (this._pageCurrent>1) {
      this._pageCurrent--;
      this.pagePosts();
    }
  }



  render() {
    if (!this._posts) {
      return html`Loading...`
    }
    return html`
        
      <div class="blog-header">
      <h1>BLOGS</h1>

      </div>

      <div class="blogposts">
      ${this._posts.map(post => html`
        <div class="blogpost">
        <h2>TITLE: ${post.title}</h2>
        <h3>By ${post.name}</h3>
        ${BlockBlock.formatBody(post.content)}
      </div>`
      )}
        </div>

      <div class="change-post-page">
        <button class="previous-page" @click=${this.pagePrev}>Previous Page</button>
        <div class="page-number"> ${this._pageCurrent} </div>
        <button class="next-page" @click=${this.pageNext}>Next Page</button>
      </div>
      `;
  }
}

customElements.define('blog-block', BlockBlock);


