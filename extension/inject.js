async function onInstall(){
	await createCheckBoxes();
	await createTextBoxes();
	materialize();
	getNames();
}

async function createCheckBoxes(){
	if(document.querySelector('td.deck-check') !== null) return;
	document.querySelectorAll('td.deck-card').forEach(function(el){
		const url = el.firstChild.getAttribute('data-tooltip');
		const uri = url.replace(/^sticky_(\d+)_-1$/, '$1');
		const td = document.createElement('td');
		td.classList.add('deck-check');
		const input = document.createElement("input");
		input.setAttribute('type', 'checkbox');
		input.setAttribute('name', uri);
		input.addEventListener('change', checkUpdate);
		td.prepend(input);
		el.parentNode.prepend(td);
	});
}

async function createTextBoxes(){
	if(document.querySelector('.dk-graph-inject') !== null) return;

	const el = document.querySelector('.dk-graph');
	el.classList.add('dk-graph-inject');
	el.classList.remove('box-margin-t');
	el.firstElementChild.classList.add('box-margin-t');
	
	el.prepend(createBox('Não Selecionadas', 'deck-not_selected'));
	el.prepend(createBox('Selecionadas', 'deck-selected'));
}

function createBox(name, id){
	
	const div = document.createElement('div');
	div.classList.add('boxshadow');
	div.classList.add('conteudo');
	div.classList.add('box-interna');
	div.classList.add('box-margin-t');

	const title = document.createElement('div');
	title.classList.add('title');
	title.append(name);
	div.append(title);

	const box = document.createElement('div');
	box.id = id;
	box.style.height = '200px';
	box.style.margin = '0px auto';
	box.style.overflow = 'hidden';
	div.append(box);

	const textarea = document.createElement('textarea');
	textarea.style.height = '100%';
	textarea.style.width  = '100%';
	box.append(textarea);
	
	return div;
}

async function getNames(){
	let selected = [];
	let not_selected = [];
	let last_key = -1;

	document.querySelectorAll('#deck-view>div:first-child tr').forEach(function(el){
		if(el.childNodes.length == 1) {
			const title = el.firstElementChild;
			if(title.classList.contains('deck-type')){
				let text = title.textContent.trim();
				if(text.match(/^(.+)\(\d+\)$/)){
					text = text.replace(/^(.+)\(\d+\)$/, '$1').trim();
					last_key++;
					selected[last_key] = {"key": text, "cards": [] };
					not_selected[last_key] = {"key": text, "cards": [] };
				}
			}
		} else if(el.childNodes.length >= 3) {
			const check = el.childNodes[0];
			const qty   = el.childNodes[1];
			const card  = el.childNodes[2];
			if(check.firstElementChild.checked){
				selected[last_key].cards.push(`${qty.textContent.trim()} ${card.textContent.trim()}`);
			} else {
				not_selected[last_key].cards.push(`${qty.textContent.trim()} ${card.textContent.trim()}`);
			}
		} else {
			console.warn(el.textContent, el);	
		};
    
	});
	
	let selected_text = '';
	selected.forEach(function(item){
		if(item.cards.length > 0){
			selected_text += `-- ${item.key}\n${item.cards.join('\n')}\n`
		}
	});
	
	let not_selected_text = '';
	not_selected.forEach(function(item){
		if(item.cards.length > 0){
			not_selected_text += `-- ${item.key}\n${item.cards.join('\n')}\n`
		}
	});

	document.querySelector('#deck-selected textarea').value = selected_text;
	document.querySelector('#deck-not_selected textarea').value = not_selected_text;
}

async function checkUpdate(event){
    const uri = event.target.getAttribute('name');
    document.querySelectorAll(`td.deck-check > input[name="${uri}"]`).forEach(function(input){
        input.checked = event.target.checked;
    });
    dematerialize();
	getNames();
}

async function getOwned(){
	const params = new URLSearchParams(window.location.search);
	return params.get('owned');
}

async function updateOwned(owned){
	const params = new URLSearchParams(window.location.search);
	params.set('owned', owned);
	window.history.replaceState({}, '', `${window.location.origin}?${params}`);
}

async function dematerialize(){
	const cards = [];
	document.querySelectorAll('td.deck-check > input:checked').forEach(function(input){
		const name = input.getAttribute('name');
		if(!cards.includes(name)){
			cards.push(name);
		}
	});
	const joined = cards.join(',');
	const owned = btoa(joined);
	updateOwned(owned);
}

async function materialize(){
	const owned = await getOwned();
	const joined = atob(owned);
	const cards = joined.split(',');
	document.querySelectorAll('td.deck-check > input').forEach(function(input){
		const name = input.getAttribute('name');
		input.checked = cards.includes(name);
	});
}

onInstall();