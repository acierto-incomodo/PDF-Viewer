!macro preInit
  SetShellVarContext current
!macroend

!macro customInstall

  ; Ruta personalizada
  SetOutPath "$APPDATA\StormGamesStudios\Programs\Storm356\PDF-Viewer"

  ; Copiar archivos
  File /r "$INSTDIR\*.*"

  ; Guardar en registro
  WriteRegStr HKCU "Software\StormGamesStudios\PDFViewer" "InstallPath" "$APPDATA\StormGamesStudios\Programs\Storm356\PDF-Viewer"

  ; ==========================
  ; Preguntar si usar como visor por defecto
  ; ==========================

  MessageBox MB_YESNO "¿Quieres usar Storm PDF Viewer como visor por defecto de PDFs?" IDNO SkipDefault

  ; Asociar .pdf
  WriteRegStr HKCU "Software\Classes\.pdf" "" "StormPDF"
  WriteRegStr HKCU "Software\Classes\StormPDF" "" "PDF File"
  WriteRegStr HKCU "Software\Classes\StormPDF\shell\open\command" "" '"$APPDATA\StormGamesStudios\Programs\Storm356\PDF-Viewer\${PRODUCT_FILENAME}.exe" "%1"'

SkipDefault:

!macroend

!macro customUnInstall

  ; Borrar archivos
  RMDir /r "$APPDATA\StormGamesStudios\Programs\Storm356\PDF-Viewer"

  ; Limpiar registro
  DeleteRegKey HKCU "Software\StormGamesStudios\PDFViewer"

!macroend