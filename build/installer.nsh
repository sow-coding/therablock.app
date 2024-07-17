!include "MUI2.nsh"

; Request application privileges for Windows Vista and above
RequestExecutionLevel admin

; Define uninstaller pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

Section "CreateUninstaller"
  ; Ensure the installation directory exists
  IfFileExists "$INSTDIR\" "" 0
  CreateDirectory "$INSTDIR"

  ; Write the uninstaller
  WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section "Uninstall"
  ; Call the confirmation function
  Call un.OnConfirm

  ; Check if uninstallation was cancelled
  StrCmp $R2 1 cancelUninstall

  ; Execute the cleanup batch file
  ExecShell "open" "$INSTDIR\resources\scripts\run_cleanup.bat" "" SW_SHOWNORMAL
  Pop $0
  DetailPrint "Cleanup batch script return code: $0"
  StrCmp $0 0 +2
  MessageBox MB_OK "A window opens, please grant the necessary permissions"

  ; Proceed with actual uninstallation
  Delete "$DESKTOP\Therablock.lnk"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKLM "Software\Therablock"
  DeleteRegKey HKCU "Software\Therablock"

  Return

cancelUninstall:
  MessageBox MB_OK "Uninstallation cancelled."
  Abort

SectionEnd

Function un.OnConfirm
  StrCpy $R0 1
  StrCpy $R1 3  ; For testing, set to 3 confirmations. Change to 1000 for production.
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
