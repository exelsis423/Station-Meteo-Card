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
    
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px; /* Un peu de marge interne pour aligner avec le reste */
      margin-top: 5px;
    }
    
    .rain-info {
      font-size: 14px;
      font-weight: bold;
      opacity: 0.8;
      color: #111;
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

      
      /* Ajustez la largeur de tempbox si besoin */

    .header-row {
      display: flex;
      align-items: center; /* Aligne verticalement au centre */
      justify-content: center; /* Espace équitablement les éléments */
      gap: 15px; /* Espace entre les icônes et la tempbox */
      margin: 10px 0;
      }
      
    .tempbox {
        margin: 0 !important;
        width: 180px;
        text-align: center;
        background: rgba(255,255,255,0.25);
        border-radius: 12px;
        padding: 8px;
        border: 1px dashed rgba(0,0,0,0.2);
      }
    .vigilance-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.1);
      box-shadow: 0 0 5px rgba(0,0,0,0.2);
      transition: background-color 0.5s ease;
    }
    
    /* Optionnel : pulsation si alerte orange ou rouge */
    .vigilance-dot.alert {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
      70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
    }
    .mini-icon ha-icon {
      --mdc-icon-size: 50px; /* Ajustez cette valeur selon la taille souhaitée */
      color: #333;           /* Optionnel : pour changer la couleur de l'icône */
      }
    .mini-icon {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        border-radius: 50%;
        transition: background 0.3s;
        width: 50px !important;  /* Assurez-vous que la largeur est suffisante */
        height: 50px !important;
      }
      
    .mini-icon:hover {
        background: rgba(255, 255, 255, 0.4);
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
  
  getVigilanceColor(entityId) {
    const state = this.hass.states[entityId]?.state;
    const map = {
      'green': '#2ecc71',
      'yellow': '#f1c40f',
      'orange': '#e67e22',
      'red': '#e74c3c'
    };
    return map[state] || '#a8c8e8'; // Couleur par défaut si rien
  }
  
  getNextRainText(entityId) {
    const entity = this.hass.states[entityId];
    if (!entity || !entity.attributes || !entity.attributes["1_hour_forecast"]) {
      return "N/A";
    }
  
    const forecast = entity.attributes["1_hour_forecast"];
    const minutes = Object.keys(forecast);
    
    // On cherche la première occurrence de pluie
    for (const min of minutes) {
      if (forecast[min] !== "Temps sec") {
        return `Pluie dans ${min.replace(" min", "")} min`;
      }
    }
    
    return "Temps sec";
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

          <div class="info-row">
            <div class="rain-info" @click=${() => this.handleTapAction(c.rain)}>
              ☔ ${this.getNextRainText(c.next_rain_entity)}
            </div>
            <div class="vigilance-dot" 
                 style="background-color: ${this.getVigilanceColor('sensor.68_weather_alert')};"
                 title="Vigilance">
            </div>
            <div class="feels">
              Ressenti ${this.getState(c.feels_like)}°
            </div>
          </div>

          <!-- LIGNE MIN/MAX -->
          <div class="header-row">
            <div class="mini-icon" @click=${() => this.handleTapAction(c.vigilance_action)}>
              <img src="/api/camera_proxy/camera.mf_alerte_today?token=${this.hass.states['camera.mf_alerte_today']?.attributes.access_token}" style="width: 64px !important; height: 64px !important; border-radius: 50%;">
            </div>
          
            <div class="tempbox">
              <div>${min}°</div>
              <div class="bar">
                <div class="cursor ${isBelow ? 'below' : ''} ${isAbove ? 'above' : ''}" 
                     style="left:${percent}%"></div>
              </div>
              <div>${max}°</div>
            </div>
          
            <div class="mini-icon" @click=${() => this.handleTapAction(c.radar_action)}>
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
  
  handleTapAction(actionConfig) {
    if (!actionConfig) return;
  
    // Si l'action est configurée sous forme de chaîne (compatibilité ou raccourci)
    const action = typeof actionConfig === 'string' ? { action: "more-info", entity: actionConfig } : actionConfig;
  
    switch (action.action) {
      case "more-info":
        // Utilise l'entité spécifiée dans l'action, ou celle par défaut
        const entityId = action.entity || action.entity_id;
        if (!entityId) return;
        
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: entityId },
          bubbles: true,
          composed: true
        }));
        break;
  
      case "navigate":
        if (action.navigation_path) {
          window.history.pushState(null, "", action.navigation_path);
          window.dispatchEvent(new Event("location-changed"));
        }
        break;
  
      case "call-service":
      case "perform-action": // HA a renommé call-service en perform-action récemment
        const serviceName = action.service || action.action;
        if (!serviceName) return;
        const [domain, service] = serviceName.split(".");
        this.hass.callService(domain, service, action.service_data || action.data || {});
        break;
    }
  }

}

customElements.define('station-meteo-card', StationMeteoCard);
