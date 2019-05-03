import React, {Component} from 'react';
import YouTube from 'react-youtube';

export class Instructions extends Component {
	render() {

		return (
			<div><YouTube
				style={{width: '100%'}}
				videoId="Z13Zl_anaDk"
				opts={{playerVars: {autoplay: 1, controls: 0, fs: 0, loop: 1}}}
			/>
				<p> Please watch this short video explaining the game. </p>
				<p>Click the video and then use the up and down arrow keys to change volume</p></div>
		)
	}
}
