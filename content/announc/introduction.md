<!-- Source: https://modrinth.com/plugin/announc ; retrieved 2026-10-16 -->

# 📢 Announc+

**Announc+** is a lightweight, highly customizable Minecraft announcement plugin and mod designed for **Paper, Purpur, Spigot, Folia, Bukkit, and Fabric servers**.

Whether you're running a small survival server, a modded Fabric server, or a large Minecraft network, Announc+ makes it easy to communicate important information to your players through beautifully formatted announcements.

From simple chat broadcasts to eye-catching titles, action bars, boss bars, and sounds, Announc+ gives server administrators extensive control over how announcements are displayed.

## ✨ Features

- 📢 **Server-Wide Announcements** — Instantly broadcast messages to all online players.
- 💬 **Customizable Chat Messages** — Configure announcement prefixes, colors, and formatting.
- 🖥️ **Titles & Subtitles** — Display large announcements directly on players' screens.
- 🔊 **Announcement Sounds** — Play configurable sounds when announcements are sent.
- 📊 **Boss Bar Announcements** — Display important information using boss bars.
- ⚡ **Action Bar Messages** — Show announcements above players' hotbars.
- 📋 **Announcement Presets** — Create reusable announcements in your configuration.
- ⏱️ **Custom Cooldowns** — Prevent excessive announcements with configurable cooldowns.
- 🔐 **Permission System** — Control who can send announcements and manage the plugin.
- 🛡️ **Cooldown Bypass** — Allow trusted staff members to bypass cooldown restrictions.
- 🖥️ **Console Support** — Send announcements directly from the server console.
- 🎨 **Advanced Formatting** — Customize colors, gradients, and text styles.
- 🔄 **Configuration Reloading** — Apply configuration changes without restarting.
- 📏 **Message Length Limits** — Configure the maximum allowed announcement length.
- 🧩 **Placeholders** — Support for built-in player and server placeholders.
- ⚙️ **Extensive Configuration** — Customize announcement behavior using configuration files.

*Some features and configuration options may differ between the Bukkit-based and Fabric editions.*

---

## 📸 In-Game Preview

### 🖥️ Title Announcements

Display large, colorful announcements directly on players' screens.

Titles can include customizable subtitles, formatting, and display settings.

**Example:**

**ANNOUNCEMENT**

Hello World

### 💬 Chat Announcements

Broadcast formatted announcements directly into Minecraft chat.

**Example:**

`[ANNOUNCEMENT] Hello World`

Staff members receive a confirmation when their announcement is sent.

`Announcement sent.`

### 🔊 Additional Announcement Options

Depending on your configuration, announcements can also be displayed using:

- Action bars
- Boss bars
- Custom sounds
- Multiple announcement formats

These features can be configured to match your server's preferences.

---

## 📢 Commands

| Command | Description |
|---|---|
| `/announc <message>` | Broadcast an announcement to all online players. |
| `/announc preset <name>` | Send a predefined announcement. |
| `/announc reload` | Reload the plugin configuration. |
| `/announce <message>` | Alias for `/announc`. |
| `/announcement <message>` | Alias for `/announc`. |

### Command Examples

**Send an announcement:**

`/announc The server will restart in 5 minutes!`

**Broadcast an event:**

`/announc The Dupe Event is now LIVE!`

**Use a preset:**

`/announc preset restart`

**Reload the configuration:**

`/announc reload`

*Command availability may vary depending on the platform-specific build.*

---

## 🔐 Permissions

| Permission | Description |
|---|---|
| `announc.use` | Allows sending announcements. |
| `announc.preset` | Allows using announcement presets. |
| `announc.reload` | Allows reloading the plugin configuration. |
| `announc.bypasscooldown` | Bypasses announcement cooldowns. |

Permissions can be managed using compatible permission plugins such as LuckPerms.

Fabric permissions may be implemented differently from Bukkit-based servers.

---

## ⚙️ Configuration

Announc+ includes extensive configuration options that allow server owners to customize how announcements work.

### Available Customization

- Announcement prefixes and formatting
- Chat messages and confirmation messages
- Title and subtitle appearance
- Announcement sounds
- Boss bar appearance and duration
- Action bar messages
- Announcement cooldowns
- Maximum message length
- Custom announcement presets
- Permission-related messages
- Built-in placeholders
- Individual announcement features

### Bukkit-Based Configuration

For Paper, Purpur, Spigot, Folia, and Bukkit, configuration is managed through the plugin's `config.yml`.

After editing your configuration, run:

`/announc reload`

### Fabric Configuration

The Fabric edition uses its own mod configuration implementation. Configuration file locations and available options may differ from the Bukkit-based edition.

Consult the Fabric release documentation for the correct configuration path.

---

## 🎨 Text Formatting

Announc+ provides customizable text formatting for server announcements.

### Bukkit-Based Editions

Supported formatting includes MiniMessage colors, gradients, bold text, italic text, and other formatting features where available.

**Example:**

`<gradient:#8b5cf6:#d946ef><bold>SERVER ANNOUNCEMENT</bold></gradient>`

This allows administrators to create visually appealing announcements that match their server's branding.

Formatting capabilities may differ in the Fabric edition.

---

## 🖥️ Compatibility

Announc+ provides separate builds for different Minecraft server platforms.

### Supported Server Software

| Server Software | Status |
|---|---|
| Paper | Supported |
| Purpur | Supported |
| Spigot | Supported |
| Folia | Supported |
| Bukkit | Supported |
| Fabric | Supported |

### Supported Minecraft Versions

| Minecraft Version | Java |
|---|---|
| 1.21.10 | Java 21 |
| 1.21.11 | Java 21 |
| 26.1 | Java 25 |
| 26.1.1 | Java 25 |
| 26.1.2 | Java 25 |
| 26.2 | Java 25 |
| 26.3 | Java 25 |

**Important:** Download the Announc+ release specifically built for your server software and Minecraft version. Not every combination of server software and Minecraft version is necessarily available.

Folia builds require region-safe scheduling and operations to work correctly with Folia's multithreaded server architecture.

Fabric requires a dedicated mod build and cannot load Bukkit plugin JARs directly.

---

## 📥 Installation

### Paper, Purpur, Spigot, Folia & Bukkit

1. Download the appropriate Announc+ `.jar` file for your server.
2. Place the file inside your server's `plugins` folder.
3. Restart your Minecraft server.
4. Open `plugins/Announc/config.yml` to customize the plugin.
5. Run `/announc reload` after making configuration changes.

### Fabric

1. Install the appropriate Fabric Loader for your Minecraft version.
2. Download the Announc+ Fabric `.jar` file.
3. Install any dependencies specified on the Fabric release page.
4. Place the mod inside your server's `mods` folder.
5. Restart your Minecraft server.
6. Configure Announc+ using the configuration method provided by the Fabric edition.

**Note:** Always use a release that explicitly supports your server software and Minecraft version.

---

## 🚀 Why Choose Announc+?

Announc+ is designed to provide a straightforward announcement system without sacrificing customization.

Whether you're announcing server restarts, community events, maintenance, updates, or important information, Announc+ provides multiple ways to communicate with your players.

### What Makes Announc+ Useful?

- Simple and easy-to-use commands
- Extensive customization options
- Multiple announcement display methods
- Reusable announcement presets
- Permission-based administrative controls
- Support for multiple server platforms
- Configuration changes without full server restarts

**Simple commands. Extensive customization. Better announcements.**

---

## 📌 Additional Information

- **Project:** Announc+
- **Version:** 1.0.1
- **Type:** Minecraft Server Plugin / Fabric Mod
- **Platforms:** Paper, Purpur, Spigot, Folia, Bukkit, Fabric
- **Configuration:** Platform-dependent
- **Formatting:** MiniMessage on compatible Bukkit-based builds
- **Category:** Server Management / Utility

Announc+ is intended for continued improvement, with additional features, bug fixes, and compatibility updates planned for future releases.

---

## 🚧 Platform Development & Future Support

**Announc+ is continuing to improve!**

Our goal is to provide a reliable, customizable announcement system across supported Minecraft server platforms.

### ✅ Current Platforms

- 📄 **Paper**
- 💜 **Purpur**
- 🔧 **Spigot**
- 🌿 **Folia**
- 🪣 **Bukkit**
- 🧵 **Fabric**

### ❌ Unsupported Platforms

The following mod loaders are not currently supported:

- Forge
- NeoForge

Support for Forge and NeoForge is not currently planned.

### 📢 Development Status

**Current Version:** 1.0.1

**Supported Platforms:** Paper, Purpur, Spigot, Folia, Bukkit, Fabric

**Supported Minecraft Versions:** 1.21.10, 1.21.11, 26.1, 26.1.1, 26.1.2, 26.2, 26.3

### Planned Improvements

- Additional compatibility updates
- Bug fixes and stability improvements
- Configuration enhancements
- New announcement customization options
- Performance improvements

Future updates will focus on improving the experience across supported platforms.

**Stay tuned for future Announc+ updates!**