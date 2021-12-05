import './style';
import './goban.css'
import {Component, render} from "preact";
import {Goban} from "@sabaki/shudan";
import {initializeJoseki, searchBranches} from "./util.js"
import arrayShuffle from 'array-shuffle';

// просто пример джосек
// в дальнейшем, надо придумать способ хранить их на сайте.. хотя..
const content = [
    // сюда можно положить больше джосек
    "(;\n" +
    "GM[1]FF[4]SZ[19];\n" +
    "B[dp];\n" +
    "W[fq](;B[cn];W[dq];B[cq];W[cr];B[eq];W[dr](;B[ep];W[er](;B[bq](;W[fp])(;W[hq]))(;B[fp];W[gq]))(;B[fp];W[er];B[ep];W[gq])(;B[er](;W[ep];B[fr];W[cp];B[do];W[bp];B[gq])(;W[cp];B[ep];W[co](;B[dn])(;B[do];W[bq];B[bo];W[bp](;B[dm])(;B[dn])))))(;B[hq];W[cq];B[dq];W[cp];B[do];W[dr];B[er];W[cr];B[fr];W[cn]))"
    ,
    "(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]\n" +
    "RU[Japanese]SZ[19]KM[0.00]\n" +
    "PW[Белые]PB[Черные]\n" +
    ";B[dp]\n" +
    ";W[cq]\n" +
    ";B[cp]\n" +
    ";W[dq]\n" +
    "(;B[ep]\n" +
    ";W[eq]\n" +
    ";B[fq]\n" +
    ";W[fr]\n" +
    ";B[bq]\n" +
    ";W[br]\n" +
    "(;B[er]\n" +
    ";W[bp]\n" +
    ";B[cr]\n" +
    ";W[aq]\n" +
    ";B[dr]\n" +
    ";W[bq]\n" +
    ";B[gr]\n" +
    ";W[fp]\n" +
    ";B[gq]\n" +
    ";W[cn])\n" +
    "(;B[gr]\n" +
    ";W[bp]\n" +
    "(;B[bo]\n" +
    ";W[gq]\n" +
    ";B[fp]\n" +
    ";W[hr]\n" +
    ";B[er]\n" +
    ";W[gs]\n" +
    ";B[cr]\n" +
    ";W[aq]\n" +
    ";B[dr]\n" +
    ";W[bq])\n" +
    "(;B[fp]\n" +
    ";W[bo])\n" +
    "(;B[gp]\n" +
    ";W[fo]\n" +
    ";B[fp]\n" +
    ";W[bo])))\n" +
    "(;B[eq]\n" +
    ";W[er]\n" +
    ";B[fr]\n" +
    ";W[fq]\n" +
    ";B[ep]\n" +
    ";W[gr]\n" +
    ";B[dr]\n" +
    ";W[fs]\n" +
    ";B[cr]\n" +
    ";W[fp]\n" +
    ";B[fo]\n" +
    ";W[go]))\n"
    ,
    // joseki6.sgf
    "(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]\n" +
    "RU[Japanese]SZ[19]KM[0.00]\n" +
    "PW[Белые]PB[Черные]\n" +
    ";B[dp]\n" +
    ";W[fq]\n" +
    ";B[fp]\n" +
    ";W[gp]\n" +
    ";B[fo]\n" +
    ";W[dq]\n" +
    ";B[cq]\n" +
    ";W[eq]\n" +
    ";B[cp]\n" +
    ";W[jq])\n"
];


let branches = searchBranches(content);

// перемешиваем джосеки
branches = arrayShuffle(branches);

const initialMessage = "Попытайся восстановить последовательность этого розыгрыша";

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

        let initialState = initializeJoseki(branches[joseki_index]);

        this.state = Object.assign({},
            initialState,
            constantState,
            {
                joseki_index,
                initialBoard: initialState.currentBoard,
                currentBoardMarks: initialState.currentBoardMarks
            });
    }

    render() {
        return (
            <div>
                <div style={"margin:21px; font-size:large"}>{this.state.message}</div>
                <div style={"display:flex"}>
                    <div style={"margin:10px"}>
                        <Goban
                            innerProps={oncontextmenu= evt=>evt.preventDefault()}
                            vertexSize={this.state.vertexSize}
                            rangeX={this.state.showCorner ? [0,10]:undefined }
                            rangeY={this.state.showCorner ? [0,10]:undefined }
                            signMap={this.state.currentBoard.signMap}
                            markerMap={this.state.currentBoardMarks}
                            showCoordinates={true}
                            onVertexClick={ (evt, [x,y]) => {
                                let index = this.state.index;
                                let steps = this.state.steps;

                                // карта отметок для текущих ходов
                                let currentBoardMarks = [...Array(19)].map(() => Array(19));
                                currentBoardMarks[y][x] = {type:'circle'};

                                if (steps[index][0] === x &&
                                    steps[index][1] === y) {
                                    // правильный ответ
                                    index++;
                                    const sign = this.state.sign;
                                    this.setState({
                                        currentBoard: this.state.currentBoard.makeMove(sign, [x, y]),
                                        index,
                                        sign: -sign,
                                        currentBoardMarks
                                    })
                                    if (index === steps.length) {
                                        setTimeout(() => {
                                            this.setState({message:"Верно!"})
                                            setTimeout(() => {
                                                if(this.state.joseki_index < branches.length - 1) {
                                                    let joseki_index = this.state.joseki_index + 1;
                                                    let newState = initializeJoseki(branches[joseki_index]);
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
                                    // неправильный ответ
                                    // сбрасываем состояние на начальное
                                    this.setState({
                                        currentBoard: this.state.currentBoard.makeMove(this.state.sign, [x, y]),
                                        currentBoardMarks,
                                        message: "Неверно!"
                                    })
                                    // после паузы устанавливаем начальное состояние
                                    setTimeout(() => this.setState({
                                        currentBoard: this.state.initialBoard,
                                        currentBoardMarks: [...Array(19)].map(() => Array(19)),
                                        index: 3,
                                        sign: -1,
                                        message:initialMessage
                                    }), 1000);
                                }
                            }}
                        />
                    </div>
                    <div style={"margin:10px"}>
                        {/*просто показываем финальное состояние джосеки, не обрабатывая нажатия*/}
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
                {/* built_time вычисляется webpack-ом во время сборки */}
                <div style={"position:fixed; bottom:0%"}>Собрано: {build_time}. Джосек в коллекции: {branches.length}</div>
            </div>
        );
    }
}

render(<App />, document.body);