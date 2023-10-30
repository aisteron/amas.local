import { qs } from "../libs"
import {Sw} from './Swiper'

export const sliders = () =>{
	home()
	routes_slider()
}


async function home(){
	if(!qs('.index-page')) return
	
	await Sw.load()
	&&
		Sw.init(qs('[swiper]'),{
			navigation: {
				nextEl: qs('.arrows img.next'),
				prevEl: qs('.arrows img.prev'),
			},
		})
	Sw.lazy(qs('[swiper]'))
}

async function routes_slider(){
	let sr = qs('.swiper.routes')

	if(!sr) return
	await Sw.load()
	&&
		Sw.init(sr,{
			slidesPerView: 4,
			spaceBetween: 20,
			navigation: {
				nextEl: qs('img.next',sr.previousElementSibling),
				prevEl: qs('img.prev',sr.previousElementSibling),
			},
		})
}
