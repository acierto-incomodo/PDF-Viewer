!macro customInit
  StrCpy $INSTDIR "$APPDATA\StormGamesStudios\Programs\PDF Viewer"
!macroend

!macro preInit
  SetShellVarContext current
!macroend

!macro customInstall

  ; ==========================
  ; Preguntar si usar como visor por defecto
  ; ==========================
  MessageBox MB_YESNO "¿Quieres usar Storm PDF Viewer como visor por defecto de PDFs?" IDNO SkipDefault

  ; Asociación de PDF
  WriteRegStr HKCU "Software\Classes\.pdf" "" "StormPDF"
  WriteRegStr HKCU "Software\Classes\StormPDF" "" "PDF File"
  WriteRegStr HKCU "Software\Classes\StormPDF\shell\open\command" "" '"$INSTDIR\${PRODUCT_FILENAME}.exe" "%1"'

SkipDefault:

!macroend

!macro customUnInstall

  ; Limpiar registro
  DeleteRegKey HKCU "Software\StormGamesStudios\PDFViewer"

!macroend