const {parse} = require("@sabaki/sgf");
const Board = require("@sabaki/go-board");

const a_char_code = 'a'.charCodeAt(0);

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

/**
 * Инициализируем состояние по содержимому джосеки
 * @param joseki_content текст джосеки на языке SGF
 * @returns {{finalBoard: GoBoard, sign: number, index: number, steps: number[][], currentBoard: GoBoard}}
 */
export function initializeJoseki(joseki_content) {
    const rootNodes = parse(joseki_content)
    const steps = sgfToSteps(rootNodes);

    let index = 0;
    let sign = 1;

    // карта для финальной позиции
    let finalBoard = new Board([...Array(19)].map(() => Array(19).fill(0)));

    // карта для текущих ходов
    let currentBoard = new Board([...Array(19)].map(() => Array(19).fill(0)));

    for(let i = 0; i < steps.length; ++i) {
        if(i < 3) {
            currentBoard = currentBoard.makeMove(sign, steps[i]);
            index++;
        }
        finalBoard = finalBoard.makeMove(sign, steps[i]);
        sign = -sign;
    }

    return {steps, index, sign, currentBoard, finalBoard};
}
