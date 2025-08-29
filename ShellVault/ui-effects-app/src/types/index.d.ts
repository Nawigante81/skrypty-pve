{
  "animations": [
    {
      "name": "fadeIn",
      "duration": "0.5s",
      "timingFunction": "ease-in",
      "properties": {
        "opacity": [0, 1]
      }
    },
    {
      "name": "fadeOut",
      "duration": "0.5s",
      "timingFunction": "ease-out",
      "properties": {
        "opacity": [1, 0]
      }
    },
    {
      "name": "scaleUp",
      "duration": "0.3s",
      "timingFunction": "ease-in-out",
      "properties": {
        "transform": ["scale(0.9)", "scale(1)"]
      }
    },
    {
      "name": "scaleDown",
      "duration": "0.3s",
      "timingFunction": "ease-in-out",
      "properties": {
        "transform": ["scale(1)", "scale(0.9)"]
      }
    }
  ],
  "themeAdaptation": {
    "dark": {
      "backgroundColor": "#333",
      "color": "#fff"
    },
    "light": {
      "backgroundColor": "#fff",
      "color": "#000"
    }
  },
  "uiToggle": {
    "effectEnabled": true,
    "localStorageKey": "animationEffectEnabled"
  }
}