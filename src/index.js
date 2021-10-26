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

const a_char_code = 'a'.charCodeAt(0);


/**
 * Decodes coordinates from SGF format to 1D array of 2 numbers [x,y]
 * @param crd - coordinates in SGF format. For ex. "dg"
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
 * Extract coordinates from pointer to SGF node (if exists)
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
 * Converts SGF nodes to array of moves
 * @param nodes
 * @returns {number[][]} - sequence of moves
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

const steps = sgfToSteps(rootNodes);

let index = 0;
let sign = 1;

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
        return (
            <div>
                <div style={"margin:21px; font-size:large"}>Попытайся восстановить последовательность этого розыгрыша</div>
                <div>
                    <div style={"margin:10px"}>
                        <Goban
                            innerProps={oncontextmenu= evt=>evt.preventDefault()}
                            vertexSize={this.state.vertexSize}
                            rangeX={this.state.showCorner ? [0,10]:undefined }
                            rangeY={this.state.showCorner ? [0,10]:undefined }
                            signMap={this.state.currentBoard.signMap}
                            showCoordinates={true}
                            onVertexClick={ (evt, [x,y]) => {
                                let index = this.state.index;
                                if (steps[index][0] === x &&
                                    steps[index][1] === y) {
                                    // correct answer
                                    index++;
                                    const sign = this.state.sign;
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
                                        sign: -1
                                    })
                                }

                            }}
                        />
                    </div>
                    <div style={"margin:10px"}>
                        <Goban
                            innerProps={oncontextmenu = evt => evt.preventDefault()}
                            vertexSize={this.state.vertexSize}
                            rangeX={this.state.showCorner ? [0, 10] : undefined}
                            rangeY={this.state.showCorner ? [0, 10] : undefined}
                            signMap={this.state.finalBoard.signMap}
                            showCoordinates={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);