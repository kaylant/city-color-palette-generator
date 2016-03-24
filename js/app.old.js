// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

import vibrant from "node-vibrant"
// put vibrant on window to test it
window.vibrant = vibrant

import DOM from 'react-dom'
import React, {Component} from 'react'

import Underscore from "underscore"
import Backbone from "backbone"

var apiKey = 'AIzaSyCJ8zb1jEVLaSvUnfalB2Nri5yCes1EKvw'
var googlePlacesUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCJ8zb1jEVLaSvUnfalB2Nri5yCes1EKvw&libraries=places'

var customSearch = "https://www.googleapis.com/customsearch/v1?key=AIzaSyDr6T8gkhLh6ZhsEX9MjtW9fMYk5ehPaKw&searchType=image&q=unicorns&cx=008940921588152958013:h64uer7a344"


function app() {
	// returned sample data from vibrant to test
	// get RGB and HSL - hue, saturation, and lightness array values for each below
	// testing RGB only for now	


	vibrant.from('/images?https://upload.wikimedia.org/wikipedia/commons/4/44/Panoramic_Houston_skyline.jpg').getPalette(function(err, palette){console.log(err);console.log(palette)})

	var vibrantData = {
		results: [
		{	// DarkMuted RGB
			0: 42,
			1: 61,
			2: 73
		},
		{	// DarkVibrant RGB
			0: 4,
			1: 5,
			2: 9
		},
		{
			// LightMuted RGB
			0: 195,
			1: 191,
			2: 187 
		},
		{	// LightVibrant RGB
			0: 172,
			1: 216,
			2: 252
		},
		{	// Muted RGB
			0: 133,
			1: 143,
			2: 173
		},
		{	// Vibrant RGB
			0: 113,
			1: 153,
			2: 213
		}
		]
	}

	// AppView component
	var AppView = React.createClass({
		render: function() {
			// console.log(this)
			// to do: console log data once it has returned from Google API, console.log(this)
			return (
				<div className="pageContainer">
					{/* AppView has CityImg component and ColorPalette component as its children */}
					<CityImg />
					<ColorPalette />
				</div>
				)
		}
	})

	var CityImg = React.createClass({
		render: function() {
			return (
				<div className="cityImgContainer">
					<img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Panoramic_Houston_skyline.jpg"/>
				</div>
				)
		}
	})

	var ColorPalette = React.createClass({
		render: function() {
			return (
				<div className="colorPaletteContainer">
					{this._renderColorComponents}
				</div>				
				)
		}
	})

	var Color1 = React.createClass ({
		render: function() {
			return (
				<div className="color1">
					<p>color 1</p>
				</div>
			)
		}
	})

	var Color2 = React.createClass ({
		render: function() {
			return (
				<div className="color2">
					<p>color 2</p>
				</div>
			)
		}
	})

	var Color3 = React.createClass ({
		render: function() {
			return (
				<div className="color3">
					<p>color 3</p>
				</div>
			)
		}
	})

	var Color4 = React.createClass ({
		render: function() {
			return (
				<div className="color4">
					<p>color 4</p>
				</div>
			)
		}
	})

	var Color5 = React.createClass ({
		render: function() {
			return (
				<div className="color5">
					<p>color 5</p>
				</div>
			)
		}
	})

	var Color6 = React.createClass ({
		render: function() {
			return (
				<div className="color6">
					<p>color 6</p>
				</div>
			)
		}
	})


	// to do: put data on the model from Google Images API
    DOM.render(<AppView colorData={vibrantData} />, document.querySelector('.container'))
}

app()
