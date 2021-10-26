import './style';
import './goban.css'
import {Component, render} from "preact";
import {Goban} from "@sabaki/shudan";

const sgf = require('@sabaki/sgf')
const {h} = require('preact')
const Board = require('@sabaki/go-board')

// просто пример джосек
// в дальнейшем, надо придумать способ хранить их на сайте.. хотя..
const content = [
    "(;GM[1]FF[4]\n" +
    "SZ[19]\n" +
    ";B[dc]\n" +
    ";W[de]\n" +
    ";B[ce]\n" +
    ";W[cf]\n" +
    ";B[cd]\n" +
    ";W[df]\n" +
    ";B[fc]\n" +
    ";W[dj])\n"
    ,
    "(;GM[1]FF[4]\n" +
    "SZ[19]\n" +
    ";B[dd]\n" +
    ";W[cc]\n" +
    ";B[cd]\n" +
    ";W[dc]\n" +
    ";B[ec]\n" +
    ";W[eb]\n" +
    ";B[fb]\n" +
    ";W[fc]\n" +
    ";B[ed]\n" +
    ";W[gb]\n" +
    ";B[db]\n" +
    ";W[fa]\n" +
    ";B[cb])\n"

    // сюда можно положить больше джосек
];

const a_char_code = 'a'.charCodeAt(0);


/**
 * Декодируем координаты из формата SGF в одномерный массив из 2х чисел [x,y]
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

const initialMessage = "Попытайся восстановить последовательность этого розыгрыша";

function initializeJoseki(joseki_index) {
    const rootNodes = sgf.parse(content[joseki_index])
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

const constantState = {
    message: initialMessage,
    vertexSize: 32,
    showCorner: true,
    sign: -1, // цвет следующего камня (1 - чёрный, -1 - белый)
};

class App extends Component {
    constructor(props) {
        super(props);

        let joseki_index = 0;

        let initialState = initializeJoseki(joseki_index);

        this.state = Object.assign({},
            initialState,
            constantState,
            {
                joseki_index,
                initialBoard: initialState.currentBoard
            });
    }

    render() {
        return (
            <div>
                <div style={"margin:21px; font-size:large"}>{this.state.message}</div>
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
                                let steps = this.state.steps;
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
                                            this.setState({message:"Верно!"})
                                            setTimeout(() => {
                                                if(this.state.joseki_index < content.length - 1) {
                                                    let joseki_index = this.state.joseki_index + 1;
                                                    let newState = initializeJoseki(joseki_index);
                                                    this.setState(Object.assign({},
                                                        newState,
                                                        constantState,
                                                        {
                                                            joseki_index,
                                                            message:"Следующая задача",
                                                            initialBoard: newState.currentBoard
                                                        }));
                                                    setTimeout(() => {
                                                        this.setState({ message: initialMessage})
                                                    }, 1000)
                                                } else {
                                                    this.setState({message: "Задачи на сегодня закончились"});
                                                }
                                            }, 1000);
                                        }, 300);
                                    }
                                } else {
                                    this.setState({
                                        currentBoard: this.state.initialBoard,
                                        index: 3,
                                        sign: -1,
                                        message: "Неверно!"
                                    })
                                    setTimeout(() => this.setState({message:initialMessage}), 1000);
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