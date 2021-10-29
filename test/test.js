const assert = require('assert')
const {parse} = require("@sabaki/sgf");
const Board = require("@sabaki/go-board");
const collect = require('collect.js');

const content = [
    // "(;\n" +
    // "GM[1]FF[4]SZ[19];\n" +
    // "B[dp];\n" +
    // "W[fq](;B[cn];W[dq];B[cq];W[cr];B[eq];W[dr](;B[ep];W[er](;B[bq](;W[fp])(;W[hq]))(;B[fp];W[gq]))(;B[fp];W[er];B[ep];W[gq])(;B[er](;W[ep];B[fr];W[cp];B[do];W[bp];B[gq])(;W[cp];B[ep];W[co](;B[dn])(;B[do];W[bq];B[bo];W[bp](;B[dm])(;B[dn])))))(;B[hq];W[cq];B[dq];W[cp];B[do];W[dr];B[er];W[cr];B[fr];W[cn]))"

"(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]\n" +
"RU[Japanese]SZ[19]KM[0.00]\n" +
"PW[Белые]PB[Черные]\n" +
";B[bb]\n" +
"(;W[bc]\n" +
";B[cc]\n" +
";W[cb])\n" +
"(;W[cc]\n" +
";B[cb]\n" +
"(;W[ec])\n" +
"(;W[db])))\n"
];

function traverse(node, fn)
{
    let children = node.children;
    if(!children) return;

    for(let child of children) {
        fn(child, node);
        traverse(child, fn);
    }
}

function searchBranches(cnt)
{
    let josekis = []; // каждая джосеки - это последовательность ходов Ч-Б-Ч-Б..., где каждый ход это объект {x,y}

    let childToParentMap = new Map();

    for(let i = 0; i < cnt.length; ++i) {

        let nodes = parse(cnt[i]);

        // посетить все узлы и составить карту (ребёнок->родитель)
        for(let ni = 0; ni < nodes.length; ++ni) {
            traverse(nodes[ni], (child,parent)=>{childToParentMap.set(child,parent)});
        }

        // найти все листовые узлы - то есть такие, у которых нет детей
        let leaves = collect(Array.from(childToParentMap.keys()))
            .except(Array.from(childToParentMap.values()))
            .toArray();

        // для каждого листового узла пройтись до верха и построить путь
        let paths = [];
        for(let leaf of leaves) {
            let path = [];
            while (leaf) {
                path.push(leaf);
                leaf = childToParentMap.get(leaf);
            }
            path.reverse();
            paths.push(path);
        }

        paths.toString();


    }

    return josekis;
}

/**
 * Декодируем координаты из формата SGF в одномерный массив из 2х чисел [x,y]
 * @param crd - координаты в формате SGF. Например: "dg"
 * @returns {number[]}
 */
function decodeCrdFromSgf(crd) {
    crd = crd.toString();
    if (crd.length !== 2) throw "crd format is not SGF";
    let y = crd.charCodeAt(0) - a_char_code;
    let x = crd.charCodeAt(1) - a_char_code;
    return [x, y];
}

/**
 * Извлекаем координаты из узла SGF
 * @param pointer - pointer to SGF node
 * @returns {undefined|string}
 */
function pointerToCrd(pointer) {

    let b = pointer.data.B;
    if (b !== undefined) {
        return b;
    }

    let w = pointer.data.W;
    if (w !== undefined) {
        return w;
    }

    return undefined;
}

/**
 * Конвертируем список SGF узлов в массив ходов
 * @param nodes узлы SGF
 * @returns {number[][]} - последовательность ходов
 */
function sgfToSteps(nodes) {
    let steps = []
    let pointer = nodes[0];
    while (pointer !== undefined) {
        let crd = pointerToCrd(pointer);

        if (crd !== undefined) {
            crd = decodeCrdFromSgf(crd);
            steps.push(crd);
        }

        if (pointer.children !== undefined) {
            pointer = pointer.children[0];
        } else {
            pointer = undefined;
        }
    }

    return steps;
}


it('парсинг дерева SGF', () => {
    let x = searchBranches(content);
    assert.equal(x !== null && x !== undefined,true);
});
