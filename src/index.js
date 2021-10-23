import './style';
import './goban.css'
import {Component, render} from "preact";
import {Goban} from "@sabaki/shudan";

const sgf = require('@sabaki/sgf')


const {h} = require('preact')
const Board = require('@sabaki/go-board')

// карта для финальной позиции
let finalBoard = new Board([...Array(19)].map(() => Array(19).fill(0)));

// карта для текущих ходов
let currentBoard = new Board([...Array(19)].map(() => Array(19).fill(0)));

// просто пример джосеки
const content = "(;GM[1]FF[4]\n" +
    "SZ[19]\n" +
    ";B[dc]\n" +
    ";W[de]\n" +
    ";B[ce]\n" +
    ";W[cf]\n" +
    ";B[cd]\n" +
    ";W[df]\n" +
    ";B[fc]\n" +
    ";W[dj])\n";

const rootNodes = sgf.parse(content)
rootNodes.toString();
let steps = []
let pointer = rootNodes[0];

const a_char_code = 'a'.charCodeAt(0);

function decodeCrdFromSgf(crd) {
    crd = crd.toString();
    if (crd.length !== 2) throw "crd format is not SGF";
    let y = crd.charCodeAt(0) - a_char_code;
    let x = crd.charCodeAt(1) - a_char_code;
    return [x, y];
}

while (pointer !== undefined) {
    let crd;
    if (pointer.data.B !== undefined) {
        crd = pointer.data.B;
    } else if (pointer.data.W !== undefined) {
        crd = pointer.data.W;
    }

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

let index = 0;
let sign = 1;

// проигрываем ходы джосеке. первые три на текущей доске, все - на финальной
for(let i = 0; i < steps.length; ++i) {
    if(i < 3) {
        currentBoard = currentBoard.makeMove(sign, steps[i]);
        index++;
    }
    finalBoard = finalBoard.makeMove(sign, steps[i]);
    sign = -sign;
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vertexSize: 32,
            showCorner: true,
            index, // index of next pressed stone
            sign: -1, // color of the next stone (1 - black, -1 - white)
            finalBoard,
            currentBoard,
        }
    }

    render() {
        let {
            vertexSize,
            showCorner,
            index,
            sign
        } = this.state

        return h(
            "div",
            null,
            h(
                'div',
                {style: "margin:21px; font-size:large"},
                "Попытайся восстановить последовательность этого розыгрыша."
            ),
            h(
                'div',
                {},
                // тут играем
                h(Goban, {
                    innerProps: {
                        onContextMenu: evt => evt.preventDefault()
                    },
                    vertexSize,
                    rangeX: showCorner ? [0, 10] : undefined,
                    rangeY: showCorner ? [0, 10] : undefined,

                    signMap: this.state.currentBoard.signMap,
                    showCoordinates: true,
                    onVertexMouseUp: (evt, [x, y]) => {
                        if (steps[index][0] === x &&
                            steps[index][1] === y) {
                            // correct answer
                            index++;
                            this.setState({
                                currentBoard: this.state.currentBoard.makeMove(sign, [x, y]),
                                index,
                                sign: -sign
                            })
                            if (index === steps.length) {
                                setTimeout(() => {
                                    alert("done!");
                                }, 300);
                            }
                        } else {
                            alert("incorrect");
                            this.setState({
                                currentBoard,
                                index: 3,
                                sign:-1
                            })
                        }
                    }
                }),
                // тут просто показываем последнюю позицию
                h(Goban, {
                    innerProps: {
                        onContextMenu: evt => evt.preventDefault()
                    },
                    vertexSize,
                    rangeX: showCorner ? [0, 10] : undefined,
                    rangeY: showCorner ? [0, 10] : undefined,
                    signMap: this.state.finalBoard.signMap,
                    showCoordinates: true,
                })
            )
        )
    }
}

render(<App />, document.body);