import { debounce, load_toast, qs,qsa, xml } from "../libs"
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
	calc_form_submit()

	search()
	
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
	console.log(forms)
	if(!forms) return
	forms.forEach(form => {
		form.listen('submit', async e => {
		e.preventDefault()

		await load_toast()

		try{
			let res = await xml("widget_callback",{phone: qs('input',e.target).value}, '/api').then(r => JSON.parse(r))
			if(res.success){
				qs('input', form).value = ''
				new Snackbar("Успешно отправлено")
			} else {
				new Snackbar("Что-то пошло не так")
			}
		} catch(e){
			new Snackbar(e)
		}
		
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
	let cb = [qs('#header_contacts .callback'),qs('footer .cb')];

	if(!cb) return
	cb.forEach(c => {

		c.listen("click", e => {
			e.preventDefault()
			window.scrollTo({top: 0, behavior: 'smooth'});
			qs('.popup').classList.add('open')
		})

	})
	

	document.listen('click', e=> {
		if(e.target == qs('.popup')){
			qs('.popup').classList.remove('open')
		}
	})
}

function calc_form_submit(){
	let form = qs("#calc_form")
	let submit = qs(".send.regular", form)
	
	if(!form || !submit) return

	submit.listen("click", async e => {

		let phone = qs('label.phone input', form).value

		if(!phone){
			await load_toast()
			new Snackbar("Пожалуйста, заполните, номер телефона")
			qs('label.phone input', form).focus()
			return
		}

		let type = Array.from(qsa('.type input',form))
								.map(el => el.checked && el.nextElementSibling.innerHTML)
								.filter(el => el)
		
		let o = {
			from: qs('label.from input', form).value,
			to: qs('label.to input', form).value,
			mass:[qs('label.mass_from input', form).value, qs('label.mass_to input', form).value],
			vol:[qs('label.vol_from input', form).value, qs('label.vol_to input', form).value],
			date:qs('label.calendar input', form).value,
			name: qs('label.name input', form).value,
			type: type,
			phone: phone
		}

		await load_toast()

		try {
			let res = await xml('calc_form', o, '/api').then(r => JSON.parse(r))

			res.success
			? new Snackbar("Успешно отправлено")
			: new Snackbar("Что-то пошло не так")

			draw_calc_form_response(res.success)

		} catch(e){
			new Snackbar(e)
		}
	})
	
}

function draw_calc_form_response(result){
	let o = {
		icon: result ? 'ok':'false',
		title: result ? 'Мы получили ваш запрос':'Произошла ошибка',
		dsc: result ? 'Ожидайте звонка менеджера': 'Попробуйте еще раз и сообщите, нам, пожалуйста'
	}
	let str = `
	<div class="result">
		<img src="/assets/img/icons/${o.icon}.svg" width="37" height="37">
		<span class="title">${o.title}</span>
		<span class="dsc">${o.dsc}</span>
	</div>
	`
	qs('#calc_form').innerHTML = str
}

async function search(){
	let s = qs('#search')
	let input = qs('input', s)
	if(!s) return
	await load_toast()

	let debounceSearch = debounce(fsearch,500)
	input.listen("keyup", debounceSearch)

	qs('img.search', s).listen("click", _ => {
		if(!qs('input', s).value.length) return
		fsearch()
	})

	async function fsearch(){
		let str = input.value.toLowerCase()

		if(str.length < 3){
			new Snackbar("Меньше 3 знаков нельзя")
			return
		}

		try {

			let res = await xml('search', {query: str}, '/api').then(r => JSON.parse(r))
			
			res.success
			? draw_search_res(res)
			: new Snackbar("Ничего не найдено")
			
		} catch(e){
			new Snackbar(e)
		}
		
	}
}

function draw_search_res(res){

	let str = `<ul class="search_results">`
	res.search.forEach(el => str += ` <li><a href="${el.url}">${el.title}</a></li>`)
	str +=`</ul>`


	qs('ul.search_results') && qs('ul.search_results').remove()
	qs('#search').insertAdjacentHTML('beforeend', str)

	document.listen("click", e => {
		if(!qs('ul.search_results')) return
		if(qs('ul.search_results').contains(e.target)) return
		qs('ul.search_results').remove()
	})
}

