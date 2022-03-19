async function onInstall(){
	if(document.querySelector('td.deck-check') !== null) return;
	document.querySelectorAll('td.deck-card').forEach(function(el){
		var url = el.firstChild.getAttribute('data-tooltip');
		var uri = url.replace(/^sticky_(\d+)_-1$/, '$1');
		var td = document.createElement('td');
		td.classList.add('deck-check');
		var input = document.createElement("input");
		input.setAttribute('type', 'checkbox');
		input.setAttribute('name', uri);
		input.addEventListener('change', checkUpdate);
		td.prepend(input);
		el.parentNode.prepend(td);
	});
	materialize();
}

async function checkUpdate(event){
    var uri = event.target.getAttribute('name');
    document.querySelectorAll(`td.deck-check > input[name="${uri}"]`).forEach(function(input){
        input.checked = event.target.checked;
    });
    dematerialize();
}

async function getOwned(){
	var params = new URLSearchParams(window.location.search);
	return params.get('owned');
}

async function updateOwned(owned){
	var params = new URLSearchParams(window.location.search);
	params.set('owned', owned);
	window.history.replaceState({}, '', `${window.location.origin}?${params}`);
}

async function dematerialize(){
	var cards = [];
	document.querySelectorAll('td.deck-check > input:checked').forEach(function(input){
		var name = input.getAttribute('name');
		if(!cards.includes(name)){
			cards.push(name);
		}
	});
	const joined = cards.join(',');
	const owned = btoa(joined);
	updateOwned(owned);
}

async function materialize(){
	var owned = await getOwned();
	const joined = atob(owned);
	var cards = joined.split(',');
	document.querySelectorAll('td.deck-check > input').forEach(function(input){
		var name = input.getAttribute('name');
		input.checked = cards.includes(name);
	});
}

onInstall();