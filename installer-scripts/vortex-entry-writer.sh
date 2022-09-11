#!/usr/bin/bash
if [ -n "$WINEPREFIX" ]; then
    VORTEX_PREFIX="$WINEPREFIX";
fi;
if [ ! -d "$VORTEX_PREFIX" ]; then
    VORTEX_PREFIX="$(realpath "$(dirname "$0";)";)";
fi;
printf "%s\n" "INFO: Using Vortex prefix at \"$VORTEX_PREFIX\"";
DESKTOP_FNAME='vortex-downloads-handler.desktop';
DESKTOP_SHARE=~/.local/share;
DESKTOP_APPLS="$DESKTOP_SHARE"/applications/;
DESKTOP_FPATH="$DESKTOP_APPLS$DESKTOP_FNAME";
if mkdir -p "$DESKTOP_SHARE"/icons/hicolor/scalable/mimetypes \
   "$DESKTOP_SHARE"/icons/hicolor/scalable/apps \
   "$DESKTOP_SHARE"/icons/hicolor/512x512/mimetypes \
   "$DESKTOP_SHARE"/icons/hicolor/512x512/mimetypes;
then
    SVGICONS="$DESKTOP_SHARE"/icons/hicolor/scalable;
    if curl -o "$SVGICONS"/apps/CFE6_Vortex.0.svg -s https://www.nexusmods.com/bootstrap/images/vortex/vortex-logomark.svg; then
        ln -s -T "$SVGICONS"/apps/CFE6_Vortex.0.svg "$SVGICONS"/apps/37E4_Vortex.0.svg;
        ln -s -T "$SVGICONS"/apps/CFE6_Vortex.0.svg "$DESKTOP_SHARE"/icons/hicolor/512x512/apps/CFE6_Vortex.0.svg;
        ln -s -T "$SVGICONS"/apps/CFE6_Vortex.0.svg "$DESKTOP_SHARE"/icons/hicolor/512x512/apps/37E4_Vortex.0.svg;
    fi;
    if curl -o "$SVGICONS"/mimetypes/x-scheme-handler-nxm.svg -s https://raw.githubusercontent.com/Nexus-Mods/Vortex/master/assets/images/nexus.svg; then
        ln -s -T "$SVGICONS"/mimetypes/x-scheme-handler-nxm.svg "$SVGICONS"/mimetypes/gnome-mime-x-scheme-handler-nxm.svg;
        ln -s -T "$SVGICONS"/mimetypes/x-scheme-handler-nxm.svg "$SVGICONS"/mimetypes/x-scheme-handler-nxm-protocol.svg;
        ln -s -T "$SVGICONS"/mimetypes/x-scheme-handler-nxm.svg "$DESKTOP_SHARE"/icons/hicolor/512x512/mimetypes/gnome-mime-x-scheme-handler-nxm.svg;
        ln -s -T "$SVGICONS"/mimetypes/x-scheme-handler-nxm.svg "$DESKTOP_SHARE"/icons/hicolor/512x512/mimetypes/x-scheme-handler-nxm.svg;
        ln -s -T "$SVGICONS"/mimetypes/x-scheme-handler-nxm.svg "$DESKTOP_SHARE"/icons/hicolor/512x512/mimetypes/x-scheme-handler-nxm-protocol.svg;
    fi;
fi;
if [ -f "$DESKTOP_APPLS/wine/Programs/Black Tree Gaming Ltd/Vortex.desktop" ]; then
    rm -f "$DESKTOP_APPLS/wine/Programs/Black Tree Gaming Ltd/Vortex.desktop";
    rmdir --ignore-fail-on-non-empty -p "$DESKTOP_APPLS/wine/Programs/Black Tree Gaming Ltd";
fi;
printf "%s\n" "INFO: Making an entry for NXM Download Handling at \"$DESKTOP_FPATH\"";
cat <<EOF > "$DESKTOP_FPATH";
[Desktop Entry]
Categories=Game;Network;
Comment=Vortex NXM Download Handler
Exec=env $(if [ -n "$WINEPREFIX" ]; then printf "%s" "WINEPREFIX='$WINEPREFIX' "; fi;)DOTNET_ROOT='c:\\\\Program Files\\\\dotnet\\\\' sh -c "wine start /d 'c:\\\\Program Files\\\\Black Tree Gaming Ltd\\\\Vortex\\\\' Vortex.exe -d %u"
MimeType=x-scheme-handler/nxm-protocol;x-scheme-handler/nxm;
NoDisplay=true
Icon=CFE6_Vortex.0
Name=Vortex
StartupNotify=true
Terminal=false
Type=Application

EOF
printf "%s%s\n" "INFO: Making an entry for Vortex at \"$DESKTOP_APPLS" "wine-Programs-Black Tree Gaming Ltd-Vortex.desktop\"";
cat <<EOF > "$DESKTOP_APPLS"wine-Programs-Black\ Tree\ Gaming\ Ltd-Vortex.desktop;
[Desktop Entry]
Categories=Game;Network;
Comment=Vortex Mod Manager
Exec=env $(if [ -n "$WINEPREFIX" ]; then printf "%s" "WINEPREFIX='$WINEPREFIX' "; fi;)DOTNET_ROOT='c:\\\\Program Files\\\\dotnet\\\\' sh -c "wine start /d 'c:\\\\Program Files\\\\Black Tree Gaming Ltd\\\\Vortex\\\\' Vortex.exe"
NoDisplay=false
Icon=CFE6_Vortex.0
Name=Vortex
StartupNotify=true
Terminal=false
Type=Application

EOF
xdg-desktop-menu install --novendor "$DESKTOP_FPATH";
xdg-mime default "$DESKTOP_FPATH" x-scheme-handler/nxm x-scheme-handler/nxm-protocol;
fix_mimetypes(){
if [ -f "$1" ]; then
sed -E -i "s/x-scheme-handler\/nxm=[^[=$=]]\+/x-scheme-handler\/nxm=$DESKTOP_FNAME;/" "$1";
check="$(grep -a -o -e "x-scheme-handler/nxm=$DESKTOP_FNAME;" "$1")";
if [ -z "$check" ]; then
printf "%s\n" "x-scheme-handler/nxm=$DESKTOP_FNAME;" >> "$1";
fi;
sed -E -i "s/x-scheme-handler\/nxm-protocol=[^[=$=]]\+/x-scheme-handler\/nxm-protocol=$DESKTOP_FNAME;/" "$1";
check="$(grep -a -o -e "x-scheme-handler/nxm-protocol=$DESKTOP_FNAME;" "$1")"
if [ -z "$check" ]; then
printf "%s\n" "x-scheme-handler/nxm-protocol=$DESKTOP_FNAME;" >> "$1";
fi;
else
printf "%s\n%s\n%s\n\n" "$2" "x-scheme-handler/nxm=$DESKTOP_FNAME;" "x-scheme-handler/nxm-protocol=$DESKTOP_FNAME;" > "$1";
fi;
};
fix_mimetypes "$DESKTOP_APPLS/mimeinfo.cache" "[MIME Cache]";
fix_mimetypes "$DESKTOP_APPLS/defaults.list" "[Default Applications]";
