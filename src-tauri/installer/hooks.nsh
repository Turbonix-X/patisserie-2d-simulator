; ==========================================================
; Pâtisserie 2D Simulator : pages de l'installeur (hook NSIS de Tauri)
; Bob te pose trois questions avant la copie des fichiers :
;   1. ta langue   2. tes sauvegardes   3. ton compte
; A la fin, tout est noté dans  $APPDATA\com.turbonix.p2ds\init_config.json
; que le jeu lit au premier lancement.
; ==========================================================

!include "nsDialogs.nsh"
!include "LogicLib.nsh"
${StrRep}

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

; ---------- 2. Les sauvegardes ----------
Function P2DS_PageSave
  Call P2DS_SkipIfUpdate
  !insertmacro P2DS_TR $1 "Tes sauvegardes" "Your saves"
  !insertmacro MUI_HEADER_TEXT "Bob" "$1"
  Call P2DS_PageStart
  !insertmacro P2DS_TR $1 "Tu as déjà une sauvegarde ?$\r$\nChoisis le fichier (.p2ds ou .txt) pour la retrouver dans le jeu. Tu pourras aussi coller ton code dans le jeu, sur la page d'accueil." "Do you already have a save?$\r$\nPick the file (.p2ds or .txt) to get it back in the game. You can also paste your code in the game, on the home page."
  !insertmacro P2DS_BUBBLE "$1"
  ${NSD_CreateText} 70u 62u 160u 13u "$P2DS_SavePath"
  Pop $P2DS_Ctl2
  SendMessage $P2DS_Ctl2 ${EM_SETREADONLY} 1 0
  !insertmacro P2DS_TR $1 "Parcourir..." "Browse..."
  ${NSD_CreateButton} 234u 61u 58u 15u "$1"
  Pop $P2DS_Ctl3
  ${NSD_OnClick} $P2DS_Ctl3 P2DS_Browse
  !insertmacro P2DS_TR $1 "Pas de sauvegarde ? Laisse vide : tu commenceras une nouvelle partie." "No save? Leave it empty: you will start a new game."
  ${NSD_CreateLabel} 70u 84u 222u 20u "$1"
  Pop $P2DS_Ctl
  SetCtlColors $P2DS_Ctl "${P2DS_TEXT}" "${P2DS_BG}"
  nsDialogs::Show
FunctionEnd

Function P2DS_Browse
  nsDialogs::SelectFileDialog open "" "P2DS (*.p2ds;*.txt)|*.p2ds;*.txt|*.*|*.*"
  Pop $0
  ${If} $0 != ""
    StrCpy $P2DS_SavePath "$0"
    ${NSD_SetText} $P2DS_Ctl2 "$0"
  ${EndIf}
FunctionEnd

Function P2DS_PageSaveLeave
FunctionEnd

; ---------- 3. Le compte ----------
Function P2DS_PageAccount
  Call P2DS_SkipIfUpdate
  !insertmacro P2DS_TR $1 "Ton compte" "Your account"
  !insertmacro MUI_HEADER_TEXT "Bob" "$1"
  Call P2DS_PageStart
  !insertmacro P2DS_TR $1 "Un compte, c'est facultatif : il garde tes parties en ligne et les synchronise." "An account is optional: it keeps your games online and syncs them."
  !insertmacro P2DS_BUBBLE "$1"
  !insertmacro P2DS_TR $1 "Pas de compte pour l'instant" "No account for now"
  ${NSD_CreateFirstRadioButton} 70u 46u 222u 11u "$1"
  Pop $P2DS_Ctl2
  SetCtlColors $P2DS_Ctl2 "${P2DS_TEXT}" "${P2DS_BG}"
  !insertmacro P2DS_TR $1 "Me connecter (dans le jeu)" "Sign in (in the game)"
  ${NSD_CreateAdditionalRadioButton} 70u 58u 222u 11u "$1"
  Pop $P2DS_Ctl3
  SetCtlColors $P2DS_Ctl3 "${P2DS_TEXT}" "${P2DS_BG}"
  !insertmacro P2DS_TR $1 "M'inscrire (ouvre le site web)" "Sign up (opens the website)"
  ${NSD_CreateAdditionalRadioButton} 70u 70u 222u 11u "$1"
  Pop $P2DS_Ctl
  SetCtlColors $P2DS_Ctl "${P2DS_TEXT}" "${P2DS_BG}"
  ${NSD_SetState} $P2DS_Ctl2 ${BST_CHECKED}
  !insertmacro P2DS_TR $1 "Sans compte, tes parties restent dans l'appli : si tu la désinstalles, tu les perds, sauf si tu les exportes. (Dans un navigateur, elles restent dans ce navigateur : si tu en changes, tu ne les retrouves pas.)" "Without an account, your games stay in the app: if you uninstall it, you lose them unless you export them. (In a browser, they stay in that browser: if you switch browsers, you won't find them.)"
  ${NSD_CreateLabel} 70u 88u 222u 40u "$1"
  Pop $P2DS_Img
  SetCtlColors $P2DS_Img "${P2DS_TEXT}" "${P2DS_BG}"
  nsDialogs::Show
FunctionEnd

Function P2DS_PageAccountLeave
  ${NSD_GetState} $P2DS_Ctl3 $0
  ${NSD_GetState} $P2DS_Ctl $1
  ${If} $0 == ${BST_CHECKED}
    StrCpy $P2DS_Account "login"
  ${ElseIf} $1 == ${BST_CHECKED}
    StrCpy $P2DS_Account "register"
  ${Else}
    StrCpy $P2DS_Account "none"
  ${EndIf}
FunctionEnd

Page custom P2DS_PageLang P2DS_PageLangLeave
Page custom P2DS_PageSave P2DS_PageSaveLeave
Page custom P2DS_PageAccount P2DS_PageAccountLeave

; ---------- A la fin de l'installation : init_config.json ----------
!macro NSIS_HOOK_POSTINSTALL
  ${If} $P2DS_Done == "1"
    SetShellVarContext current
    CreateDirectory "$APPDATA\${P2DS_BUNDLE}"
    ${StrRep} $R0 "$P2DS_SavePath" "\" "\\"
    ${If} $P2DS_Account == ""
      StrCpy $P2DS_Account "none"
    ${EndIf}
    FileOpen $R1 "$APPDATA\${P2DS_BUNDLE}\init_config.json" w
    FileWrite $R1 '{$\r$\n  "lang": "$P2DS_LangCode",$\r$\n  "account": "$P2DS_Account",$\r$\n  "save_file": "$R0"$\r$\n}$\r$\n'
    FileClose $R1
  ${EndIf}
!macroend
