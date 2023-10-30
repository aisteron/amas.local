import { qs } from "../libs"
import { Sw } from "../ui/Swiper"
export const Pages = () => {
	home()
	route()
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

async function route(){
	// implement
}