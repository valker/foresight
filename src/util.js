import collect from "collect.js";

const {parse} = require("@sabaki/sgf");
const Board = require("@sabaki/go-board");

function traverse(node, fn)
{
    let children = node.children;
    if(!children) return;

    for(let child of children) {
        fn(child, node);
        traverse(child, fn);
    }
}

export function searchBranches(cnt, firstMoves)
{
    let josekis = []; // каждая джосеки - это последовательность ходов Ч-Б-Ч-Б..., где каждый ход это объект {x,y}

    for(let i = 0; i < cnt.length; ++i) {

        let childToParentMap = new Map();

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
        for(let leaf of leaves) {
            let path = [];
            while (leaf) {
                path.push(leaf);
                leaf = childToParentMap.get(leaf);
            }

            path.reverse();

            let joseki = sgfToSteps(path);
            joseki.firstMoves = firstMoves;

            josekis.push(joseki);
        }
    }

    return josekis;
}

const a_char_code = 'a'.charCodeAt(0);

/**
 * Декодируем координаты из формата SGF в одномерный массив из 2х чисел [x,y]
 * @param crd - координаты в формате SGF. Например: "dg"
 * @returns {number[]}
 */
function decodeCrdFromSgf(crd) {
    crd = crd.toString();
    if (crd.length !== 2) return []; // пустой массив означает пас
    let x = crd.charCodeAt(0) - a_char_code;
    let y = /*18 -*/ (crd.charCodeAt(1) - a_char_code);
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

    for(let node of nodes) {
        let crd = pointerToCrd(node);

        if (crd !== undefined) {
            crd = decodeCrdFromSgf(crd);
            steps.push(crd);
        }
    }

    return steps;
}

/**
 * Инициализируем состояние по содержимому джосеки
 * @param joseki_content текст джосеки на языке SGF
 * @returns {{finalBoard: GoBoard, sign: number, index: number, steps: number[][], currentBoard: GoBoard}}
 */
export function initializeJoseki(joseki_content) {
    const steps = joseki_content;

    let index = 0;
    let sign = 1;

    let firstMoves = joseki_content.firstMoves;

    // карта для финальной позиции
    let finalBoard = new Board([...Array(19)].map(() => Array(19).fill(0)));

    // карта для текущих ходов
    let currentBoard = new Board([...Array(19)].map(() => Array(19).fill(0)));

    for(let i = 0; i < steps.length; ++i) {
        if(i < firstMoves) {
            currentBoard = currentBoard.makeMove(sign, steps[i]);
            index++;
        }
        finalBoard = finalBoard.makeMove(sign, steps[i]);
        sign = -sign;
    }

    // карта отметок для текущих ходов
    let currentBoardMarks = [...Array(19)].map(() => Array(19));
    currentBoardMarks[steps[firstMoves-1][1]][steps[firstMoves-1][0]] = {type:'circle'};

    sign = firstMoves % 2 === 0 ? 1 : -1;

    return {
        steps, // последовательность координат розыгрыша
        index, // индекс в последовательности, указывающий на следующий ход
        currentBoard, // доска где восстанавливаем розыгрыш
        finalBoard,   // доска, где видна финальная позиция розыгрыша
        currentBoardMarks, // отметка последнего хода кружком
        firstMoves, // сколько ходов сделано в начальной позиции
        sign
    };
}
