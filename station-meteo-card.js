import { LitElement, html, css } from "https://unpkg.com/lit?module";

class StationMeteoCard extends LitElement {

  static properties = {
    hass: {},
    config: {},
    graphEntity: {},
    historyData: {}
  };

  setConfig(config) {
    this.config = config;
  }

  static styles = css`

    ha-card {
      border-radius: 20px;
      overflow: hidden;
      border: none !important;
      box-shadow: none !important;
    }

    .screen {
      position: relative;
      max-width: 500px;
      margin: 0 auto;
      padding: 15px;
      border-radius: 20px;
      background: linear-gradient(#a8c8e8 0%, #dfeaf5 55%, #7fb3d5 100%);
    }

    /* ===== TEMP STYLE ===== */
    :host {
      --temp-color: #111;
    }

    .temp-cold { --temp-color: #4aa3ff; }
    .temp-good { --temp-color: #111; }
    .temp-warm { --temp-color: #ff9a3c; }
    .temp-hot  { --temp-color: #ff3b3b; }
  
    .big {
      display: grid;
      place-items: center;

      font-family: 'DSEG7', monospace;
      font-size: 90px;
      cursor: pointer;

      color: var(--temp-color);
    }

    /* couche fond */
    .big::before {
      content: attr(data-bg);
      grid-area: 1 / 1;
      color: rgba(0,0,0,0.03);
    }
 
    /* couche valeur */
    .big span {
      grid-area: 1 / 1;
    }

    .feels {
      text-align: right;
      font-size: 14px;
      opacity: 0.8;
    }

    /* ===== ICON ===== */
    .top {
      position: relative;
      height: 100px;
    }

    .icon {
      font-family: 'DSEGWeather', monospace !important;
      position: absolute;
      left: 50%;
      top: -30px;
      transform: translateX(-50%);
      font-size: 110px;
    }

    /* ===== MIN MAX ===== */
    .mini-icon {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        border-radius: 50%;
        transition: background 0.3s;
      }
      
    .mini-icon:hover {
        background: rgba(255, 255, 255, 0.4);
      }
      
      /* Ajustez la largeur de tempbox si besoin */
    .tempbox {
        width: 90% !important; /* Un peu plus large pour laisser la place aux icônes */
      }

    
    .windbox {
      display: grid;
      text-align: center;
      align-items: center;
      padding: 1px;
      border-radius: 12px;
      grid-template-columns: 1fr 1fr;
    }
    
    .bar {
      height: 6px;
      background: linear-gradient(to right, #4aa3ff, #fff, #ff3b3b);
      border-radius: 4px;
      margin: 5px 0;
      position: relative;
    }

    .cursor {
      position: absolute;
      top: -3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: white;
      border: 2px solid black;
      transform: translateX(-50%);
    }
    
    .cursor.below {
      background: #4aa3ff;
    }

    .cursor.above {
      background: #ff3b3b;
    }

    /* ===== ROWS ===== */
    .row {
      display: grid;
      padding: 10px 0;
      gap: 10px;
    }

    .row.two { grid-template-columns: 1fr 1fr; }
    .row.four { grid-template-columns: repeat(2, 1fr); }

    .cell {
      text-align: center;
      border-radius: 12px;
      border: 3px dashed rgba(0,0,0,0.2);
    }

    .label {
      font-size: 17px;
      opacity: 0.7;
    }

    .labelgust {
      font-size: 14px;
      opacity: 0.7;
    }

    .value {
      font-family: 'DSEG7', monospace;
      font-size: 30px;
      cursor: pointer;
    }

    .value span {
       cursor: pointer;
    }

    .gust {
      font-family: 'DSEG7', monospace;
      font-size: 23px;
      opacity: 0.5;
      cursor: pointer;
    }
    
    .gust span {
       cursor: pointer;
    }

    /* ===== COMPASS ===== */
    .compass {
      width: 60px;
      margin: auto;
    }

  `;

  getState(e) {
    const state = this.hass.states[e]?.state;

    if (
      state === undefined ||
      state === null ||
      state === "unknown" ||
      state === "unavailable"
    ) {
      return "888";
    }

    return state;
  }

  getTempClass(temp) {
    const t = parseFloat(temp);
    if (t <= 5) return "temp-cold";
    if (t <= 20) return "temp-good";
    if (t <= 25) return "temp-warm";
    return "temp-hot";
  }

  getWeatherIcon(state) {
    const map = {
      clear: "1",
      "clear-night": "1",
      cloudy: "2",
      fog: "☁",
      hail: "4",
      lightning: "8",
      "lightning-rainy": "6",
      partlycloudy: "9",
      pouring: "4",
      rainy: "3",
      snowy: "5",
      "snowy-rainy": "5",
      sunny: "1",
      windy: "B",
      "windy-variant": "B",
      exceptional: "C",

    };
    return map[state] || "C";
  }

  /* ===== GRAPH ===== */
  async showGraph(name, entity) {

    this.graphEntity = name;

    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const data = await this.hass.callWS({
      type: "history/history_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      entity_ids: [entity],
      minimal_response: true
    });

    this.historyData = data[entity] || [];
  }


  getCompass(dir) {

    const map = { n:0, ne:45, e:90, se:135, s:180, sw:225, w:270, nw:315 };
    let rot = map[(dir||"").toLowerCase()] ?? parseFloat(dir) ?? 0;
    rot = (rot + 180) % 360;

    return html`
      <svg class="compass" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="35" stroke="black" fill="none"/>

        <g transform="rotate(${rot},50,50)">
          <polygon points="50,70 42,90 58,90" fill="red"/>
        </g>

        <circle cx="50" cy="50" r="4" fill="black"/>
      </svg>
    `;
  }

  render() {

    const c = this.config;
    const temp = this.getState(c.temperature);
    const min = parseFloat(this.getState(c.temp_min));
    const max = parseFloat(this.getState(c.temp_max));

    let percent = ((temp - min) / (max - min || 1)) * 100;

    const isBelow = percent < 0;
    const isAbove = percent > 100;

    percent = Math.min(100, Math.max(0, percent));

    return html`
      <ha-card>
        <div class="screen">

          <!-- ICON -->
          <div class="top">
            <div class="icon"
                style="cursor:pointer"
                @click=${() => this.handleTapAction(c.weather_action || { action: "more-info", entity: c.weather })}>
              ${this.getWeatherIcon(this.hass.states[c.weather]?.state)}
            </div>
          </div>

          <!-- TEMP -->
          <div class="big ${this.getTempClass(temp)}"
               data-bg="88.8°"
               style="cursor:pointer"
               @click=${() => this.handleTapAction(c.temperature_action || { action: "more-info", entity: c.temperature })}>

            <span>${temp}°</span>
          </div>

          <div class="feels">
            Ressenti ${this.getState(c.feels_like)}°
          </div>

          <!-- LIGNE MIN/MAX -->
          <div class="tempbox" style="display: flex; align-items: center; justify-content: space-between;">
  
            <div class="mini-icon" @click=${() => this.handleTapAction(c.vigilance_action || { action: "more-info", entity: c.temperature })}>
              <img src="/local/weather/test.png" style="width: 40px; height: 40px;">
            </div>
          
            <div style="flex-grow: 1; margin: 0 10px;">
              <div>${min}°</div>
              <div class="bar">
                <div class="cursor ${isBelow ? 'below' : ''} ${isAbove ? 'above' : ''}" 
                     style="left:${percent}%"></div>
              </div>
              <div>${max}°</div>
            </div>
          
            <div class="mini-icon" @click=${() => this.handleTapAction(c.radar_action || { action: "more-info", entity: c.temperature })}>
              <ha-icon icon="mdi:radar"></ha-icon>
            </div>
          
          </div>
          
          
          


          <!-- ROW -->
          <div class="row two">

            <div class="cell">
              <div class="label">HUM</div>
              <div class="value"
                style="cursor:pointer"
                @click=${() => this.handleTapAction(c.humidity)}>
                ${this.getState(c.humidity)}%
              </div>
            </div>

            <div class="cell">
              <div class="label">PLUIE</div>
              <div class="value"
                style="cursor:pointer"
                @click=${() => this.handleTapAction(c.rain)}>
                ${this.getState(c.rain)}
              </div>
            </div>

          </div>

          <div class="row four">
            <div class="cell">
              <div class="label">DIR</div>
              ${this.getCompass(this.getState(c.wind_dir))}
            </div>

            <div class="cell">
              <div class="windbox">
                <div class="label">VENT</div>
                <div class="labelgust">RAFALE</div>
              </div>

              <div class="windbox">
                <div class="value"
                  <span @click=${() => this.handleTapAction(c.wind)}>
                    ${this.getState(c.wind)}
                  </span>
                </div>
                
                <div class="gust"
                  <span @click=${() => this.handleTapAction(c.gust)}>
                    ${this.getState(c.gust)}
                  </span>
                </div>
              </div>
            </div>
          

          </div>



        </div>
      </ha-card>
    `;
  }
  
  handleTapAction(entity) {
    const action = this.config?.tap_action;

    if (!action) return;

    switch (action.action) {

      case "more-info":
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: entity },
          bubbles: true,
          composed: true
        }));
        break;

      case "navigate":
        window.history.pushState(null, "", action.navigation_path);
        window.dispatchEvent(new Event("location-changed"));
        break;

      case "call-service":
        const [domain, service] = action.service.split(".");
        this.hass.callService(domain, service, action.service_data || {});
        break;
    }
  }
}

customElements.define('station-meteo-card', StationMeteoCard);
