const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const readline = require('readline');

// 利用可能なディレクトリのリスト
const availableDirectories = [
    'scenarios',
    'characters',
    'plots',
    'settings',
    'organizations',
    'cities',
    'cases',
    'events',
    'tips'
];

// コマンドライン入力インターフェース
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ディレクトリが存在するかチェック
function directoryExists(dirPath) {
    try {
        return fs.statSync(dirPath).isDirectory();
    } catch (err) {
        return false;
    }
}

// 簡易的なZIPファイル作成（テキストファイル用）
function createSimpleZip(selectedDirs, outputFilename) {
    return new Promise((resolve, reject) => {
        try {
            const zipContent = [];
            let totalFiles = 0;

            // 選択されたディレクトリのファイルを収集
            selectedDirs.forEach(dir => {
                const dirPath = path.join(__dirname, dir);
                console.log(`\n📁 ${dir} ディレクトリを処理中...`);
                collectFiles(dirPath, dir, zipContent);
            });

            // ファイル数をカウント
            totalFiles = zipContent.length;

            // TARファイル形式で保存（簡易実装）
            const tarFilename = outputFilename.replace('.zip', '.tar');
            createTarFile(zipContent, tarFilename);

            console.log(`\n✅ アーカイブファイルが作成されました: ${tarFilename}`);
            console.log(`📦 含まれるファイル数: ${totalFiles} ファイル`);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// ファイルを収集
function collectFiles(dirPath, relativeDirPath, zipContent) {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const relativePath = path.join(relativeDirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            collectFiles(fullPath, relativePath, zipContent);
        } else {
            const content = fs.readFileSync(fullPath, 'utf8');
            zipContent.push({
                path: relativePath.replace(/\\/g, '/'), // Unix形式のパスに統一
                content: content,
                size: stat.size
            });
            console.log(`追加: ${relativePath}`);
        }
    });
}

// 簡易TAR形式でファイルを作成
function createTarFile(files, filename) {
    let tarContent = '';
    
    files.forEach(file => {
        // ファイルヘッダー情報
        tarContent += `=== ${file.path} ===\n`;
        tarContent += `Size: ${file.size} bytes\n`;
        tarContent += `Content:\n`;
        tarContent += file.content;
        tarContent += '\n\n=== END OF FILE ===\n\n';
    });

    fs.writeFileSync(filename, tarContent, 'utf8');
}

// ディレクトリ選択画面を表示
function showDirectorySelection() {
    console.log('\n🎮 ノベルゲーム シナリオ アーカイブ作成ツール');
    console.log('==========================================\n');
    
    console.log('📂 利用可能なディレクトリ:');
    availableDirectories.forEach((dir, index) => {
        const exists = directoryExists(path.join(__dirname, dir));
        const status = exists ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${dir}`);
    });
    
    console.log('\n📝 使用方法:');
    console.log('- 数字をカンマ区切りで入力 (例: 1,2,3)');
    console.log('- 全て選択する場合は "all" と入力');
    console.log('- 終了する場合は "exit" と入力\n');
}

// ユーザー入力を処理
function getUserSelection() {
    return new Promise((resolve) => {
        rl.question('🔢 作成したいディレクトリの番号を入力してください: ', (answer) => {
            if (answer.toLowerCase() === 'exit') {
                console.log('👋 終了します。');
                rl.close();
                process.exit(0);
            }
            
            if (answer.toLowerCase() === 'all') {
                const existingDirs = availableDirectories.filter(dir => 
                    directoryExists(path.join(__dirname, dir))
                );
                resolve(existingDirs);
                return;
            }
            
            const indices = answer.split(',').map(num => parseInt(num.trim()) - 1);
            const selectedDirs = indices
                .filter(index => index >= 0 && index < availableDirectories.length)
                .map(index => availableDirectories[index])
                .filter(dir => directoryExists(path.join(__dirname, dir)));
            
            if (selectedDirs.length === 0) {
                console.log('❌ 有効なディレクトリが選択されませんでした。もう一度入力してください。');
                resolve(getUserSelection());
            } else {
                resolve(selectedDirs);
            }
        });
    });
}

// 出力ファイル名を取得
function getOutputFilename(selectedDirs) {
    return new Promise((resolve) => {
        const defaultName = `novel-game-scenario-${new Date().toISOString().slice(0, 10)}.tar`;
        
        rl.question(`📦 出力ファイル名を入力してください (デフォルト: ${defaultName}): `, (answer) => {
            const filename = answer.trim() || defaultName;
            const finalFilename = filename.endsWith('.tar') ? filename : filename + '.tar';
            resolve(finalFilename);
        });
    });
}

// メイン処理
async function main() {
    try {
        showDirectorySelection();
        
        const selectedDirs = await getUserSelection();
        console.log(`\n✨ 選択されたディレクトリ: ${selectedDirs.join(', ')}`);
        
        const outputFilename = await getOutputFilename(selectedDirs);
        
        console.log(`\n🚀 アーカイブ作成を開始します...`);
        await createSimpleZip(selectedDirs, outputFilename);
        
        console.log(`\n🎉 完了しました！`);
        console.log(`📍 出力先: ${path.resolve(outputFilename)}`);
        
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
    } finally {
        rl.close();
    }
}

// スクリプト実行
if (require.main === module) {
    main();
}

module.exports = { createSimpleZip, collectFiles };
