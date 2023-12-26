import {loadCSS, onloadCSS, qs} from '../libs'

export const Calendar = {

	async load(){
		return new Promise(resolve => {

			if(!qs('#calc_form')){
				resolve(true)
				return
			}

			let script = document.createElement('script')
			script.src = "/vendors/flatpickr/flatpickr.js"
			script.setAttribute('calendar','')
			qs('.scripts-area').appendChild(script)
			
			script.onload = () => {
				// ru locale
				
				let script = document.createElement('script')
				script.src = "/vendors/flatpickr/ru.js"
				qs('.scripts-area').appendChild(script)
				
				script.onload = () => {
					let style = loadCSS("/vendors/flatpickr/flatpickr.min.css")
					onloadCSS(style, () =>  resolve(true))
				}

			}
		})
		
	},
	
	init(){

		let f = undefined;
		if(!qs('label.calendar input')) return
		
		qs('label.calendar input').addEventListener("click", e =>{

			f = flatpickr(e.target, {

				"locale": "ru",
				"dateFormat": "d.m.y",
				"inline":true,

				onChange: function() { f.destroy()}
				
			});

		})

		document.addEventListener("click", event => {
			if(!qs('.flatpickr-calendar')) return
			if(qs('.flatpickr-calendar').contains(event.target)) return
			if(event.target == qs('label.calendar input')) return
			f.destroy()
		})

		
	},


}
