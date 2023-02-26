import './style';
import './goban.css'
import {Component, render} from "preact";
import {Goban} from "@sabaki/shudan";
import {initializeJoseki, searchBranches, getRandom, getDateString} from "./util.js"
import arrayShuffle from 'array-shuffle';
import random from 'random';
import seedrandom from 'seedrandom'

// содержимое джосек из файла
const content3 = [getContent3()];
const content4 = [getContent4()];

// ищем ветви игры в содержимом джосек
let branches = searchBranches(content3, 3);
let branches4 = searchBranches(content4, 4);

// объединяем ветви
branches = branches.concat(branches4)

// число джосек в день
const numberOfJosekiForOneDay = 5;

// зерно для генератора случайных чисел на основе текущей даты
const randomSeed = getDateString();

// инициализируем генератор
random.use(seedrandom(randomSeed));

// выбираем случайным образом нужное число джосек
const selectedJosekis = getRandom(branches, numberOfJosekiForOneDay, random);

const initialMessage = "Попытайся восстановить последовательность этого розыгрыша";

const constantState = {
    message: initialMessage,
    vertexSize: 32,
    showCorner: true,
};


class App extends Component {
    constructor(props) {
        super(props);

        let joseki_index = 0;

        let initialState = initializeJoseki(selectedJosekis[joseki_index]);

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
                            innerProps={oncontextmenu = evt => evt.preventDefault()}
                            vertexSize={this.state.vertexSize}
                            rangeX={this.state.showCorner ? [0, 10] : undefined}
                            rangeY={this.state.showCorner ? [0, 10] : undefined}
                            signMap={this.state.currentBoard.signMap}
                            markerMap={this.state.currentBoardMarks}
                            showCoordinates={true}
                            onVertexClick={(evt, [x, y]) => {
                                let index = this.state.index;
                                let steps = this.state.steps;

                                if (this.state.currentBoard.signMap[y][x] !== 0) {
                                    // не обрабатываем этот ход
                                    console.log("ход в занятую точку");
                                    return;
                                }

                                // карта отметок для текущих ходов
                                let currentBoardMarks = [...Array(19)].map(() => Array(19));
                                currentBoardMarks[y][x] = {type: 'circle'};

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
                                            this.setState({message: "Верно!"})
                                            setTimeout(() => {
                                                if (this.state.joseki_index < selectedJosekis.length - 1) {
                                                    let joseki_index = this.state.joseki_index + 1;
                                                    let newState = initializeJoseki(selectedJosekis[joseki_index]);
                                                    this.setState(Object.assign({},
                                                        newState,
                                                        constantState,
                                                        {
                                                            joseki_index,
                                                            message: "Следующая задача",
                                                            initialBoard: newState.currentBoard
                                                        }));
                                                    setTimeout(() => {
                                                        this.setState({message: initialMessage})
                                                    }, 1000)
                                                } else {
                                                    this.setState({message: "Задачи на сегодня закончились. Завтра будут новые."});
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
                                    let initialBoardMarks = [...Array(19)].map(() => Array(19));
                                    let firstMoves = this.state.firstMoves;
                                    initialBoardMarks[steps[firstMoves - 1][1]][steps[firstMoves - 1][0]] = {type: 'circle'};
                                    // после паузы устанавливаем начальное состояние
                                    setTimeout(() => this.setState({
                                        currentBoard: this.state.initialBoard,
                                        currentBoardMarks: initialBoardMarks,
                                        index: this.state.firstMoves,
                                        sign: this.state.firstMoves % 2 === 0 ? 1 : -1,
                                        message: initialMessage
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
                <div style={"position:fixed; bottom:0%"}>Собрано: {build_time}. Джосек в коллекции: {branches.length}.
                    Джосек доступно в день: {numberOfJosekiForOneDay}</div>
            </div>
        );
    }
}

function getContent3() {
    return content3_str;
}


function getContent4() {
    return content4_str;
}

render(<App/>, document.body);