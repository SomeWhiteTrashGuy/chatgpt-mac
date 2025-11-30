DOWNLOAD HERE OR FROM RELEASES PAGE: https://github.com/SomeWhiteTrashGuy/chatgpt-mac/releases/download/v!/ChatGPT-1.0.0-x64.dmg

---

# ChatGPT for Mac

**ChatGPT for Mac** is a lightweight, unofficial Electron wrapper around the ChatGPT web interface.
It provides a dedicated macOS desktop experience with familiar menus, keyboard shortcuts, and several quality-of-life tools on top of the standard ChatGPT website.

> This project does **not** modify or replace the official ChatGPT service. It simply loads the official site in an Electron shell.

---

## Version

* **Current app version:** `v1.0.0`
* **Status:** Stable hobby / personal-use build

---

## Features

**Dedicated desktop experience**

* ChatGPT in its own macOS app, separate from your browser
* Standard macOS menus (App, File, Edit, View, Window, Help)

**View & window controls**

* Reload page (Cmd/Ctrl + R)
* Zoom In / Zoom Out / Reset Zoom
* Toggle Fullscreen
* Toggle **Always on Top** for quick reference

**Export tools**

* Save the current page as **PDF** (print-to-PDF)
* Save the current page as **plain text**
* Capture a **screenshot** of the app window and save to PNG

**Navigation helpers**

* Copy current page URL to clipboard
* Open current page in the default system browser

**Notes window**

* Separate Notes window for quick notes and prompts
* Notes stored locally via `localStorage` on your machine
* Keyboard shortcut to open notes (e.g., Cmd/Ctrl + Shift + N)

**Global hotkey**

* System-wide shortcut (e.g., Ctrl + Alt + G) to show/hide the main ChatGPT window

---

## Installation

### Option 1: Download the DMG (recommended)

Download the latest macOS build from GitHub Releases:

* **Latest DMG:**
  [https://github.com/SomeWhiteTrashGuy/chatgpt-mac/releases/latest](https://github.com/SomeWhiteTrashGuy/chatgpt-mac/releases/latest)

Steps:

1. Download the `.dmg` file from the latest release.
2. Open the `.dmg`.
3. Drag **ChatGPT for Mac.app** into your **Applications** folder.
4. Launch it from Applications or Spotlight.
5. On first launch, macOS may warn you about an “unidentified developer”:

   * Right-click the app → **Open** → confirm, or
   * Approve it under **System Settings → Privacy & Security** if needed.

### Option 2: Build from source

```bash
git clone https://github.com/SomeWhiteTrashGuy/chatgpt-mac.git
cd chatgpt-mac
npm install

# Run in development
npm start
```

To build your own DMG:

```bash
npm run make
```

The built `.dmg` and other artifacts will be created under:

`out/make/`

---

## Supported MacBook Models

This is an Electron app; requirements are mostly about macOS version and general performance (RAM, SSD) rather than GPU.

### Verified (personally tested)

* **MacBook Pro (13" / 15", 2011, Intel)**

  * CPU: Intel Core i-series (dual- or quad-core)
  * Upgrades tested: 16 GB RAM, 1 TB SSD
  * OS: macOS Catalina (installed via community patcher)
  * Notes: Despite its age, the app runs reliably once a modern-enough macOS and Node/Electron are in place.

### Expected to work well (Intel MacBooks)

The app should generally work on the following Intel-based MacBook families, assuming:

* A reasonably recent macOS (e.g., High Sierra or later)
* SSD (strongly recommended)
* At least 8 GB of RAM

**MacBook Pro (Intel, roughly 2012–2015)**

* 13" and 15" unibody / Retina models
* Typical CPUs: Intel Core i5 / i7

**MacBook Air (Intel, roughly 2012–2017)**

* 11" and 13" models
* Low-power Intel Core i5 / i7
* Most ship with SSD, which is ideal for Electron apps

**MacBook (Retina, 12", 2015–2017, Intel)**

* Single USB-C port
* Intel Core M processors
* Performance is modest but sufficient for a simple Electron wrapper

### Apple Silicon (M1 / M2 / M3)

The app should also run on Apple Silicon (M1/M2/M3) under Rosetta 2 like other Electron apps.
However, this configuration has **not** been extensively tested for this specific project.

> General rule: if your Mac can run a current-enough version of macOS to support the Electron version used here, it can probably run this app. SSD and sufficient RAM matter more than raw CPU speed.

---

## Known Limitations

* This is **not** a native ChatGPT client; it is a controlled browser window for the official site.
* All authentication, chat history, and AI behavior are handled by OpenAI’s servers.
* You must have:

  * A working internet connection
  * A valid ChatGPT/OpenAI account (or access via region/plan)
* On older Intel MacBooks, startup may be slower, especially on patched macOS versions or spinning hard drives.

---

## Disclaimer

This project is an **unofficial**, third-party wrapper around the ChatGPT website.
It is **not** affiliated with, endorsed by, or sponsored by OpenAI.

All trademarks, service marks, and company names are the property of their respective owners.
This app simply opens the official ChatGPT web interface in an Electron window for convenience.
