import './style';
import './goban.css'
import {Component, render} from "preact";
import {Goban} from "@sabaki/shudan";
import {initializeJoseki} from "./util.js"

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

        let initialState = initializeJoseki(content[joseki_index]);

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
                                    // правильный ответ
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
                                                    let newState = initializeJoseki(content[joseki_index]);
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
            </div>
        );
    }
}

render(<App />, document.body);