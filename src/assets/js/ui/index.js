import { qs,qsa, xml } from "../libs"
import { Calendar } from "./Calendar"
import { Sw } from "./Swiper"

export const Ui = async () =>{
	await Calendar.load()
	Calendar.init()

	transport_type_dropdown()
	routes_accordion()
	
	await Sw.load()
	Sw.lazy(qs('[swiper]'))
	Sw.init(qs('[swiper]'),{
		navigation: {
			nextEl: qs('.arrows img.next'),
			prevEl: qs('.arrows img.prev'),
		},
	})

	home_callback_form()
	
}

function transport_type_dropdown(){
	let t = qs('#calc_form .type')
	if(!t) return
	qs('span.t', t).listen("click", event => {
		t.classList.toggle('open')
	})
}

function routes_accordion(){
	let acc = qs("#routes_accordion")
	if(!acc) return
	qsa('.title>span', acc).forEach(el =>{

		el.listen('click', e => {
			e.target.closest('li').classList.toggle('open')
		})
	})
}

function home_callback_form(){
	let form = qs('.widget.callback form')
	if(!form) return
	
	form.listen('submit', async e => {
		e.preventDefault()
		await xml("widget_callback",{phone: qs('input',e.target).value}, '/api')
	})
}