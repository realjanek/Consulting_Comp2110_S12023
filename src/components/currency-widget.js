import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class CurrencyWidget extends LitElement {
    static properties = {
        _URL: {type: String},
        _InitialCurrency: {type: String},
        _InitialSymbol: {type: String},
        _FinalCurrency: {type: String},
        _FinalSymbol: {type: String},
        _InitialAmount: {type: Number},
        _FinalAmount: {type: Number},
        _Data: {state: true},
        _ConversionRate: {type: Number}
        // _ConversionResults: {type: String}
    }

    static styles = css`
    :host {
      display: block;
      width: auto;
      height: auto;        
      background-color: azure;
      margin: 20px;
      display: grid;
      grid-template-rows: 1fr auto auto 1fr;
    }
    
    h3 {
      font-size: 26px;
      margin: 20px;
      padding-top: 10px;
      padding-bottom: 10px;  
      background-color: #D3FFFF;   
    }

    .CurrencyInput {
      padding-top: 6px;
      padding-bottom: 6px;
    }
    .CurrencyOutput {
      padding-top: 6px;
      padding-bottom: 6px;
    }
    .value {
      padding-top: 14px;
      padding-bottom: 14px;
    }
    .result {
      font-size: 26px;
      padding-top: 14px;
      padding-bottom: 14px;
    }
  `;

constructor() {
    super();
    this._URL = 'https://api.exchangerate.host/convert?from=';
    this._InitialCurrency = 'EUR';
    this._InitialSymbol = '€';
    this._FinalCurrency = 'USD';
    this._FinalSymbol = '$';
    this._InitialAmount = null;
    this._ConversionRate = null;
    this.FetchConversionRate();
  }

  //Changes the vurrent selected currencies and updates the conversion rates
  changeCurrency(event){
    if(event.target.id == "CurrencyIn" && !event.target.value != null) {
      this._InitialCurrency = event.target.value;
      this.FetchConversionRate();
      this._FinalAmount = null;
      this.CurrencySymbol();
    } else {
      this._FinalCurrency = event.target.value;
      this.FetchConversionRate();
      this._FinalAmount = null;
      this.CurrencySymbol();
    }
  }

  //A fetch to get the appropriate conversion rates
  FetchConversionRate() {
    fetch(this._URL + this._InitialCurrency + "&to=" + this._FinalCurrency)
      .then(response => response.json())
        .then(data => {this._Data = data;});
  }

  //updates the conversion rates and calculates the conversion
  conversion(event) {
    event.preventDefault();
    this.FetchConversionRate();
    this._ConversionRate = this._Data.result;
    if(event.target.amount.value>0) {
      this._InitialAmount = event.target.amount.value;
      this._FinalAmount = Math.round((this._InitialAmount * this._ConversionRate)*100)/100;
    } else {
      this._InitialAmount = null;
      this._FinalAmount = null;
    }
  }

  //Chaneg the symbol
  CurrencySymbol() {
    console.log("symbol change")
      if (this._InitialCurrency == "EUR") {
        this._InitialSymbol = "€"
      } else {
        this._InitialSymbol = "$"
      }
      if (this._FinalCurrency == "EUR") {
        this._FinalSymbol = "€"
      } else {
        this._FinalSymbol = "$"
    }
  }

  render() {
    return html`
    <h3> Currency Conversion</h3>

      <form id="CurrencySelection">
      <div class="CurrencyInput">
      <label for="CurrencyIn">Starting Currency:</label>
       <select id="CurrencyIn" name="CurrencyIn" @change=${this.changeCurrency} >
          <option value="EUR">EUR</option>
          <option Value="AUD">AUD</option>
          <option Value="USD">USD</option>
        </select>
        </div>
      <div class="CurrencyOutput">
      <label for="CurrencyOut">Convert to:</label>
      <select id="CurrencyOut" name="CurrencyOut" @change=${this.changeCurrency}>
          <option value="USD">USD</option>
          <option Value="AUD">AUD</option>
          <option Value="EUR">EUR</option>
      </select>
      </div>
      </form>

      <div class="value">
      <form id="convertInput"  @submit=${this.conversion}>
        Amount: <input name='amount'>
        <input type="submit" Value="Convert">
      </form>
    </div>

      <div id="results">${this._InitialSymbol}${this._InitialAmount} ${this._InitialCurrency} = ${this._FinalSymbol}${this._FinalAmount} ${this._FinalCurrency} </div>
      
    `
  }


}
customElements.define('currency-widget', CurrencyWidget);