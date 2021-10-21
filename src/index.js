import './style';
import './goban.css'
import {Component, render} from "preact";
import {Goban} from "@sabaki/shudan";

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

markerMap[1][1]={type:'label', label:'X'}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vertexSize: 24,
            showCorner: true,
            index: 1,
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
                {style:"margin:21px; font-size:large"},
                "Попытайся восстановить последовательность этого розыгрыша."
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
                    onVertexMouseUp: (evt, [x, y]) => {
                        // console.log(evt.button);
                        // let sign = evt.button === 0 ? 1 : -1
                        // let newBoard = this.state.board.makeMove(sign, [x, y]);
                        // this.setState({board: newBoard})
                        let newMarkerMap=this.state.markers.map((a) => {return a.slice();})
                        newMarkerMap[y][x] = {type:'label', label: this.state.index.toString()}
                        // let newBoard = this.state.board.makeMove(1, [x, y]);
                        this.setState({
                            board:this.state.board,
                            markers:newMarkerMap,
                            index: index + 1
                        })
                    }
                })
            )
        )
    }
}

render(<App />, document.body);