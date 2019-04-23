import React, {Component} from 'react';
import YouTube from 'react-youtube';

export class Instructions extends Component {
	render() {

		return (
			<YouTube
				style={{width: '100%'}}
				videoId="Z13Zl_anaDk"
				opts={{playerVars: {autoplay: 1, controls: 0,fs: 0,loop: 1}}}
			/>
		)
	}
}
