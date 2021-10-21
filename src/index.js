import './style';
import './goban.css'

const {h} = require('preact')
const {Goban} = require('@sabaki/shudan')

let signMap=[
	[1,0],
	[0,-1]
];

const CustomComponent = props => (
	// <Goban vertexSize={24} signMap={props.signMap} />
	<Goban vertexSize={24} signMap={signMap} />
)

export default function App() {
	return (
		<CustomComponent />
	);
}
