import { qs,qsa, xml } from "../libs"
import { Calendar } from "./Calendar"
import { Sw } from "./Swiper"

export const Ui = async () =>{
	await Calendar.load()
	Calendar.init()

	transport_type_dropdown()
	routes_accordion()
	
	await Sw.load()
	
	Sw.init(qs('[swiper]'),{
		navigation: {
			nextEl: qs('.arrows img.next'),
			prevEl: qs('.arrows img.prev'),
		},
	})
	Sw.lazy(qs('[swiper]'))

	home_callback_form()
	soc_dropdown()
	mobile_menu()
	
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

function soc_dropdown(){
	let dd = qs('.mobile-dropdown > img')
	if(!dd) return
	
	dd.listen('click', e => {
		dd.closest('div').classList.toggle('open')
	})
	
	document.listen("click", e => {
		if(e.target == dd) return
		if(dd.closest('div').contains(e.target)) return
		dd.closest('div').classList.remove('open')
	})
}

function mobile_menu(){
	let mi = qs('.mobile-menu img')
	if(!mi) return
	
	mi.listen("click", e => {
		mi.closest('div').classList.toggle('open')
		qs('body').classList.toggle('stop-scrolling')
	})

	document.listen("click", e => {
		if(e.target == mi) return
		if(e.target == qs('.mobile-menu .wrap')){
			mi.closest('div').classList.remove('open')
			qs('body').classList.remove('stop-scrolling')
			return
		}
		if(mi.closest('div').contains(e.target)) return
		mi.closest('div').classList.remove('open')
		qs('body').classList.remove('stop-scrolling')
	})
}