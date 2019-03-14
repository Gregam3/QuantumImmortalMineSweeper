import React, {Component} from 'react';
import YouTube from 'react-youtube';

export class Instructions extends Component {
	render() {
		const opts = {
			height: '390',
			width: '640',
			playerVars: { // https://developers.google.com/youtube/player_parameters
				autoplay: 1,
				controls: 0,
				fs: 0,
				loop: 1
			}
		};

		return (
			<YouTube
				videoId="7B85WbEiYf4"
				opts={opts}
			/>
		)
	}
}