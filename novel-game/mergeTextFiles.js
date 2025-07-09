// 指定したディレクトリ配下のテキストファイルを名前順に集約し、1つのファイルにまとめるスクリプト
// ディレクトリの指定は下記の配列で行います。必要に応じて編集してください。

const fs = require('fs');
const path = require('path');

// 集約対象ディレクトリ（必要に応じて追加・順序変更可）
const targetDirs = [
    'game-info',
    'settings',
    'cases',
    'characters',
    'cities',
    'events',
    'organizations',
    // 'plots',
    'scenarios',
    'tips',
    // 'novels',
    // 'prompts',
    // 'writers'
];

// ナチュラルソート用コレーター
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

// 出力ファイル名
const outputFile = 'merged_texts.txt';

// プロジェクトルート（このスクリプトのある場所を基準）
const rootDir = __dirname;

function getAllTextFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    // ディレクトリ・ファイル名をナチュラルソート
    list.sort((a, b) => collator.compare(a.name, b.name));
    for (const file of list) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(getAllTextFiles(filePath));
        } else if (file.isFile() && (file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
            results.push(filePath);
        }
    }
    return results;
}

function main() {
    let allFiles = [];
    for (const dir of targetDirs) {
        const absDir = path.join(rootDir, dir);
        if (fs.existsSync(absDir)) {
            // ファイルパスもナチュラルソート
            const files = getAllTextFiles(absDir).sort((a, b) => collator.compare(a, b));
            allFiles = allFiles.concat(files);
        }
    }

    let merged = '';
    for (const file of allFiles) {
        const relPath = path.relative(rootDir, file);
        merged += `--- ${relPath} ---\n`;
        merged += `ファイル名: ${path.basename(file)}\n`;
        merged += fs.readFileSync(file, 'utf8');
        merged += '\n\n';
    }
    fs.writeFileSync(path.join(rootDir, outputFile), merged, 'utf8');
    console.log(`集約完了: ${outputFile}`);
}

main();
