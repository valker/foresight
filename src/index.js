import './style';
import './goban.css'
import {Component, render} from "preact";
import {Goban} from "@sabaki/shudan";
const {h} = require('preact')
const Board = require('@sabaki/go-board')

//
class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			board: new Board([
				[1,0],
				[0,-1]
			]),
			vertexSize: 24
		}
	}
	render() {
		let {
			vertexSize,
			// showCoordinates,
			// alternateCoordinates,
			// showCorner,
			// showDimmedStones,
			// fuzzyStonePlacement,
			// animateStonePlacement,
			// showPaintMap,
			// showHeatMap,
			// showMarkerMap,
			// showGhostStones,
			// showLines,
			// showSelection
		} = this.state

		return h(Goban,{
			vertexSize,
			signMap: this.state.board.signMap,
			onVertexClick: (evt, [x,y]) => {
				let newBoard = this.state.board.makeMove(1, [x,y]);
				this.setState({board:newBoard})
			}
		})
	}
	// return (
	// 	<Goban
	// 		id={"mainGoban"}
	// 		vertexSize={24}
	// 		signMap={board.signMap}
	// 		onVertexClick = (evt, vertex) => {
	// 			let newBoard = board.makeMove(1, vertex);
	//
	// 		}
	// 	/>
	// );
}

render(<App />, document.body);