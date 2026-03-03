# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tel24 is a telephone directory PWA (Progressive Web App) for the Executive Forestry Agency of Bulgaria (IAG/ИАГ) and its regional (RDG/РДГ) and district (DP/ДП) units. It is built with Sencha ExtJS 7 (Modern toolkit, Material theme) and can also be packaged as an Android app via Apache Cordova.

## Build Commands

**Development (no build needed):** Open `index.html` directly in a browser via a local server. The `bootstrap.js` file dynamically loads all classes in development mode.

**Production web build:**
```bash
sencha build
# Output goes to build/production/
```

**Android APK:**
```bash
cd cordova
cordova build android --release                          # Google Play AAB
cordova build android --release -- --packageType=apk    # Direct install APK
```

**Deploy to server:**
```bash
scp -r build/production/* user@server:/var/www/tel24/
# HTTPS is required — Service Worker does not work over HTTP
```

To update the Service Worker cache after deploying, increment `CACHE_VERSION` in `service-worker.js`.

## Architecture

### Tech Stack
- **Sencha ExtJS 7** — Modern toolkit, `theme-material`, `font-awesome` package
- **ES5 syntax is mandatory** — No arrow functions, no template literals, no `const`/`let`. This is intentional for maximum browser/Cordova compatibility. Keep all new code ES5-compatible.
- **JSONP proxies** — All stores use `type: 'jsonp'` pointing to `https://vasil.iag.bg/tel/v7/` endpoints.
- **Cordova** — Android packaging only (`cordova-android ^10.1.2`)

### Application Flow

1. `index.html` loads `bootstrap.js` (Sencha microloader) and registers `service-worker.js`.
2. `app.js` bootstraps `MyApp.Application`, which initializes:
   - `MyApp.util.OfflineManager` — opens IndexedDB (`TelDb v2`) for data persistence.
   - `MyApp.util.OfflineStatus` — registers the Service Worker and listens for online/offline events.
3. Stores (`IagStore`, `RdgStore`, `DpStore`) are loaded with a progress mask:
   - **Online**: load from network, then save raw data to IndexedDB via `OfflineManager.saveData(key, data)`.
   - **Offline**: load from IndexedDB via `OfflineManager.getData(key)` and inject into the store root.
4. The main view `MyApp.view.Home` (a `TabPanel`) renders six tabs: Начало, ИАГ, РДГ, ДП, Търси, Относно.

### Directory Structure

```
app/
  Application.js            # Ext.app.Application subclass
  controller/
    IagController.js        # ViewController for nested lists; handles itemtap, phone/email links
    SearchController.js     # ViewController for search tab
  model/
    iag/IagModel.js         # Tree node model (fields: text, leaf, gsm, email, pod, pict, etc.)
  store/iag/
    IagStore.js             # TreeStore — IAG headquarters employees
    RdgStore.js             # TreeStore — Regional forestry directorates
    DpStore.js              # TreeStore — District forestry enterprises
    SearchStore.js          # Store for full-text search
  util/
    OfflineManager.js       # IndexedDB CRUD singleton (saveData / getData / saveImage / getImage)
    OfflineStatus.js        # Service Worker lifecycle, online/offline banner, background sync
    OfflineConfig.js        # Cache expiry times, endpoint whitelist, debug flag
  view/
    Home.js                 # Active main view — TabPanel (app-main is legacy, not used)
    iag/
      IagNestedList.js      # NestedList backed by IagStore; uses XTemplate for departments/employees
      RdgNestedList.js      # Same pattern for RDG
      DpNestedList.js       # Same pattern for DP
      HomePanel.js          # Home tab content
      SearchTab.js          # Search tab
      AboutPanel.js         # About tab

service-worker.js           # Network First for API calls; Cache First for images; static asset precache
cordova/                    # Cordova Android project (config.xml, platforms/, plugins/)
```

### Offline Strategy

| Resource type | Strategy | Storage |
|---|---|---|
| Static assets (JS, CSS, HTML) | Cache First (precached on SW install) | Cache Storage (`myapp-static-vN`) |
| API responses (`vasil.iag.bg/tel/v7/*`) | Network First → Cache fallback | Cache Storage (`myapp-api-vN`) |
| Employee images (`vasil.iag.bg/upload/`) | Cache First | Cache Storage (`myapp-images-vN`) |
| Store data (tree structure) | Saved after each successful load | IndexedDB (`TelDb`, object store `telData`) |

### Key Singletons

- `MyApp.util.OfflineManager` — call `saveData(key, array)` and `getData(key)` for store persistence.
- `MyApp.util.OfflineStatus` — call `registerObserver(fn)` to be notified of online/offline transitions.
- `MyApp.util.OfflineConfig` — centralized cache expiry and endpoint list. Toggle `debugMode` here.

### Store/View Naming Convention

Each organizational unit has a parallel set of Store → NestedList → Controller:
- `IagStore` / `IagNestedList` / `IagController`
- `RdgStore` / `RdgNestedList` (reuses `IagController`)
- `DpStore` / `DpNestedList` (reuses `IagController`)

### Ignored by git

`build/`, `bootstrap.*`, `.sencha/`, `classic.json*`, `modern.json*` — all generated by Sencha Cmd.
