import { qsa,qs,loadCSS,onloadCSS } from "../libs";

export const Sw = {
	async load(){
		
		return new Promise(resolve =>{

			if(qs(['swiper'])){resolve(true); return}

			let script = document.createElement("script")
			script.src="/vendors/swiper/swiper-bundle.min.js"
			script.setAttribute("swiper","")
			qs(".scripts-area").appendChild(script)
			
			script.onload = () => {
				
				let style = loadCSS("/vendors/swiper/swiper-bundle.min.css")
				onloadCSS(style, () => {
					console.log('%c Swiper loaded', 'color: #666')
					resolve(true)
				})
			}
		})
	},

	lazy(swiper){
		
		qsa('[data-src]',swiper).forEach(img => img.src=img.dataset.src)
	},

	init(el,options){
		
		new Swiper(el, options);
  
	}
}