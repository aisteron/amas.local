import { qs,qsa, xml } from "../libs"
import { Calendar } from "./Calendar"
import { sliders } from "./sliders"


export const Ui = async () =>{
	await Calendar.load()
	Calendar.init()

	transport_type_dropdown()
	routes_accordion()

	home_callback_form()
	soc_dropdown()
	mobile_menu()

	masonry()
	sliders()

	popup_widget_callback()
	
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
	let forms = qsa('.widget.callback form')
	if(!forms) return
	forms.forEach(form => {
		form.listen('submit', async e => {
		e.preventDefault()
		await xml("widget_callback",{phone: qs('input',e.target).value}, '/api')
		})
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

function masonry(){
	// https://w3bits.com/css-grid-masonry/
	qsa('#route_cards .card').forEach(el => resizeMasonryItem(el))
	function resizeMasonryItem(item){

		var grid = document.getElementsByClassName('masonry')[0],
				rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
				rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
		var rowSpan = Math.ceil((item.querySelector('.masonry-content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
		item.style.gridRowEnd = 'span '+(rowSpan+2);
	}
}

function popup_widget_callback(){
	let cb = qs('#header_contacts .callback')
	if(!cb) return
	cb.listen("click", e => {
		e.preventDefault()
		qs('.popup').classList.add('open')
	})

	document.listen('click', e=> {
		if(e.target == qs('.popup')){
			qs('.popup').classList.remove('open')
		}
	})
}