# Vortex Development Package
## Automatic Dependency Installation
### Windows
- Download `bootstrap.ps1` and run as a powershell script
  - In the dialog that shows up, select a build directory (should be a clean/new one)
  - This script will try to download and install all dependencies, then check out and build vortex
  - The dependencies are not installed headless so you have to click through the dialogs but it's only guaranteed to work if you keep the defaults
### Linux
#### Arch
```sh
sudo pacman -Syu base-devel git npm nodejs node-gyp cmake zlib lz4 zip flatpak-builder
```
#### Debian
(incomplete, PRs welcome)
```sh
sudo apt install zlib1g-dev liblz4-dev
```
#### Fedora
(incomplete, PRs welcome)
```sh
sudo dnf install zlib-devel lz4-devel
```
#### Other
(PRs welcome)
```sh
this is a template
```
## Manual Dependency Installation
- If automatic installation of any dependency fails use the instructions provided for each dependency below.
- If any of the provided link is no longer valid
  - Try searching the web or use your package manager.
  - Make a PR with updated links.
### Node.js
- Download and run the installer from [nodejs.org](https://nodejs.org)
- Version should not matter; the latest and/or LTS version are both fine
- Verify that Node was installed successfully by running `node --version` in your _cmd_ or _terminal_
### pnpm
- Node has started shipping [corepack](https://nodejs.org/api/corepack.html#corepack), a new method for directly installing package managers.
- Update to the latest version of NodeJS or a version which supports corepack.
- Run the following commands:
  - `corepack enable && corepack prepare pnpm@latest --activate`
- Verify that pnpm was installed successfully with:
  - `pnpm --version`.
  - Note:
     - Running `pnpm -v` from the cloned Vortex repo will list the version of the packageManager specified in [package.json](package.json).
       - Complex semver ranges don't appear to be supported (yet?)
### Python
- Many node modules require node-gyp, which requires python.
- Download and run the installer (64-bit) from [python.org](https://www.python.org/downloads/).
- When installing, make sure to tick the box which adds python to the `PATH`.
- Verify that Python was installed successfully by running `python --version` in your _cmd_ or _terminal_
### Git
- Download and run the installer from [git-scm.com](https://git-scm.com/downloads)
- Verify that Git was installed successfully by running `git --version` in your _cmd_ or _terminal_
### CMake
- Download and run the installer from [cmake.org](https://cmake.org/download/)
- Verify that CMake was installed successfully by running `cmake --version` in your _cmd_ or _terminal_
### C++ Tools
### Visual C++ Build Tools 2022 or Visual Studio 2022 (Community Edition)
- Download and run the installer from [visualstudio.microsoft.com](https://visualstudio.microsoft.com/en/downloads/)
  - You may have to search Microsoft's website as their sitemap changes frequently.
  - When installing, make sure you enable the build tools, latest windows SDK and ATL headers. Other components are optional.
#### Cloning and Installing Sources
Create and `cd` to an appropriate directory (i.e. `C:\GitHub\Nexus-Mods\`, `/GitHub/Nexus-Mods`) then run the following commands
```sh
git clone --recursive https://github.com/NicBOMB/Vortex.git
cd Vortex
```
Running the following commands will build Vortex, its extensions, and start the app using those builds.
```sh
pnpm install
pnpm start
```
------
# Further Information
## User Guides
- See [https://wiki.nexusmods.com/index.php/Vortex](https://wiki.nexusmods.com/index.php/Vortex) for usage information
## Developer Guides
- For development
  - See [structure.md](structure.md) for an extended overview of the project.
- For production
  - The scripts ([electron-builder-oneclick.json](electron-builder-oneclick.json) and [electron-builder-advanced.json](electron-builder-advanced.json) require code signing with a certificate you don't have so change those.
  - `pnpm dist` to make distributable packages (this will take a while)
    - installers and an unpacked distributable will build into `dist/`
# Reporting bugs
Please report issues to the issue tracker on github. Please always include at the very least the following information:
- The exact version of Vortex you're using
- Your operating system
- What you were doing when the bug happened
- What exactly the bug is (crash? error messages? unexpected behaviour?)
- If you get any error message, include the full and exact error message. Do not paraphrase, do not leave out information that looks cryptic or unimportant to you
- The log file (see below)
- Ideally also the application state (see below)

All data the client generates (including settings and logs) are stored at the following filepaths:

<details><summary>Windows</summary>

`C:\Users\<username>\AppData\Roaming\Vortex` (releases)

or

`C:\Users\<username>\AppData\Roaming\vortex-devel` (development build)

</details>
<details><summary>Linux</summary>

`/home/<username>/.config/Vortex` (releases)

or

`/home/<username>/.config/vortex-devel` (development build)

or

TBA (flatpak build)

</details>

If you need to report a bug, the following files inside Vortex's directory may be useful in addition to the error message displayed on screen:
- `vortex.log` (logs are rotated at a certain size, this is the latest one)
- `state\*` except `global_account` which contains sensitive information like keys and passwords
- `<game>\state\*` (if the bug pertains to a specific game)
