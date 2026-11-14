; ==========================================================
; Pâtisserie 2D Simulator : pages de l'installeur (hook NSIS de Tauri)
; Bob te demande ta langue avant la copie des fichiers.
; Les sauvegardes et le compte se règlent ensuite dans le jeu (page d'accueil).
; A la fin, tout est noté dans  $APPDATA\com.turbonix.p2ds\init_config.json
; que le jeu lit au premier lancement.
; ==========================================================

!include "nsDialogs.nsh"
!include "LogicLib.nsh"

!define P2DS_BUNDLE "com.turbonix.p2ds"
!define P2DS_BG 0xFFF6EC
!define P2DS_TEXT 0x1B2B4A

Var P2DS_Dlg
Var P2DS_Ctl
Var P2DS_Img
Var P2DS_Ctl2
Var P2DS_Ctl3
Var P2DS_Done
Var P2DS_LangCode
Var P2DS_SavePath
Var P2DS_Account

; Le texte dans la langue choisie (français, sinon anglais)
!macro P2DS_TR VAR FR EN
  ${If} $P2DS_LangCode == "fr"
    StrCpy ${VAR} "${FR}"
  ${Else}
    StrCpy ${VAR} "${EN}"
  ${EndIf}
!macroend

; Pas de questions pendant une mise à jour automatique, ni si le jeu a déjà été configuré
Function P2DS_SkipIfUpdate
  ${GetOptions} $CMDLINE "/P" $0
  ${IfNot} ${Errors}
    Abort
  ${EndIf}
  ${GetOptions} $CMDLINE "/UPDATE" $0
  ${IfNot} ${Errors}
    Abort
  ${EndIf}
  SetShellVarContext current
  ${If} ${FileExists} "$APPDATA\${P2DS_BUNDLE}\init_config.json"
    Abort
  ${EndIf}
FunctionEnd

; Le début d'une page : fond beige, Bob à gauche
Function P2DS_PageStart
  nsDialogs::Create 1018
  Pop $P2DS_Dlg
  ${If} $P2DS_Dlg == error
    Abort
  ${EndIf}
  SetCtlColors $P2DS_Dlg "${P2DS_TEXT}" "${P2DS_BG}"
  InitPluginsDir
  File "/oname=$PLUGINSDIR\p2ds-bob.bmp" "${__FILEDIR__}\bob.bmp"
  ${NSD_CreateBitmap} 0u 6u 64u 92u ""
  Pop $P2DS_Ctl
  ${NSD_SetStretchedImage} $P2DS_Ctl "$PLUGINSDIR\p2ds-bob.bmp" $P2DS_Img
FunctionEnd

; Une bulle de Bob
!macro P2DS_BUBBLE TEXT
  ${NSD_CreateLabel} 70u 6u 222u 40u "${TEXT}"
  Pop $P2DS_Ctl
  SetCtlColors $P2DS_Ctl "${P2DS_TEXT}" "${P2DS_BG}"
!macroend

; ---------- 1. La langue ----------
Function P2DS_PageLang
  Call P2DS_SkipIfUpdate
  ${If} $P2DS_LangCode == ""
    StrCpy $P2DS_LangCode "fr"
  ${EndIf}
  !insertmacro MUI_HEADER_TEXT "Bob" "Bonjour ! / Hello!"
  Call P2DS_PageStart
  !insertmacro P2DS_BUBBLE "Salut, je suis Bob ! Dans quelle langue veux-tu que je te parle ?$\r$\nHi, I'm Bob! Which language should I speak with you?"
  ${NSD_CreateDropList} 70u 56u 160u 120u ""
  Pop $P2DS_Ctl2
  ${NSD_CB_AddString} $P2DS_Ctl2 "Français"
  ${NSD_CB_AddString} $P2DS_Ctl2 "English"
  ${NSD_CB_AddString} $P2DS_Ctl2 "Español"
  ${NSD_CB_AddString} $P2DS_Ctl2 "Português"
  ${NSD_CB_AddString} $P2DS_Ctl2 "Deutsch"
  ${NSD_CB_AddString} $P2DS_Ctl2 "العربية"
  ${NSD_CB_AddString} $P2DS_Ctl2 "中文"
  ${NSD_CB_AddString} $P2DS_Ctl2 "日本語"
  ${NSD_CB_AddString} $P2DS_Ctl2 "한국어"
  ${NSD_CB_AddString} $P2DS_Ctl2 "Русский"
  ${NSD_CB_SelectString} $P2DS_Ctl2 "Français"
  nsDialogs::Show
FunctionEnd

Function P2DS_PageLangLeave
  SendMessage $P2DS_Ctl2 ${CB_GETCURSEL} 0 0 $0
  ${Switch} $0
    ${Case} 0
      StrCpy $P2DS_LangCode "fr"
      ${Break}
    ${Case} 1
      StrCpy $P2DS_LangCode "en"
      ${Break}
    ${Case} 2
      StrCpy $P2DS_LangCode "es"
      ${Break}
    ${Case} 3
      StrCpy $P2DS_LangCode "pt"
      ${Break}
    ${Case} 4
      StrCpy $P2DS_LangCode "de"
      ${Break}
    ${Case} 5
      StrCpy $P2DS_LangCode "ar"
      ${Break}
    ${Case} 6
      StrCpy $P2DS_LangCode "zh"
      ${Break}
    ${Case} 7
      StrCpy $P2DS_LangCode "ja"
      ${Break}
    ${Case} 8
      StrCpy $P2DS_LangCode "ko"
      ${Break}
    ${Case} 9
      StrCpy $P2DS_LangCode "ru"
      ${Break}
  ${EndSwitch}
  StrCpy $P2DS_Done "1"
FunctionEnd

Page custom P2DS_PageLang P2DS_PageLangLeave

; ---------- A la fin de l'installation : init_config.json ----------
!macro NSIS_HOOK_POSTINSTALL
  ${If} $P2DS_Done == "1"
    SetShellVarContext current
    CreateDirectory "$APPDATA\${P2DS_BUNDLE}"
    FileOpen $R1 "$APPDATA\${P2DS_BUNDLE}\init_config.json" w
    FileWrite $R1 '{$\r$\n  "lang": "$P2DS_LangCode"$\r$\n}$\r$\n'
    FileClose $R1
  ${EndIf}
!macroend
