const fs = require('fs');
const path = require('path');

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

console.log('🎮 ノベルゲーム シナリオ 簡易アーカイブ作成ツール');
console.log('===============================================\n');

// 利用可能なディレクトリを表示
console.log('📂 利用可能なディレクトリ:');
availableDirectories.forEach((dir, index) => {
    const dirPath = path.join(__dirname, dir);
    const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    const status = exists ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${dir}`);
});

console.log('\n📝 このスクリプトの使用方法:');
console.log('1. 下記の selectedDirectories 配列を編集してください');
console.log('2. 含めたいディレクトリ名を配列に追加してください');
console.log('3. ファイルを保存してから node simple-archive.js で実行してください\n');

// ========================================
// 🔧 設定: ここを編集してください
// ========================================
const selectedDirectories = [
    'scenarios',     // シナリオファイル
    'characters',    // キャラクター設定
    'plots'          // プロット
    // 必要に応じて追加してください:
    // 'settings',
    // 'organizations', 
    // 'cities',
    // 'cases',
    // 'events',
    // 'tips'
];

const outputFilename = `novel-game-${new Date().toISOString().slice(0, 10)}.txt`;
// ========================================

function createArchive() {
    let archiveContent = '';
    let totalFiles = 0;

    archiveContent += '='.repeat(60) + '\n';
    archiveContent += `ノベルゲーム シナリオアーカイブ\n`;
    archiveContent += `作成日時: ${new Date().toLocaleString('ja-JP')}\n`;
    archiveContent += '='.repeat(60) + '\n\n';

    console.log('🚀 アーカイブ作成を開始します...\n');

    selectedDirectories.forEach(dir => {
        const dirPath = path.join(__dirname, dir);
        
        if (!fs.existsSync(dirPath)) {
            console.log(`⚠️  ${dir} ディレクトリが見つかりません。スキップします。`);
            return;
        }

        console.log(`📁 ${dir} を処理中...`);
        
        archiveContent += `\n${'='.repeat(50)}\n`;
        archiveContent += `📁 ディレクトリ: ${dir}\n`;
        archiveContent += `${'='.repeat(50)}\n\n`;

        const files = collectFilesFromDirectory(dirPath, dir);
        files.forEach(file => {
            archiveContent += `${'─'.repeat(40)}\n`;
            archiveContent += `📄 ファイル: ${file.relativePath}\n`;
            archiveContent += `📏 サイズ: ${file.size} bytes\n`;
            archiveContent += `${'─'.repeat(40)}\n`;
            archiveContent += file.content;
            archiveContent += '\n\n';
            totalFiles++;
            console.log(`  ✅ ${file.relativePath}`);
        });
    });

    // アーカイブファイルを保存
    fs.writeFileSync(outputFilename, archiveContent, 'utf8');

    console.log(`\n🎉 アーカイブ作成完了！`);
    console.log(`📦 出力ファイル: ${outputFilename}`);
    console.log(`📊 含まれるファイル数: ${totalFiles} ファイル`);
    console.log(`📍 保存先: ${path.resolve(outputFilename)}`);
}

function collectFilesFromDirectory(dirPath, relativeDirPath) {
    const files = [];
    
    function walkDirectory(currentPath, currentRelativePath) {
        const items = fs.readdirSync(currentPath);
        
        items.forEach(item => {
            const fullPath = path.join(currentPath, item);
            const relativePath = path.join(currentRelativePath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                walkDirectory(fullPath, relativePath);
            } else {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    files.push({
                        relativePath: relativePath.replace(/\\/g, '/'),
                        content: content,
                        size: stat.size
                    });
                } catch (error) {
                    console.log(`  ⚠️  ${relativePath} の読み込みに失敗: ${error.message}`);
                }
            }
        });
    }
    
    walkDirectory(dirPath, relativeDirPath);
    return files;
}

// スクリプト実行
try {
    createArchive();
} catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
}
