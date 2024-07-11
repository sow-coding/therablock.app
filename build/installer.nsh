!macro customUnInstall
  ; This macro is used to define actions during uninstallation
  !echo "Custom uninstall actions"
  
  StrCpy $R0 1
  StrCpy $R1 1000

  Loop:
    MessageBox MB_YESNO|MB_ICONQUESTION "Are you sure you want to uninstall Therablock? This is confirmation $R0 out of $R1." IDNO Cancel
    IntOp $R0 $R0 + 1
    IntCmp $R0 $R1 Done Loop

  Done:
    ; Proceed with actual uninstallation
    Delete "$DESKTOP\Therablock.lnk"
    RMDir /r "$INSTDIR"
    DeleteRegKey HKLM "Software\Therablock"
    DeleteRegKey HKCU "Software\Therablock"
    MessageBox MB_OK "Therablock has been successfully removed from your computer."
    Return

  Cancel:
    MessageBox MB_OK "Uninstallation cancelled."
    Abort

!macroend
