# Vortex Lutris Installer

[vortex-lutris-installer.yml](./vortex-lutris-installer.yml)

This Lutris installer for Vortex latest automatically detects over 45 games with the relevant extensions installed.  
It should be able to find games installed in ANY STEAM LIBRARY FOLDER.

## Flatpak/Steam Deck COMPATIBLE!

This may be the best form of Steam Deck support for Vortex available now.  
There are numerous outdated installers hosted on the Lutris website and [other repos](https://github.com/rockerbacon/modorganizer2-linux-installer/releases/2.0). 

## FAQ

### 
<details><summary><strong>QUESTIONS & ANSWERS:</strong></summary>

Q: Can I use the shortcuts provided by Lutris and/or Steam?  
A: Yes! Steam monitors when Lutris closes. Lutris monitors Vortex and closes with WINE.  

Q: Where are my files when browsing within Vortex?  
A: The "Z:" drive points to "/", the root of your filesystem.  

Q: How do I add new Steam games to Vortex?  
A: Use the "Execute script" context menu option for Vortex in Lutris.  
    All scripts are portable! They can be run outside of Lutris safely!  
    You can launch them from your file manager or on the command line.  
    The latter two scripts will not create a log of their actions unless specified.  
- `vortex-prefix-updater.sh`
  - Launches the next two scripts and writes their output to the install.log file.  
- `vortex-steam-symlinker.sh` 
  - Updates your games list in Vortex by linking all currently installed steam games.  
- `vortex-entry-writer.sh`
  - Updates your link handler and sets it as the default for nxm: links.  

Q: Can I move Vortex via its game directory configuration in Lutris?  
A: Yes*. Use the "Execute script" context menu option for Vortex immediately after the move to fix update the download handler's filepath.  
*Flatpak/Steam Deck: [Due to a known issue you may need to manually allow Lutris to access your custom game folder.](https://github.com/flathub/net.lutris.Lutris#known-issues)

Q: Can I make changes to the Vortex Lutris configuration?  
A: DO NOT CHANGE "Prefix Command" or "Manual Script" in the advanced options of the Lutris configuration for Vortex.  
Gamemode has been tested and does work with Vortex, though is likely unnecessary.  
All other options are untested and may have no affect on Vortex due to the Prefix Command completely overriding normal command execution.  

Q: Can I use Symlink Deployment or Move Deployment?  
A: Only Hardlink Deployment has been tested.  
Some untested game extensions may automatically select other deployment strategies.  
See this issue comment for more information: https://github.com/Nexus-Mods/Vortex/issues/9629#issuecomment-1013658187  

Q: Vortex is running but Lutris thinks it has stopped?  
A: Lutris detects the restart of a monitored process as Vortex stopping when a Vortex download link is handled while Vortex is already running.  

Q: How does the url get to Vortex?  
A: [This installer creates a desktop entry to handle nxm links for Lutris](https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html#mime-types). It accepts the nxm download url and writes it to the Vortex launch arguments before running.  

Q: Why is the url so slow to open in Vortex?  
A: The desktop entry opens the Lutris sqlite game database and writes the url to a file before even launching Lutris.  
Unless Lutris is enhanced to allow passing arguments directly to the executable from the command line instead of only from its configuration file, this will remain the fastest method which integrates with Lutris and Steam.  
The link handler may speed up when opening subsequent links (as in after the first link).  

Q: Why not make the scripts strictly sh POSIX compliant?  
A: Bash is provided by the Lutris runtime and required by Steam. Arrays also greatly simplify the steam-symlinker.  

Q: Hello I represent the desktop entry escape character parser.  
A: `sed -E -n "122635s/(.*)/\u\1/;122635p;122635x;122635s/^([^\n]+)\n([^\n]+)/\2\n\1/p;72676x;72676H;108137x;108137H;66763x;66763H;2608s/(.*)/\1!/;2608h;" /usr/share/dict/american-english`  
</details>

### Contributing

Provide feedback about the installer, configuring Vortex for WINE, or desktop integration improvements, be it on Valve's first-party hardware or a personal system on [_a distro Lutris is already packaged for_](https://lutris.net/downloads) via issues and PRs!

<details><summary>For Vortex Extension Authors:</summary>

All of the proton games which have not been automatically manageable in Vortex via Wine/Proton SHOULD be automatically detectable but are expressly rejected by the game detection code of each respective Vortex Extension. Extensions are plagued with '.exe' *ONLY* requirements, typically ignoring any valid Linux native executable files. See recommends below.

The scripts already handle linking prefixes to the expected directories on a normal windows machine, so extension code that relies only on Windows program files in the regular steam installation location works as expected when managing SteamPlay/Proton games. Though those are detected more readily than native titles, it is typically only the statically defined executable naming which prevents game detection.

Extension authors should review the [steamdb](https://steamdb.info/) and add appropriate code to switch between each valid executable it should be expected to handle. Also, refrain from using registry keys of game installation (or uninstallation) to detect the correct file path, as that is the hardest part to add to the Lutris installers since the keys *must be statically defined* and take forever to add since each command runs one at a time by starting the regeditor for the prefix, adding the key, then closing the regeditor before the next key is added.

The vortex provided api's are the best option to locate games correctly. This Lutris installer is already written and working with numerous extensions using either the required developer generated registry key, steam appid registry key, steam app manifest path, or some combination of both. It is clear this is already solved better in Vortex and all the registry key tasks could be removed if all the extensions appropriately used the Steam game detection method as a fallback.

tldr: Include the vortex api's steam game path detection as a valid location AFTER any/all static Windows locations FAIL or don't use registry keys at all for Steam games!
Recommended Game Detection Preference Order with Examples Linked:
[Appid's/manifests from the steam store vortex api](https://github.com/Nexus-Mods/vortex-games/blob/master/game-darksouls2/index.js#L23)
[installdir detection](https://github.com/Nexus-Mods/vortex-games/blob/master/game-darkestdungeon/index.js#L44)
[developer install/uninstall keys](https://github.com/Nexus-Mods/vortex-games/blob/master/game-witcher2/index.js#L11-L14)
[wildly guessing at the game's path](https://github.com/Nexus-Mods/vortex-games/blob/master/game-stardewvalley/index.js#L63-L76) (there was an attempt, :star: )

If all extensions stopped relying on registry keys or a valid substitute for Lutris' wine runner task for regedits were implemented, this script could be converted directly into a standalone bash installer, dropping Lutris as a dependency.
</details>

## Game Compatibility

There are now 45+ games automatically detected!  
Vortex Extensions contributed by other community members must be downloaded and installed in-app or [manually](https://www.nexusmods.com/site/mods/).  
All [Verified](https://www.steamdeck.com/en/verified) Proton games with a valid extension which correctly utilizes the game's steam location [_should_](#vortex-extensions) work.  
<details><summary>Supported:</summary>

Automatically Detected and Known Moddable Games
  - Fallout 3
  - Fallout 3 Game of the Year Edition
  - Fallout 4
  - Fallout New Vegas
  - Morrowind
  - Oblivion
  - Skyrim
  - Skyrim Special Edition
  - Skyrim VR
</details>
<details><summary>Tested:</summary>

  - Stardew Valley (NATIVE AND PROTON) ([The default extension has a known issue](https://github.com/Nexus-Mods/Vortex/issues/12548))  
    - The Stardew Valley 64bit extension may detect NATIVE?
</details>
<details><summary>Untested:</summary>

Automatically detected and managable but deployment status/capability unknown
  - BATTLETECH (PROTON ONLY)
  - Bayonetta
  - Borderlands 2 (PROTON ONLY)
  - Bloodstained: Ritual of the Night
  - Bluefire
  - Control
  - DARK SOULS: Prepare to Die Edition
  - DARK SOULS REMASTERED
  - DARK SOULS II
  - DARK SOULS II Scholar of the First Sin
  - Darkest Dungeon
  - Divinity: Original Sin 2 Definitive Edition
  - Divinity: Original Sin 2 Original Edition
  - Don't Starve Together (NATIVE) (Patched! WIP for better executable detection)
  - DOOM (2016)
  - DOOM Eternal
  - Dragon Age: Origins
  - ELDEN RING
  - Fallout 4 VR
  - Halo: The Master Chief Collection
  - Into the Breach (PROTON ONLY)
  - Kerbal Space Program (PROTON ONLY)
  - Left 4 Dead 2 (NATIVE AND PROTON)
  - MechWarrior 5: Mercenaries
  - Monster Hunter Rise
  - Monster Hunter: World
  - No Man's Sky
  - Outward
  - Portal 2 (NATIVE)
  - Project Wingman
  - Sekiro: Shadows Die Twice
  - Slime Rancher (NATIVE AND PROTON)
  - Star Wars: KOTOR
  - Starbound (NATIVE AND PROTON)
  - Subnautica
  - Subnautica: Below Zero
  - The Elder Scrolls: Arena
  - The Witcher
  - The Witcher 2 (PROTON ONLY)
  - The Witcher 3
  - Valheim (PROTON ONLY)
  - Yakuza 3 Remastered
</details>

### Vortex Extensions
<details><summary>Known Issues/Bugs</summary>

Vortex's Officially Supported Extensions:
  - [BATTLETECH](https://github.com/Nexus-Mods/vortex-games/tree/master/game-battletech) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [Kerbal Space Program](https://github.com/Nexus-Mods/vortex-games/tree/master/game-kerbalspaceprogram) (NATIVE)
    - looks like it should work, but doesn't
    - [missing hash files?](https://github.com/Nexus-Mods/vortex-games/blob/master/game-kerbalspaceprogram/index.js#L32)
  - [Shadowrun Returns](https://github.com/Nexus-Mods/vortex-games/tree/master/game-shadowrunreturns) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [Star Wars: KOTOR II](https://github.com/Nexus-Mods/vortex-games/tree/master/game-sw-kotor) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [Team Fortress 2](https://github.com/Nexus-Mods/vortex-games/tree/master/game-teamfortress2) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [The Elder Scrolls Online](https://github.com/Nexus-Mods/vortex-games/tree/master/game-teso)
    - To Be Determined
  - [The Witcher 2](https://github.com/Nexus-Mods/vortex-games/tree/master/game-witcher2) (NATIVE)
    - [this despite also containing seemingly appropriate switches for the linux launcher filenames](https://github.com/Nexus-Mods/vortex-games/commit/50444c1e1e8645b4664d94476c06d912049f2962#diff-7aa88eee769cbdb39d3d0123036d30230be20ceefb841d95c1a8a2a11c8c160dR10-R12)
  - [War Thunder](https://github.com/Nexus-Mods/vortex-games/blob/master/game-warthunder/)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [XCOM 2](https://github.com/Nexus-Mods/vortex-games/tree/master/game-xcom2) (NATIVE)
    - The file and folder naming appears to not be identical to a Windows install minus .exe extensions

Contributed/Third Party Extensions:
  - [Borderlands 2](https://www.nexusmods.com/site/mods/138?tab=bugs) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [Cities: Skylines](https://www.nexusmods.com/site/mods/231?tab=bugs) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [Counter-Strike: Source](https://www.nexusmods.com/site/mods/135?tab=bugs) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [DARK SOULS III](https://www.nexusmods.com/site/mods/194?tab=bugs)
    - incorrect folder structure required
  - [Fallout 76](https://www.nexusmods.com/site/mods/110?tab=bugs)
    - has many bugs pending already
  - [Half-Life 2](https://www.nexusmods.com/site/mods/80?tab=bugs) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [Half-Life 2 Deathmatch](https://www.nexusmods.com/site/mods/136?tab=bugs) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [Half-Life 2: Update](https://www.nexusmods.com/site/mods/128?tab=bugs) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [Into The Breach](https://www.nexusmods.com/site/mods/176?tab=bugs) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
  - [Middle Earth: Shadow of War](https://www.nexusmods.com/site/mods/375?tab=bugs)
    - 'bink2w64_.dll' doesn't exist in my install and removing that one required file from the array enabled detection
  - [PAYDAY 2](https://www.nexusmods.com/site/mods/239?tab=posts) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
    - No bug reporting page for what is literally a piece of code, smh
  - [Valheim](https://www.nexusmods.com/site/mods/210?tab=bugs) (NATIVE)
    - Extension always requires a .exe! No NATIVE linux launcher/executable detection
</details>
