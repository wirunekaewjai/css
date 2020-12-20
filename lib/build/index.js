"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = __importDefault(require("chokidar"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const evaluator_1 = __importDefault(require("../utils/evaluator"));
const hashes_1 = __importDefault(require("../utils/hashes"));
const incremental_1 = __importDefault(require("../utils/incremental"));
const array_1 = __importDefault(require("../utils/array"));
let config;
let packages;
let watchers;
let incremental;
let hashes;
let entries;
let entryReverses;
let entryDependencies;
let globalStyles;
let globalStylePaths;
let localStyles;
function run(args) {
    function initPackages() {
        packages = [];
        if (!fs_1.default.existsSync('package.json')) {
            return;
        }
        const file = fs_1.default.readFileSync('package.json')?.toString('utf8');
        const json = JSON.parse(file);
        if (json.dependencies && typeof json.dependencies === 'object') {
            for (const pck of Object.keys(json.dependencies)) {
                packages.push(pck);
            }
        }
        if (json.devDependencies && typeof json.devDependencies === 'object') {
            for (const pck of Object.keys(json.devDependencies)) {
                packages.push(pck);
            }
        }
    }
    const configPath = args.config ?? 'wkcss.config.ts';
    if (!fs_1.default.existsSync(configPath)) {
        console.error('config file not founded');
        process.exit(1);
    }
    config = evaluator_1.default.getConst(configPath, 'default');
    if (!config) {
        console.error('invalid config');
        process.exit(1);
    }
    initPackages();
    if (args.watch) {
        function watchPackages() {
            const watcher = chokidar_1.default.watch('package.json');
            watcher.on('change', () => {
                initPackages();
            });
        }
        function watchConfig() {
            const watcher = chokidar_1.default.watch(configPath);
            watcher.on('add', () => {
                config = evaluator_1.default.getConst(configPath, 'default');
                if (!config) {
                    console.error('invalid config');
                    process.exit(1);
                }
                init();
                build();
                watch();
            });
            watcher.on('change', () => {
                config = evaluator_1.default.getConst(configPath, 'default');
                if (!config) {
                    console.error('invalid config');
                    process.exit(1);
                }
                init();
                watch();
            });
            watcher.on('unlink', () => {
                process.exit(1);
            });
        }
        watchPackages();
        watchConfig();
    }
    else {
        init();
        build();
    }
}
exports.default = run;
function init() {
    function initWatchers() {
        if (Array.isArray(watchers)) {
            for (const watcher of watchers) {
                watcher.close();
            }
        }
        watchers = [];
    }
    function initEntries() {
        entries = config.build.entries;
        entryReverses = {};
        entryDependencies = {};
        for (const entryName in entries) {
            const entryPaths = entries[entryName];
            for (const entryPath of entryPaths) {
                entryReverses[entryPath] = entryName;
                entryDependencies[entryPath] = [entryName];
            }
        }
    }
    initWatchers();
    initEntries();
    incremental = new incremental_1.default();
    hashes = new hashes_1.default();
    globalStyles = {};
    globalStylePaths = {};
    localStyles = {};
    collectEntriesDependencies();
    collectFiles();
}
function build() {
    buildModules();
    buildEntries();
}
function watch() {
    const pattern = path_1.default.join(config.source.directory, '/**/*');
    const watcher = chokidar_1.default.watch(pattern);
    watcher.on('add', (filePath) => {
        if (isModulePath(filePath)) {
            updateModuleFile(filePath);
        }
        else if (isEntryPath(filePath)) {
            updateEntryFile(filePath);
        }
        else if (isCodePath(filePath)) {
            updateCodeFile(filePath);
        }
    });
    watcher.on('change', (filePath) => {
        if (isModulePath(filePath)) {
            updateModuleFile(filePath);
        }
        else if (isEntryPath(filePath)) {
            updateEntryFile(filePath);
        }
        else if (isCodePath(filePath)) {
            updateCodeFile(filePath);
        }
    });
    watcher.on('unlink', (filePath) => {
        if (isModulePath(filePath)) {
            deleteModuleFile(filePath);
        }
        else if (isEntryPath(filePath)) {
            deleteEntryFile(filePath);
        }
        else if (isCodePath(filePath)) {
            deleteCodeFile(filePath);
        }
    });
    watchers.push(watcher);
}
function isModulePath(filePath) {
    return filePath.endsWith(config.module.input.extension);
}
function isEntryPath(filePath) {
    return entryReverses[filePath];
}
function isCodePath(filePath) {
    return filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx');
}
function collectFiles() {
    const pattern = path_1.default.join(config.source.directory, '/**/*');
    const paths = glob_1.default.sync(pattern);
    for (const filePath of paths) {
        if (isModulePath(filePath) || isEntryPath(filePath) || isCodePath(filePath)) {
            hashes.setChanged(filePath);
        }
    }
}
function collectEntriesDependencies() {
    for (const entryName in entries) {
        collectEntryDependencies(entryName);
    }
}
function collectEntryDependencies(entryName) {
    const entryPaths = entries[entryName];
    for (const entryPath of entryPaths) {
        const dependencyPaths = evaluator_1.default.getBundles(entryPath, packages);
        for (const dependencyPath of dependencyPaths) {
            if (!entryDependencies[dependencyPath]) {
                entryDependencies[dependencyPath] = [];
            }
            entryDependencies[dependencyPath].push(entryName);
        }
    }
}
function releaseEntryDependencies(entryName) {
    for (const filePath in entryDependencies) {
        entryDependencies[filePath] = entryDependencies[filePath].filter(e => e !== entryName);
        if (entryDependencies[filePath].length === 0) {
            delete entryDependencies[filePath];
        }
    }
}
function updateEntryFile(filePath) {
    if (!hashes.hasChanged(filePath)) {
        return;
    }
    hashes.setChanged(filePath);
    const entryName = entryReverses[filePath];
    releaseEntryDependencies(entryName);
    collectEntryDependencies(entryName);
    buildEntry(entryName);
}
function deleteEntryFile(filePath) {
    hashes.setChanged(filePath);
    const entryName = entryReverses[filePath];
    releaseEntryDependencies(entryName);
    buildEntry(entryName);
}
function updateCodeFile(filePath) {
    if (!hashes.hasChanged(filePath)) {
        return;
    }
    hashes.setChanged(filePath);
    if (entryDependencies[filePath]) {
        const entryNames = entryDependencies[filePath];
        for (const entryName of entryNames) {
            buildEntry(entryName);
        }
    }
}
function deleteCodeFile(filePath) {
    hashes.setChanged(filePath);
    if (entryDependencies[filePath]) {
        const entryNames = entryDependencies[filePath];
        delete entryDependencies[filePath];
        for (const entryName of entryNames) {
            buildEntry(entryName);
        }
    }
}
function updateModuleFile(filePath) {
    if (!hashes.hasChanged(filePath)) {
        return;
    }
    hashes.setChanged(filePath);
    buildModule(filePath, true);
}
function deleteModuleFile(filePath) {
    hashes.setChanged(filePath);
    if (globalStylePaths[filePath]) {
        const entryName = globalStylePaths[filePath];
        delete globalStylePaths[filePath];
        console.log('[release]', filePath);
        if (globalStyles[entryName]) {
            delete globalStyles[entryName][filePath];
            if (entries[entryName]) {
                buildEntry(entryName);
            }
        }
    }
    else {
        const outPath = filePath.replace(config.module.input.extension, config.module.output.extension);
        if (fs_1.default.existsSync(outPath)) {
            fs_1.default.unlinkSync(outPath);
            console.log('[delete]', outPath);
        }
        delete localStyles[outPath];
    }
}
function buildModules() {
    const modulePattern = path_1.default.join(config.source.directory, '/**/*' + config.module.input.extension);
    const modulePaths = glob_1.default.sync(modulePattern);
    for (const modulePath of modulePaths) {
        buildModule(modulePath, false);
    }
}
function buildModule(filePath, shouldRebuildEntry) {
    function readFromScript() {
        const entry = evaluator_1.default.getConst(filePath, 'entry');
        const src = evaluator_1.default.getConst(filePath, 'default');
        return {
            entry,
            default: src,
        };
    }
    const data = readFromScript();
    if (typeof data.entry === 'string' && data.entry?.length > 0) {
        const { styles } = parseGlobalStyle(data.default);
        const entryName = data.entry;
        ;
        if (!globalStyles[entryName]) {
            globalStyles[entryName] = {};
        }
        globalStyles[entryName][filePath] = styles;
        globalStylePaths[filePath] = entryName;
        console.log('[collect]', filePath);
        if (entries[entryName] && shouldRebuildEntry) {
            buildEntry(entryName);
        }
    }
    else {
        const { modules, styles } = parseLocalStyle(data.default);
        const outPath = filePath.replace(config.module.input.extension, config.module.output.extension);
        const outData = `const names = ${JSON.stringify(modules, null, 2)};\n\nexport default names;`;
        if (!fs_1.default.existsSync(outPath)) {
            console.log('[create]', outPath);
        }
        else {
            console.log('[update]', outPath);
        }
        fs_1.default.writeFileSync(outPath, outData);
        localStyles[outPath] = styles;
    }
}
function buildEntries() {
    for (const entryName in entries) {
        buildEntry(entryName);
    }
}
function buildEntry(entryName) {
    const entryStyles = [];
    if (globalStyles[entryName]) {
        for (const filePath in globalStyles[entryName]) {
            entryStyles.push(globalStyles[entryName][filePath]);
        }
    }
    for (const filePath in entryDependencies) {
        if (entryDependencies[filePath].includes(entryName)) {
            if (localStyles[filePath]) {
                entryStyles.push(localStyles[filePath]);
            }
        }
    }
    const entryStyle = mergeStyles(entryStyles);
    const entryCSS = buildStyles(entryStyle);
    fs_extra_1.default.mkdirpSync(config.build.directory);
    const outPath = path_1.default.join(config.build.directory, entryName + '.css');
    const outData = entryCSS;
    if (!fs_1.default.existsSync(outPath)) {
        console.log('[create]', outPath);
    }
    else {
        const oldData = fs_1.default.readFileSync(outPath).toString('utf8');
        if (oldData === outData) {
            return;
        }
        console.log('[update]', outPath);
    }
    fs_1.default.writeFileSync(outPath, outData);
}
function buildStyles(styles) {
    function getSpace(indent) {
        return ''.padStart(indent, ' ');
    }
    function getIndex(token) {
        if (token.startsWith('*')) {
            return 1;
        }
        else if (token.startsWith(':root')) {
            return 2;
        }
        else if (token.startsWith('@page')) {
            return 3;
        }
        else if (token.startsWith('html')) {
            return 4;
        }
        else if (token.startsWith('body')) {
            return 5;
        }
        else if (token.startsWith(':')) {
            return 7;
        }
        else if (token.startsWith('[')) {
            return 8;
        }
        else if (token.startsWith('.')) {
            return 9;
        }
        else if (token.startsWith('#')) {
            return 10;
        }
        else if (token.startsWith('@media')) {
            return 11;
        }
        else if (token.startsWith('@supports')) {
            return 12;
        }
        return 6;
    }
    function sort(css) {
        return css.sort((a, b) => {
            const ai = getIndex(a);
            const bi = getIndex(b);
            if (ai !== bi) {
                return ai - bi;
            }
            return a.localeCompare(b);
        });
    }
    function buildStyle(src, indent) {
        const css = [];
        const space = getSpace(indent);
        for (const key in src) {
            if (key.startsWith('@supports') || key.startsWith('@media')) {
                const value = buildStyle(src[key], indent + 1);
                const token = `${space}${key} {\n${space} ${value}\n${space}}`;
                css.push(token);
            }
            else if (key.startsWith('@page')) {
                const values = src[key];
                const value = array_1.default.join(values, '; ');
                const token = `${space}${key} { ${value} }`;
                css.push(token);
            }
            else if (key.startsWith('@keyframes')) {
                const values = src[key];
                const value = array_1.default.join(values, ' ');
                const token = `${space}${key} { ${value} }`;
                css.push(token);
            }
            else {
                const selectors = src[key];
                const selector = array_1.default.join(sort(array_1.default.distinct(selectors)), ', ');
                const token = `${space}${selector} { ${key} }`;
                css.push(token);
            }
        }
        return array_1.default.join(sort(css), '\n');
    }
    return buildStyle(styles, 0);
}
function mergeStyles(entryStyles) {
    function mergeStyle(src, dst) {
        for (const key in src) {
            if (key.startsWith('@supports') || key.startsWith('@media')) {
                if (!dst[key]) {
                    dst[key] = {};
                }
                const srcStyles = src[key];
                const dstStyles = dst[key];
                mergeStyle(srcStyles, dstStyles);
            }
            else if (key.startsWith('@page')) {
                if (!dst[key]) {
                    dst[key] = [];
                }
                const srcProps = src[key];
                const dstProps = dst[key];
                for (const prop of srcProps) {
                    dstProps.push(prop);
                }
            }
            else {
                if (!dst[key]) {
                    dst[key] = [];
                }
                const srcSelectors = src[key];
                const dstSelectors = dst[key];
                for (const selector of srcSelectors) {
                    dstSelectors.push(selector);
                }
            }
        }
    }
    function mergeTag(src) {
        const merges = {};
        const dst = {};
        for (const key in src) {
            const val = src[key];
            if (key.startsWith('@')) {
                if (Array.isArray(val)) {
                    dst[key] = val;
                }
                else {
                    dst[key] = mergeTag(val);
                }
            }
            else {
                const vals = val;
                if (vals.length > 1) {
                    dst[key] = vals;
                }
                else if (vals.length === 1) {
                    if (vals[0].startsWith('.')) {
                        dst[key] = vals;
                    }
                    else {
                        if (!merges[vals[0]]) {
                            merges[vals[0]] = [];
                        }
                        merges[vals[0]].push(key);
                    }
                }
            }
        }
        for (const selector in merges) {
            const property = array_1.default.join(merges[selector], '; ');
            dst[property] = [selector];
        }
        return dst;
    }
    const dst1 = {};
    for (const src of entryStyles) {
        mergeStyle(src, dst1);
    }
    return mergeTag(dst1);
}
function parseGlobalStyle({ stylesheet }) {
    const styles = {};
    function createRule(src, dst) {
        for (const declaration of src.declarations) {
            if (declaration.type === 'comment') {
                continue;
            }
            const token = declaration.property + ': ' + declaration.value;
            if (!dst[token]) {
                dst[token] = [];
            }
            const selectors = dst[token];
            for (const selector of src.selectors) {
                selectors.push(selector);
            }
        }
    }
    function createKeyframes(src, dst) {
        const key = `@keyframes ${src.name}`;
        const tokens = [];
        for (const keyframe of src.keyframes) {
            if (keyframe.type === 'comment') {
                continue;
            }
            const properties = [];
            for (const declaration of keyframe.declarations) {
                if (declaration.type === 'comment') {
                    continue;
                }
                properties.push(declaration.property + ': ' + declaration.value);
            }
            const selector = array_1.default.join(keyframe.values, ', ');
            const property = array_1.default.join(properties, '; ');
            tokens.push(`${selector} { ${property} }`);
        }
        dst[key] = tokens;
    }
    function createPage(src, dst) {
        const selectors = src.selectors.length > 0 ? src.selectors.map(e => '@page' + e) : ['@page'];
        for (const selector of selectors) {
            if (!dst[selector]) {
                dst[selector] = [];
            }
            const props = dst[selector];
            for (const declaration of src.declarations) {
                if (declaration.type === 'comment') {
                    continue;
                }
                const token = declaration.property + ': ' + declaration.value;
                props.push(token);
            }
        }
    }
    function createMedia(src, dst) {
        const key = `@media ${src.media}`;
        if (!dst[key]) {
            dst[key] = {};
        }
        for (const rule of src.rules) {
            create(rule, dst[key]);
        }
    }
    function createSupports(src, dst) {
        const key = `@supports ${src.supports}`;
        if (!dst[key]) {
            dst[key] = {};
        }
        for (const rule of src.rules) {
            create(rule, dst[key]);
        }
    }
    function create(src, dst) {
        if (src.type === 'supports') {
            createSupports(src, dst);
        }
        else if (src.type === 'media') {
            createMedia(src, dst);
        }
        else if (src.type === 'page') {
            createPage(src, dst);
        }
        else if (src.type === 'keyframes') {
            createKeyframes(src, dst);
        }
        else if (src.type === 'rule') {
            createRule(src, dst);
        }
    }
    for (const rule of stylesheet.rules) {
        create(rule, styles);
    }
    return { styles };
}
function parseLocalStyle({ stylesheet }) {
    const styles = {};
    const modules = {};
    function createRule(src, dst, prefixes) {
        for (const declaration of src.declarations) {
            if (declaration.type === 'comment') {
                continue;
            }
            const token = declaration.property + ': ' + declaration.value;
            if (!dst[token]) {
                dst[token] = [];
            }
            const selectors = dst[token];
            for (const selector of src.selectors) {
                let module = '';
                let suffix = '';
                selector.replace(/module-[A-Za-z0-9-_]+/, (c, i) => {
                    module = c.slice(7);
                    suffix = selector.slice(i + c.length);
                    return c;
                });
                const key = array_1.default.join([...prefixes, declaration.property, declaration.value, suffix], '-');
                const id = incremental.get(key);
                if (!modules[module]) {
                    modules[module] = [];
                }
                modules[module].push(id);
                selectors.push('.' + id + suffix);
            }
        }
    }
    function createMedia(src, dst, prefixes) {
        const key = `@media ${src.media}`;
        if (!dst[key]) {
            dst[key] = {};
        }
        for (const rule of src.rules) {
            create(rule, dst[key], [...prefixes, src.media]);
        }
    }
    function createSupports(src, dst, prefixes) {
        const key = `@supports ${src.supports}`;
        if (!dst[key]) {
            dst[key] = {};
        }
        for (const rule of src.rules) {
            create(rule, dst[key], [...prefixes, src.supports]);
        }
    }
    function create(src, dst, prefixes) {
        if (src.type === 'supports') {
            createSupports(src, dst, prefixes);
        }
        else if (src.type === 'media') {
            createMedia(src, dst, prefixes);
        }
        else if (src.type === 'rule') {
            createRule(src, dst, prefixes);
        }
    }
    for (const rule of stylesheet.rules) {
        create(rule, styles, []);
    }
    const _modules = {};
    for (const module in modules) {
        _modules[module] = array_1.default.join(modules[module], ' ');
    }
    return {
        modules: _modules,
        styles,
    };
}
