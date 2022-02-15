function onInstall(){
	if(document.querySelector('td.deck-check') !== null) return;
	document.querySelectorAll('td.deck-card').forEach(function(el){
		var url = el.firstChild.getAttribute('href');
		var uri = url.replace(/^.*card=([^&]+).*$/, '$1');
		var td = document.createElement('td');
		td.classList.add('deck-check');
		var input = document.createElement("input");
		input.setAttribute('type', 'checkbox');
		input.setAttribute('name', uri);
		input.addEventListener('change', checkUpdate);
		td.prepend(input);
		el.parentNode.prepend(td);
	});
}

function checkUpdate(event){
    var uri = event.target.getAttribute('name');
    document.querySelectorAll(`td.deck-check > input[name="${uri}"]`).forEach(function(input){
        input.checked = event.target.checked;
    });
    dematerialize();
}

function getOwned(){
	var params = new URLSearchParams(window.location.search);
	return params.get('owned');
}

function updateOwned(owned){
	var params = new URLSearchParams(window.location.search);
	params.set('owned', owned);
	window.history.replaceState({}, '', `${window.location.origin}?${params}`);
}

function dematerialize(){
	var cards = [];
	document.querySelectorAll('td.deck-check > input:checked').forEach(function(input){
		var name = input.getAttribute('name');
		if(!cards.includes(name)){
			cards.push(name);	
		}
	});
	var owned = btoa(JSON.stringify(cards));
	updateOwned(owned);
}

function materialize(){
	var owned = getOwned();
	var cards = JSON.parse(atob(owned));
	document.querySelectorAll('td.deck-check > input').forEach(function(input){
		var name = input.getAttribute('name');
		input.checked = cards.includes(name);
	});
}
onInstall();
materialize();