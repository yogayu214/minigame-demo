const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'minigame');
const DIST = path.join(ROOT, 'dist');

// 需要原样复制的静态资源（相对于 minigame/ 目录）
const STATIC_PATTERNS = [
  'game.json',
  'images',
  'workers',
  'open-data-context',
  'js/vendor',
  'js/api/render/loadFont/assets',
  'js/api/file/unzip/assets',
  'js/api/game-recorder/getGameRecorder/bgm.mp3',
];

/**
 * 递归复制目录/文件
 */
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 1. 清理 dist
console.log('🗑  Cleaning dist/...');
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

// 2. TypeScript 编译 → dist/
console.log('🔨 Compiling TypeScript...');
try {
  execSync(`npx tsc --outDir "${DIST}"`, { cwd: ROOT, stdio: 'inherit' });
} catch {
  // tsc 有类型错误但仍会输出 .js，继续执行
  console.log('⚠️  TypeScript reported errors (output still generated)');
}

// 3. 复制静态资源
console.log('📦 Copying static assets...');
for (const pattern of STATIC_PATTERNS) {
  const src = path.join(SRC, pattern);
  const dest = path.join(DIST, pattern);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log(`   ✓ ${pattern}`);
  } else {
    console.log(`   ⚠ ${pattern} (not found, skipped)`);
  }
}

console.log('✅ Build complete → dist/');
