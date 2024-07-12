!include "MUI2.nsh"

; Define uninstaller pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

Section "CreateUninstaller"
  WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section "Uninstall"
  ; Call the confirmation function
  Call un.OnConfirm

  ; Check if uninstallation was cancelled
  StrCmp $R2 1 cancelUninstall

  ; Proceed with actual uninstallation
  Delete "$DESKTOP\Therablock.lnk"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKLM "Software\Therablock"
  DeleteRegKey HKCU "Software\Therablock"
  MessageBox MB_OK "Therablock has been successfully removed from your computer."
  Return

cancelUninstall:
  MessageBox MB_OK "Uninstallation cancelled."
  Abort

SectionEnd

Function un.OnConfirm
  StrCpy $R0 1
  StrCpy $R1 1000
  StrCpy $R2 0  ; Variable to track cancellation

  Loop:
    MessageBox MB_YESNO|MB_ICONQUESTION "Are you sure you want to uninstall Therablock? This is confirmation $R0 out of $R1." IDNO Cancel
    IntOp $R0 $R0 + 1
    IntCmp $R0 $R1 Done Loop

  Cancel:
    StrCpy $R2 1
    Abort

  Done:
    ; Check if uninstallation was cancelled
    IntCmp $R2 1 0 +2
    Return

FunctionEnd
