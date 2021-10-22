import './style';
import './goban.css'
import {Component, render} from "preact";
import {Goban} from "@sabaki/shudan";

const sgf = require('@sabaki/sgf')


const {h} = require('preact')
const Board = require('@sabaki/go-board')

const finalBoardSignMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, -1, -1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const markerMap = [...Array(19)].map(() => Array(19));

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
    return {x, y};
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

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vertexSize: 32,
            showCorner: true,
            index: 0, // index of next pressed stone
            board: new Board(finalBoardSignMap),
            markers: markerMap,
        }
    }

    render() {
        let {
            vertexSize,
            showCorner,
            index
        } = this.state
        // ,

        return h(
            "div",
            null,
            h(
                'div',
                {style: "margin:21px; font-size:large"},
                "Попытайся восстановить последовательность этого розыгрыша. Начни с хода C16."
            ),
            h(
                'div',
                {},
                h(Goban, {
                    innerProps: {
                        onContextMenu: evt => evt.preventDefault()
                    },
                    vertexSize,
                    rangeX: showCorner ? [0, 10] : undefined,
                    rangeY: showCorner ? [0, 10] : undefined,

                    signMap: this.state.board.signMap,
                    markerMap: this.state.markers,
                    showCoordinates: true,
                    onVertexMouseUp: (evt, [x, y]) => {
                        if (steps[index].x === x &&
                            steps[index].y === y) {
                            // correct answer
                            let newMarkerMap = this.state.markers.map((a) => {
                                return a.slice();
                            })
                            newMarkerMap[y][x] = {type: 'label', label: (index + 1).toString()}
                            index++;
                            this.setState({
                                board: this.state.board,
                                markers: newMarkerMap,
                                index
                            })
                            if (index === steps.length) {
                                setTimeout(() => {
                                    alert("done!");
                                }, 300);
                            }
                        } else {
                            alert("incorrect");
                            this.setState(
                                {
                                    board: this.state.board,
                                    markers: markerMap,
                                    index: 0
                                }
                            )
                        }


                        // console.log(evt.button);
                        // let sign = evt.button === 0 ? 1 : -1
                        // let newBoard = this.state.board.makeMove(sign, [x, y]);
                        // this.setState({board: newBoard})


                    }
                })
            )
        )
    }
}

render(<App />, document.body);