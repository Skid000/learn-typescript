const fs = require('fs').promises;
function getNum(e) {
    return parseInt(e.replace('gen_', '').replace('.json', ''));
}
(async () => {
    let files = await fs.readdir('../', 'utf-8');
    files = files.filter((e) => /gen_[0-9]+\.json/.test(e));
    files.sort((a, b) => {
        a = getNum(a), b = getNum(b);
        return a - b;
    });
    console.log(files);
})();
