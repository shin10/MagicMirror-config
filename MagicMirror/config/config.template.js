/* Magic Mirror Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/getting-started/configuration.html#general
 * and https://docs.magicmirror.builders/modules/configuration.html
 */

// eslint-disable-next-line any
let isRaspi = "${IS_RASPBERRY_PI}".match(/^(0|false)?$/) === null;
let tapTimeout = null;

let config = {
  // address: "0.0.0.0",     // Address to listen on, can be:
  // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
  // - another specific IPv4/6 to listen on a specific interface
  // - "0.0.0.0", "::" to listen on any interface
  // Default, when address config is left out or empty, is "localhost"
  port: 8080,
  basePath: "/", // The URL path where MagicMirror is hosted. If you are using a Reverse proxy
  // you must set the sub path here. basePath must end with a /
  ipWhitelist: ["127.0.0.1", "192.168.178.0/24"], // Set [] to allow all IP addresses
  // or add a specific IPv4 of 192.168.1.5 :
  // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
  // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
  // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

  useHttps: false, // Support HTTPS or not, default "false" will use HTTP
  httpsPrivateKey: "", // HTTPS private key path, only require when useHttps is true
  httpsCertificate: "", // HTTPS Certificate path, only require when useHttps is true

  language: "de",
  locale: "de-DE",
  logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
  timeFormat: 24,
  units: "metric",
  // serverOnly:  true/false/"local" ,
  // local for armv6l processors, default
  //   starts serveronly and then starts chrome browser
  // false, default for all NON-armv6l devices
  // true, force serveronly mode, because you want to.. no UI on this device

  // electronSwitches: ["enable-precise-memory-info"],

  modules: [
    {
      module: "MMM-GroveGestures",
      position: "bottom_right",
      hiddenOnStartup: false,
      disabled: !isRaspi,
      config: {
        autoStart: true, //When Mirror starts, recognition will start.
        verbose: false, // If set as `true`, useful messages will be logged.
        recognitionTimeout: 1000, //Gesture sequence will be ended after this time from last recognized gesture.
        // cancelGesture: "WAVE", //If set, You can cancel gesture sequence with this gesture.
        cancelGesture: null,
        visible: true, //Recognized gesture sequence will be displayed on position

        idleTimer: 30 * 60 * 1000, // `0` for disable, After this time from last gesture, onIdle will be executed.
        onIdle: {
          // See command section
          // notificationExec: {
          //   notification: "PAUSE_ROTATION",
          //   payload: null
          // },
          // moduleExec: {
          //   module: [],
          //   exec: (module, gestures) => {
          //     module.hide(1000, null, { lockstring: "GESTURE" })
          //   }
          // }
        },
        onDetected: {
          notificationExec: {
            notification: "RESUME_ROTATION",
            payload: null,
          },
          shellExec:
            "vcgencmd display_power 1; mosquitto_pub -h home.broker -t /magic-mirror/display_power -m 1",
          // You can make Mirror to wake up the modules which were hidden by onIdle with any gestures.
          moduleExec: {
            module: [],
            exec: (module, gestures) => {
              module.show(1000, null, { lockstring: "GESTURE" });
            },
          },
        },

        gestureMapFromTo: {
          //When your sensor is installed with rotated direction, you can calibrate with this.
          Up: "LEFT",
          Down: "RIGHT",
          Left: "DOWN",
          Right: "UP",
          Forward: "FORWARD",
          Backward: "BACKWARD",
          Clockwise: "CLOCKWISE",
          "anti-clockwise": "ANTICLOCKWISE",
          wave: "WAVE",
        },
        pythonPath: "/usr/bin/python3",

        defaultCommandSet: "default",
        commandSet: {
          default: {
            WAVE: {
              notificationExec: {
                notification: "ASSISTANT_ACTIVATE",
                payload: null,
              },
            },
            "FORWARD-BACKWARD": {
              notificationExec: {
                notification: "ASSISTANT_ACTIVATE",
                payload: null,
              },
              moduleExec: {
                module: [],
                exec: (module, gestures) => {
                  // module.hide(1000, null, { lockstring: "GESTURE" })
                },
              },
            },
            "LEFT-RIGHT": {
              notificationExec: {
                notification: "ASSISTANT_CLEAR",
                payload: null,
              },
            },
            CLOCKWISE: {
              notificationExec: {
                notification: "ARTICLE_RANDOM",
                payload: null,
              },
            },
            ANTICLOCKWISE: {
              notificationExec: {
                notification: "PAUSE_ROTATION",
                payload: null,
              },
              moduleExec: {
                module: [],
                exec: (module, gestures) => {
                  module.hide(1000, null, { lockstring: "GESTURE" });
                },
              },
            },
            LEFT: {
              notificationExec: {
                notification: "PAGE_INCREMENT",
                payload: 1,
              },
            },
            "LEFT-LEFT": {
              notificationExec: {
                notification: "PAGE_INCREMENT",
                payload: 2,
              },
            },
            "LEFT-LEFT-LEFT": {
              notificationExec: {
                notification: "PAGE_INCREMENT",
                payload: 3,
              },
            },
            RIGHT: {
              notificationExec: {
                notification: "PAGE_DECREMENT",
                payload: 1,
              },
            },
            "RIGHT-RIGHT": {
              notificationExec: {
                notification: "PAGE_DECREMENT",
                payload: 2,
              },
            },
            "RIGHT-RIGHT-RIGHT": {
              notificationExec: {
                notification: "PAGE_DECREMENT",
                payload: 3,
              },
            },
            UP: {
              notificationExec: {
                notification: "ARTICLE_NEXT",
                payload: null,
              },
            },
            DOWN: {
              notificationExec: {
                notification: "ARTICLE_PREVIOUS",
                payload: null,
              },
            },
            FORWARD: {
              notificationExec: {
                notification: "CHEAT_SHEET_SCROLL_DOWN",
                payload: null,
              },
            },
            BACKWARD: {
              notificationExec: {
                notification: "CHEAT_SHEET_SCROLL_UP",
                payload: null,
              },
            },
          },
        },
      },
    },

    {
      module: "MMM-PIR-Sensor",
      position: "top_center", // Remove this line to avoid having an visible indicator
      disabled: !isRaspi,
      config: {
        sensorPin: 24,
        powerSavingDelay: 5 * 60, // 5 min
        preventHDMITimeout: 0, // Turn HDMI ON and OFF again every 4 minutes when power saving, to avoid LCD/TV timeout
        supportCEC: false,
        presenceIndicator: "fa-user-check",
        presenceOffIndicator: "fa-user-times",
        presenceIndicatorColor: "#fff",
        presenceOffIndicatorColor: "#2b271c",
        animationSpeed: 1000,
        powerSaving: true,
        powerSavingNotification: false,
        powerSavingMessage: "Monitor will be turn Off by PIR module",
        runSimulator: false,
      },
    },
    {
      module: "MMM-NotificationTrigger",
      config: {
        triggers: [
          {
            trigger: "HDMI_POWER",
            fires: [
              {
                fire: "PAGE_ROTATION",
                exec: (payload) => {
                  MM.sendNotification(
                    payload ? "RESUME_ROTATION" : "PAUSE_ROTATION",
                    payload,
                    MM.getModules()[0]
                  );
                },
              },
              {
                fire: "TOGGLE_MODULE_VISIBILITY",
                exec: (payload) => {
                  MM.getModules().enumerate((module) => {
                    if (payload) {
                      module.show(1000, null, { lockstring: "GESTURE" });
                    } else {
                      module.hide(1000, null, { lockstring: "GESTURE" });
                    }
                  });
                },
              },
              {
                fire: "MQTT_MAGIC_MIRROR_DISPLAY_POWER",
                exec: (payload) => {
                  payload = payload ? 1 : 0;
                  return `vcgencmd display_power ${payload}; mosquitto_pub -h home.broker -t /magic-mirror/display_power -m ${payload};`;
                },
              },
            ],
          },
        ],
      },
    },

    {
      module: "MMM-FF-cht-sh",
      position: "fullscreen_below",
      header: "cht.sh",
      hiddenOnStartup: true, // This is optional
      disabled: false,
      config: {
        baseURL: "https://cht.sh/",
        sheets: [
          // { path: ":firstpage" },
          // { path: ":firstpage-v1" },
          { path: "ack", style: "monokai" },
          { path: "awk", style: "monokai" },
          { path: "awk/:learn", style: "default" },
          { path: "tmux" },
          { path: "fakedata" },

          { path: ":random", style: "default", weight: 10 },
          { path: ":help" },
          // { path: ":styles" },

          { path: "go/hello", style: "default" },

          // { path: "tar" },
          { path: "cheat.sheets:tar" },
          { path: "cheat:tar" },
          { path: "tldr:tar" },
        ],
        options: "q",
        style: "monokai",
        sequence: null,
        updateOnSuspension: true,
        updateInterval: 10 * 1000,
        showTitle: false,
        animationSpeed: 1000,
        // scrollAmount: 1600,
        // loadingCursor: " _",
        events: {
          sender: ["MMM-Touch", "module_0_MMM-GroveGestures"],
          CHEAT_SHEET_SCROLL_UP: "CHEAT_SHEET_SCROLL_UP",
          CHEAT_SHEET_SCROLL_DOWN: "CHEAT_SHEET_SCROLL_DOWN",
          CHEAT_SHEET_LIST_ITEM_PREVIOUS: "ARTICLE_PREVIOUS",
          CHEAT_SHEET_LIST_ITEM_NEXT: "ARTICLE_NEXT",
          CHEAT_SHEET_LIST_ITEM_RANDOM: "ARTICLE_RANDOM",
        },
      },
    },

    {
      module: "alert",
      hiddenOnStartup: true,
    },
    {
      module: "updatenotification",
      hiddenOnStartup: true,
      position: "top_bar",
      config: {
        updateInterval: 24 * 60 * 60 * 1000,
        ignoreModules: [
          "MMM-FF-cht-sh",
          "MMM-FF-digital-rain",
          "MMM-FF-Dilbert",
          "MMM-FF-Evan-Roth-Red-Lines",
          "MMM-FF-XKCD",
          "MMM-PIR-Sensor", // forked to add event
        ],
      },
    },
    {
      module: "clock",
      position: "top_left",
      hiddenOnStartup: true,
    },

    {
      module: "calendar",
      classes: "calendar-holidays",
      header: "Feiertagskalender",
      position: "top_left",
      hiddenOnStartup: true,
      disabled: false,
      config: {
        calendars: [
          {
            symbol: "calendar-check",
            url: "${SX_CALENDAR_PRIVATE_URL}",
          },
          {
            symbol: "calendar-range",
            url: "${SX_CALENDAR_HOLIDAYS_URL}",
          },
        ],
      },
    },

    {
      module: "calendar",
      classes: "calendar-private",
      header: "Termine",
      position: "top_left",
      hiddenOnStartup: true,
      disabled: false,
      config: {
        calendars: [
          {
            symbol: "calendar-check",
            url: "${SX_CALENDAR_PRIVATE_URL}",
          },
        ],
      },
    },

    {
      module: "MMM-Todoist",
      position: "top_right", // This can be any of the regions. Best results in left or right regions.
      header: "Todoist",
      hiddenOnStartup: true, // This is optional
      disabled: false,
      config: {
        // See 'Configuration options' for more information.
        hideWhenEmpty: false,
        accessToken: "${SX_TODOIST_ACCESS_TOKEN}",
        maximumEntries: 60,
        updateInterval: 10 * 60 * 1000, // Update every 10 minutes
        fade: true,
        fadePoint: 0.25,
        fadeMinimumOpacity: 0.25,
        // projects and/or labels is mandatory:
        displayTasksWithinDays: 0,
        displayTasksWithoutDue: false,
        sortType: "dueDateDescPriority",
        projects: "${SX_TODOIST_PROJECT_LIST}".split(","),
        labels: ["MagicMirror", "Important"], // Tasks for any projects with these labels will be shown.
      },
    },

    {
      module: "MMM-QRCode",
      position: "top_right",
      hiddenOnStartup: true,
      disabled: false,
      config: {
        text: "https://flintfabrik.de",
        imageSize: 150,
        showRaw: true,
        colorDark: "#fff",
        colorLight: "#000",
      },
    },
    // {
    //   module: "compliments",
    //   position: "lower_third"
    // },
    {
      module: "weather",
      position: "top_right",
      hiddenOnStartup: true,
      disabled: false,
      config: {
        weatherProvider: "openweathermap",
        type: "current",
        location: "Augsburg",
        locationID: "2954172", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
        apiKey: "${OPEN_WEATHER_MAP_API_KEY}",
      },
    },
    {
      module: "weather",
      position: "top_right",
      header: "Weather Forecast",
      hiddenOnStartup: true,
      disabled: false,
      config: {
        weatherProvider: "openweathermap",
        type: "forecast",
        location: "Augsburg",
        locationID: "2954172", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
        apiKey: "${OPEN_WEATHER_MAP_API_KEY}",
      },
    },

    {
      module: "MMM-text-clock",
      position: "middle_center",
      hiddenOnStartup: true,
      disabled: false,
      config: {
        compact: false,
        size: "large",
        language: ["en", "jp", "ch", "es", "fr", "it"],
        languageAlternationInterval: 5,
        fullscreen: false,
      },
    },

    {
      module: "MMM-FF-digital-rain",
      position: "fullscreen_below",
      hiddenOnStartup: false,
      disabled: true,
      config: {
        color: function (val) {
          if (val === 0) {
            this.horizontalGradient = Math.random() < 0.4;
            let colorRangeMin = 0.2;
            let colorRangeMax = Math.random() < 0.3 ? 1 : 0.3;
            this.colorRange =
              colorRangeMin + Math.random() * (colorRangeMax - colorRangeMin);
            this.colorOffset = Math.random();
          }
          if (this.horizontalGradient) {
            return `hsl(${
              360 * (this.colorOffset + this.colorRange * val)
            }deg 100% 50%)`;
          } else {
            return "#0A4";
          }
        },
        distribution: function (x) {
          return (Math.random() < 0.5 ? -0.5 : 0.5) * Math.pow(x, 2) + 0.5;
        },
        numberOfDrops: 15,
        numberOfMutations: 5,
        fps: 10,
        fontSize: "2em",
        chars:
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~",
        fontURL:
          "/modules/MMM-FF-digital-rain/public/fonts/matrix%20code%20nfi.ttf",
        height: "100vw",
        width: "100vh",
        events: {
          sender: ["MMM-Touch", "module_0_MMM-GroveGestures"],
          DIGITAL_RAIN_DROPS_INCREASE: "ARTICLE_NEXT",
          DIGITAL_RAIN_DROPS_DECREASE: "ARTICLE_PREVIOUS",
          DIGITAL_RAIN_MUTATIONS_INCREASE: "ARTICLE_NEXT",
          DIGITAL_RAIN_MUTATIONS_DECREASE: "ARTICLE_PREVIOUS",
          DIGITAL_RAIN_RESET: "ARTICLE_RANDOM",
        },
      },
    },

    {
      module: "MMM-FF-Evan-Roth-Red-Lines",
      position: "fullscreen_below",
      hiddenOnStartup: true,
      disabled: false,
      config: {
        width: "100%",
        height: "100%",
        grayscale: false,
        inverted: false,
        removeOnSuspension: true,
      },
    },

    {
      module: "MMM-wiki",
      position: "bottom",
      hiddenOnStartup: true,
      disabled: false,
      config: {
        updateInterval: 7 * 60 * 1000,
        language: "de",
        characterLimit: 500,
        category: "Schon_gewusst",
        badTitles: ["Graphical", "timeline", "List"],
        badContents: [
          "This article",
          "See also",
          "redirects here",
          "The following outline",
          "may refer to",
        ],
      },
    },
    {
      module: "MMM-JokeAPI",
      hiddenOnStartup: true,
      position: "lower_third",
      disabled: false,
      config: {
        category: "Programming",
        fetchInterval: 7 * 60 * 1000,
      },
    },

    {
      module: "MMM-FF-Dilbert",
      position: "bottom",
      hiddenOnStartup: true,
      config: {
        header: "Dilbert",
        updateInterval: null,
        grayscale: false,
        highContrast: false,
        inverted: false,
        imageMaxWidth: null,
        imageMaxHeight: null,
        showTitle: true,
        showDate: true,
        initialComic: "first",
        sequence: "default", // null, "random", "default", "reverse", "latest"
        updateOnSuspension: true,
        events: {
          sender: ["MMM-Touch", "module_0_MMM-GroveGestures"],
          COMIC_FIRST: "ARTICLE_FIRST",
          COMIC_LATEST: "ARTICLE_LATEST",
          COMIC_PREVIOUS: "ARTICLE_PREVIOUS",
          COMIC_NEXT: "ARTICLE_NEXT",
          // COMIC_RANDOM: "ARTICLE_RANDOM",
        },
        persistence: "electron",
        persistenceId: "dilbertModule1",
      },
    },

    {
      module: "MMM-FF-XKCD",
      position: "bottom",
      hiddenOnStartup: true,
      config: {
        header: "xkcd",
        updateInterval: null,
        grayscale: false,
        inverted: true,
        imageMaxWidth: null,
        imageMaxHeight: null,
        showTitle: true,
        showDate: true,
        showAltText: true,
        showNum: true,
        initialComic: "first",
        sequence: "default", // null, "random", "default", "reverse", "latest"
        updateOnSuspension: true,
        events: {
          sender: ["MMM-Touch", "module_0_MMM-GroveGestures"],
          COMIC_FIRST: "ARTICLE_FIRST",
          COMIC_LATEST: "ARTICLE_LATEST",
          COMIC_PREVIOUS: "ARTICLE_PREVIOUS",
          COMIC_NEXT: "ARTICLE_NEXT",
          // COMIC_RANDOM: "ARTICLE_RANDOM",
        },
        persistence: "electron",
        persistenceId: "xkcdModule1",
      },
    },

    {
      module: "newsfeed",
      position: "bottom_bar",
      classes: "newsfeed-times",
      hiddenOnStartup: true,
      config: {
        feeds: [
          {
            title: "New York Times",
            url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
          },
        ],
        updateInterval: 60 * 1000,
        showSourceTitle: true,
        showPublishDate: true,
        broadcastNewsFeeds: true,
        broadcastNewsUpdates: true,
      },
    },
    {
      module: "newsfeed",
      position: "bottom_bar",
      classes: "newsfeed-zeit",
      hiddenOnStartup: true,
      config: {
        feeds: [
          {
            title: "Zeit.de",
            url: "https://newsfeed.zeit.de/index",
          },
        ],
        updateInterval: 60 * 1000,
        showSourceTitle: true,
        showPublishDate: true,
        broadcastNewsFeeds: true,
        broadcastNewsUpdates: true,
      },
    },

    {
      module: "MMM-NINA",
      position: "right",
      hiddenOnStartup: false,
      config: {
        ags: "${NINA_LOCATION_LIST}".split(","), // Liste der Gemeinden, die abgefragt werden sollen
        downgradeLhpSeverity: false,
        downgradeCancelSeverity: true,
        hideCancelledWarnings: false,
        excludeProviders: [], // Mögliche Werte ["MOWAS", "DWD", "BIWAPP", "LHP"]
        maxAgeInHours: 6,
        // maxWidth: "200px",
        mergeAlertsById: true,
        mergeAlertsByTitle: true,
        showIcon: true,
        showDate: true,
        showCity: true,
        showNoWarning: true,
        theme: "top", // Erlaubte Werte: top, side
        updateIntervalInSeconds: 120,
      },
    },

    {
      module: "MMM-Touch",
      position: "bottom_right",
      config: {
        debug: true, // When true creates a more detailed log.
        useDisplay: true, // When true displays the current command mode. Can be controlled at runtime via TOUCH_USE_DISPLAY.
        autoMode: false, // false or [] is disabled, or contains an array of:
        // "module" == use module names
        // "index" == use module indexes
        // "instanceId" == use module instance ids
        // anything == reference to any other mode names in the config
        threshold: {
          moment_ms: 500, // TAP and SWIPE should be quicker than this.
          double_ms: 1000, // DOUBLE_TAP gap should be quicker than this. Set to zero to disable.
          press_ms: 1000 * 3, // PRESS should be longer than this.
          move_px: 50, // MOVE and SWIPE should go further than this.
          pinch_px: 50, // Average of traveling distance of each finger should be more than this for PINCH
          rotate_dg: 20, // Average rotating angle of each finger should be more than this for ROTATE
          idle_ms: 30000, // Idle time (in milliseconds) after which the defined "onIdle" notification / callback function should be triggered
        },
        defaultMode: "default", // default mode of commands sets on startup.This can also be an array. When set to an array backwards compatibility
        // for getMode() is turned off, providing a consistent return type.
        onTouchStart: () => {
          console.log("touchstart");
        }, // special event on touch start - define a string for sending a custom notification or a function for a callback; f.e. onTouchStart: "TOUCH_ACTIVITY_NOTIFICATION"
        onTouchEnd: () => {
          console.log("touchend");
        }, // special event on touch end - define a string for sending a custom notification or a function for a callback
        onIdle: () => {
          console.log("onIdle");
        }, // special event on "idle" - define a string for sending a custom notification or a function for a callback; see also: threshold.idle_ms for specifying the idle time
        gestureCommands: {
          default: {
            TAP_1: (commander) => {
              if (tapTimeout) {
                clearTimeout(tapTimeout);
                tapTimeout = null;
              }
              tapTimeout = setTimeout(() => {
                commander.sendNotification("ARTICLE_NEXT", 1);
              }, 1000);
            },
            DOUBLE_TAP_1: (commander) => {
              if (tapTimeout) {
                clearTimeout(tapTimeout);
                tapTimeout = null;
              }
              commander.sendNotification("ARTICLE_PREVIOUS", 1);
            },
            MOVE_LEFT_1: (commander, gesture) => {
              commander.sendNotification("PAGE_INCREMENT", 1);
            },
            MOVE_RIGHT_1: (commander, gesture) => {
              commander.sendNotification("PAGE_DECREMENT", 1);
            },
            SWIPE_LEFT_1: (commander, gesture) => {
              commander.sendNotification("PAGE_INCREMENT", 1);
            },
            SWIPE_RIGHT_1: (commander, gesture) => {
              commander.sendNotification("PAGE_DECREMENT", 1);
            },
          },
        }, // See next section.
        onNotification: () => {}, // Special callback function for when you need something on notification received. Usually not needed.
      },
    },

    {
      module: "MMM-page-indicator",
      position: "bottom_bar",
      hiddenOnStartup: false,
      config: {
        pages: 3,
      },
    },

    {
      module: "MMM-FF-process-stats",
      position: "bottom_right",
      header: "process-stats",
      hiddenOnStartup: false,
      disabled: false,
      config: {
        updateInterval: 10000,
      },
    },

    {
      module: "MMM-FF-StatsJS",
      position: "bottom_right",
      header: "stats.js",
      hiddenOnStartup: false,
      disabled: false,
      config: {
        screens: [0, 1, 2],
        screenIdx: 0,
        rotationInterval: null,
        static: true,
      },
    },

    {
      module: "MMM-SystemStats",
      position: "bottom", // This can be any of the regions.
      classes: "xsmall dimmed", // Add your own styling. OPTIONAL.
      header: false, // Set the header text OPTIONAL
      hiddenOnStartup: false,
      singleLine: true,
      // disabled: !isRaspi,
      config: {
        updateInterval: 10000, // every 10 seconds
        align: "right", // align labels
        alignValue: "right",
        units: "metric", // default, metric, imperial
        label: "textAndIcon",
        layout: "single-line",
        // layout: "table",
        statItems: [
          "cpuTemp",
          "sysLoad",
          "freeMem",
          "upTime",
          "freeSpace",
          // "ipAddress",
        ],
      },
    },

    {
      module: "MMM-pages",
      config: {
        animationTime: 1000,
        rotationTime: 2 * 60 * 1000,
        modules: [
          // ["alert", "updatenotification", "MMM-FF-digital-rain"],
          [
            "alert",
            "clock",
            "calendar-private",
            "MMM-QRCode",
            "MMM-FF-XKCD",
            "newsfeed-zeit",
          ],
          ["MMM-FF-cht-sh"],
          [
            "alert",
            "clock",
            "calendar-holidays",
            "MMM-Todoist",
            "MMM-JokeAPI",
            "newsfeed-times",
          ],
          ["MMM-FF-Evan-Roth-Red-Lines"],
          [
            "alert",
            "clock",
            "calendar-holidays",
            "weather",
            "weather",
            "MMM-NINA",
            "MMM-FF-Dilbert",
            "newsfeed-times",
          ],
          [
            "alert",
            "clock",
            "calendar-private",
            "weather",
            "weather",
            "MMM-NINA",
            "MMM-wiki",
          ],
          ["updatenotification", "MMM-text-clock"],
        ],
        hidden: ["MMM-Touch"],
        fixed: [
          "MMM-PIR-Sensor",
          "MMM-GroveGestures",
          "MMM-page-indicator",
          "MMM-FF-StatsJS",
          "MMM-FF-process-stats",
          "MMM-SystemStats",
        ],
      },
    },
  ],
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
