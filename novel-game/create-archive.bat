@echo off
chcp 65001 >nul
echo 🎮 ノベルゲーム シナリオアーカイブ作成
echo ================================
echo.

echo 📋 利用可能なオプション:
echo 1. インタラクティブ版（ディレクトリを選択）
echo 2. 簡易版（設定済みディレクトリを使用）
echo.

set /p choice="どちらを実行しますか？ (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo 🚀 インタラクティブ版を実行します...
    node create-scenario-zip.js
) else if "%choice%"=="2" (
    echo.
    echo 🚀 簡易版を実行します...
    node simple-archive.js
) else (
    echo ❌ 無効な選択です。1 または 2 を入力してください。
    pause
    goto :eof
)

echo.
echo ✅ 処理が完了しました。
pause
