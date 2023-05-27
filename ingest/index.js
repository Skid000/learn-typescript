const fs = require('fs').promises;
const gen = "gen2_"
function getNum(e) {
    return parseInt(e.replace(gen, '').replace('.json', ''));
}
const dataset = {
    datasets: []
};
(async () => {
    let files = await fs.readdir('../', 'utf-8'), dataPoints = [[], [], [], []];
    files = files.filter((e) => new RegExp(`${gen}[0-9]+\\.json`).test(e));
    files.sort((a, b) => {
        a = getNum(a), b = getNum(b);
        return a - b;
    });
    for (let t of files) {
        let data = JSON.parse(await fs.readFile(`../${t}`, 'utf-8')), x = getNum(t) + 1, a = 0;
        data.forEach(element => {
            dataPoints[3].push({ x: x, y: element.fitness });
            a += element.fitness;
        });
        a /= data.length;
        dataPoints[0].push({ x: x, y: data.at(-1).fitness });
        dataPoints[1].push({
            x: x,
            y: data[0].fitness
        });
        dataPoints[2].push({
            x: x,
            y: a
        })
    }
    dataset.datasets = [
        {
            label: "Lowest Score",
            data: dataPoints[0]
        },
        {
            label: "Highest Score",
            data: dataPoints[1]
        },
        {
            label: "Avg Score",
            data: dataPoints[2]
        },
        {
            label: "All Points",
            data: dataPoints[3]
        }
    ];
    await fs.writeFile('compiledData5.json', JSON.stringify(dataset));
})();
