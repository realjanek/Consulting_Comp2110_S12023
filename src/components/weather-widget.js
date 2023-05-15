import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class WidgetBlock extends LitElement {
  static properties = {
    header: { type: String },
  }

  static styles = css`
    :host {
      display: block;
      width: auto;
      height: 250px;
      background-color: azure;
      margin: 20px;
      padding: 20px;
      margin-right: 10px;
    }

    h3 {
      font-size: 26px;
      margin: 0px;
      padding-top: 10px;
      padding-bottom: 10px;  
      background-color: #D3FFFF;   
    }
  `;

  constructor() {
    super();
    this.header = 'Widget';
    this.weatherData = {
      temperature: null,
      location: null,
    };
    this.fetchWeatherData();
  }

  async fetchWeatherData() {
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&current_weather=true');
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      this.weatherData = {
        temperature: data?.current_weather?.temperature,
        location: data?.current_weather?.weather?.location,
      };
      console.log('Weather data:', this.weatherData);
      this.requestUpdate(); 
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  render() {
    return html`
      <h3>${this.header}</h3>
      <div>
        ${this.weatherData.temperature !== null ?
        html`<p>Temperature: ${this.weatherData.temperature} °C</p>` :
        html`<p>Loading temperature...</p>`}
        ${this.weatherData.location !== null ?
        html`<p>location:Sydney</p>` :
        html`<p>Loading location...</p>`}
      </div>
    `;
  }
}

customElements.define('widget-block', WidgetBlock);
