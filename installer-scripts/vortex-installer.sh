#!/usr/bin/bash
function main(){
if which find grep sed steam winetricks wine xdg-mime sha512sum curl;
then printf "%s\n" "GOOD: All Required Binaries are Installed!";
else printf "%s\n" "EROR: Missing Some Required Binaries! Install them first!";exit 1;
fi; printf "%s\n" "INFO: Starting Vortex Installation!";
# init WINEPREFIX with .NET 4.8 Framework
winetricks --unattended dotnet48 2>/dev/null;
if [ -n "$WINEPREFIX" ];
then VORTEX_PREFIX="$WINEPREFIX";
fi; # Use the same path as winetricks
if [ ! -d "$VORTEX_PREFIX" ];
then VORTEX_PREFIX=~/.wine;
fi; # Use the default path
if cd "$VORTEX_PREFIX"; # goto selected path
then printf "%s\n" "INFO: Using Vortex prefix at \"$VORTEX_PREFIX\"";
else printf "%s\n" "EROR: Couldn't go to Vortex prefix at \"$VORTEX_PREFIX\"";exit 2;
fi; # try to find latest vortex release
if curl -O -L -s https://github.com/Nexus-Mods/Vortex/releases/latest;
then VORTEX_LATEST="https://github.com$(grep -a -o -m 1 -E "/Nexus-Mods/Vortex/releases/download/v[[:digit:]\.]+/.+.exe" latest)";rm latest;
else printf "%s\n" "EROR: Couldn't get the latest Vortex release!";exit 3;
fi; # try to download dependencies
if ! curl -\
o windowsdesktop-runtime-6.0.8-win-x64.exe \
"https://download.visualstudio.microsoft.com/download/pr/b4a17a47-2fe8-498d-b817-30ad2e23f413/00020402af25ba40990c6cc3db5cb270/windowsdesktop-runtime-6.0.8-win-x64.exe" -\
o vortex-steam-symlinker.sh \
"https://raw.githubusercontent.com/NicBOMB/Vortex/wine-installer/installer-scripts/vortex-steam-symlinker.sh" -\
o keys.reg \
"https://raw.githubusercontent.com/NicBOMB/Vortex/wine-installer/installer-scripts/keys.reg" -\
o vortex-entry-writer.sh \
"https://raw.githubusercontent.com/NicBOMB/Vortex/wine-installer/installer-scripts/vortex-entry-writer.sh" -\
Lo vortex-setup.exe "$VORTEX_LATEST" \
; then printf "%s\n" "EROR: A download failed!";exit 3;
fi; # test download against the checksum published by Microsoft before running
if printf "%s %s" \
"53d5f38ebec2675d43c618c32533f3b8684384839b4bfa83902d06be535a56410255e26ee0a4844c170f7536be9039a126eebec8577a781b8a0c30c00a7ad20e" \
"windowsdesktop-runtime-6.0.8-win-x64.exe" \
| sha512sum -c; # run .NET 6 Runtime in WINEPREFIX
then wine start /wait windowsdesktop-runtime-6.0.8-win-x64.exe /quiet >/dev/null 2>&1;
else printf "%s\n%s\n" \
"EROR: Failed to validate the .NET 6 runtime installer!" \
"EROR: windowsdesktop-runtime-6.0.8-win-x64.exe may have been corrupted or tampered with! Removing it!";
rm windowsdesktop-runtime-6.0.8-win-x64.exe;exit 4;
fi; # regedit is ancient so we need to pen it a letter containing necessary keys.
if wine start /wait regedit keys.reg /S >/dev/null 2>&1;
then printf "%s\n" "GOOD: Steam was added to the WINE registry!";
else printf "%s\s%s\n" \
"EROR: Failed to update the registry!" \
"EROR: Vortex extensions for Steam games won't detect game locations without this!";
exit 5;
fi;
if ! chmod ugo+x vortex-steam-symlinker.sh vortex-entry-writer.sh;
then printf "%s\n" "EROR: Failed to set file permissions as executable!";exit 6;
fi;
if ./vortex-steam-symlinker.sh;
then printf "%s\n" "INFO: Steam symlinker finished!";
else printf "%s\n" "WARN: Steam symlinker failed!";exit 7;
fi;
# shellcheck disable=SC2034,SC1003
DOTNET_ROOT='c:\Program Files\dotnet\'; # specify the dotnet location
# after winetricks and installing the runtime but before running vortex
if wine start /wait vortex-setup.exe >/dev/null 2>&1;
then printf "%s\n" "GOOD: vortex-setup.exe finished!";
else printf "%s\n" "EROR: Failed to run the latest vortex-setup.exe!";exit 8;
fi;
if ./vortex-entry-writer.sh;
then printf "%s\n" "INFO: entry writer finished!";
else printf "%s\n" "WARN: entry writer failed!";exit 9;
fi;
printf "%s\n" "GOOD: Installed Vortex Successfully!";
}
set -eo pipefail;
main 2>&1 | tee 'install.log';
