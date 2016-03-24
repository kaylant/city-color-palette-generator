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

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'

import Backbone from "backbone"

import Vibrant from "node-vibrant"
// 

function app() {

	// Model
    var ImgModel = Backbone.Model.extend ({
    	url: "https://www.googleapis.com/customsearch/v1",

    	// key: "AIzaSyCJ8zb1jEVLaSvUnfalB2Nri5yCes1EKvw",
    	key: "AIzaSyDr6T8gkhLh6ZhsEX9MjtW9fMYk5ehPaKw",

    	//cx: "004196397515287344825:ve6rrdva0mi",
    	cx: "008940921588152958013:h64uer7a344",

    	defaults: {
    		image: {
    			link: './images/kaylan-smith-dubai-difc.png' //./images/kaylan-smith-dubai-difc.png' //gif goes here
    		},
			palette: []
    	},

    	parse: function(rawData) {
    		// console.log(rawData.items)
    		var objArr = rawData.items
    		console.log(rawData)
    		for (var i = 0; i < objArr.length; i++) {
    			var singleObj = objArr[i]
    			// console.log(singleObj)
    			var imgHeight = singleObj.image.height
    			// console.log(imgHeight)
    			if (imgHeight >= '700') {
    				return {
    					image: singleObj,
    					palette: null
    				}
    			}
    		}
    		// return singleObj
    		// return {
    		// 	image: rawData.items[0]
    		// }// will take in data and return first element (image) of the array
    	}
    })

    
	// Views
	var AppView = React.createClass({
		_updateModel: function() {
			// has link under props, data, attributes, link
			// console.log("this image on props")
			// console.log(this)
			this.setState({
				imageData: this.props.data.get('image'),
				palette: this.props.data.get('palette')
			})
		},

		componentWillMount: function() {			
			var self = this
			// this.props.data.on('sync', this._updateModel)
			this.props.data.on('change', this._updateModel) //replace this double-duty catch all with two listeners: this._updateImage on "sync" event and this._updatePalette on "change" event?
		},

		getInitialState: function() {
			// console.log('link')
			// console.log(this.props.data.attributes)
			return {
				imageData: this.props.data.get('image'),
				palette: this.props.data.get('palette')
			}
		},

		render: function() {
			// put image data on state, but doesn't have link			
			// console.log('rendering app view') 
			// console.log(this)
			return (
				<div className="pageContainer">
					{/* AppView has CityImg component and ColorPalette component as its children */}
					<CityImg imageData={this.state.imageData}/>
					<ColorPalette palette={this.state.palette}/>
				</div>
				)
		}
	})

	var CityImg = React.createClass({
		_setRoute: function(event) {
			if (event.keyCode === 13) {
				window.location.hash = `search/${event.target.value}`
				event.target.value = ""
			}
		},

		render: function() {
			// console.log('city image component, never received link')
			// console.log(this.props)
			return (
				<div className="cityImgContainer">
					<input onKeyDown={this._setRoute} />
					<img className="cityImg" src={this.props.imageData.link} />
				</div>
				)
		}
	})

	var ColorPalette = React.createClass({

		_renderColorComponents: function(paletteObj) {
			
			var jsxArray = []
			var timeout = 1
			// console.log('incoming palette object')
			// console.log(paletteObj)
			for (var prop in paletteObj) {
				var swatchObj = paletteObj[prop]
				// console.log(prop)
				if (swatchObj) {
					var component = <Color swatchType={prop} timeout={timeout} rgbArr={swatchObj.rgb} key={timeout}/>
					jsxArray.push(component)
					timeout += 1
				}
			}
			return jsxArray
		},

		render: function() {
			// console.log(this.props.palette)		
			
			return (
				<div className="colorPaletteContainer">
					{this._renderColorComponents(this.props.palette)}
				</div>				
				)
		}
	})

	var Color = React.createClass({

		componentWillMount: function() {
			// console.log(this.props.timeout)
			setTimeout(function() {
					this.setState({opacity:1})
				}.bind(this),this.props.timeout * 150)
		},

		getInitialState: function() {
			return {
				opacity: 0
			}
		},

		render: function() {
			// console.log('incoming Color props')
			// console.log(this.props)
			var bgColor = `rgb(${Math.floor(this.props.rgbArr[0])},${Math.floor(this.props.rgbArr[1])},${Math.floor(this.props.rgbArr[2])})`
			var styleObj = {background: bgColor, opacity: this.state.opacity}
			return (
				<div className="color" style={styleObj}>
					{/*<p className="swatchName">Swatch type: {this.props.swatchType}</p>*/}
				</div>
				)
		}
	})


    // Router

    var AppRouter = Backbone.Router.extend ({
    	routes: {
    		"search/:cityName": "searchForCity",
    		"*default"        : "showDefaults"
    	},

    	searchForCity: function(cityName) {
    		var setPalette = function(mod) {
    			console.log(mod)
    			var src = "/image?src=" + mod.get("image").link.replace('https','http')   			
    			Vibrant.from(src).getPalette(
    				function(err, incomingPalette){
    					// console.log(err)
    					// console.log(incomingPalette)
    					mod.set({palette:incomingPalette})
    				}
    			)
    		}
    		var mod = this.nm
    		this.nm.fetch({
    			data: {
    				key: this.nm.key,
    				cx: this.nm.cx,
    				searchType: "image",
    				q: cityName
    			}
    		}).then(function(){setPalette(mod)})
    		console.log('model')
    		console.log(this.nm)
    		DOM.render(<AppView data={this.nm} />, document.querySelector('.container'))
    	},

    	showDefaults: function() {
    		window.location.hash = "home"
    		var setPalette = function(mod) {
    			Vibrant.from(mod.get('image').link).getPalette(
    				function(err, incomingPalette){    					
    					mod.set({palette:incomingPalette})
    				}
    			)
    		}

    		setPalette(this.nm)
    		DOM.render(<AppView data={this.nm} />, document.querySelector('.container'))
    	},

    	initialize: function() {
    		this.nm = new ImgModel()
    		Backbone.history.start()
    	}
    })

    var rtr = new AppRouter()
}

app()
