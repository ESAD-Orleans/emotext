$(document).ready(function () {

	var editor, replacementCount = 0;
	var regexp = /(ahb|ahc|ahp|bah|euh|hein|heyf|heyt|heyp|mmm|mouhahaha|oh|ok|okxd|ooh|ou!|oui!|ouiii|tkt)/g;

	tinymce.init({
		selector: '#field',
		height: 240,
		menubar: false,
		toolbar: false,
		statusbar: false,
		plugins: [
			'advlist autolink lists link image charmap print preview anchor',
			'searchreplace visualblocks code fullscreen',
			'insertdatetime media table contextmenu paste code'
		],
		content_css: [
			'mce-override.css',
			'//fast.fonts.net/cssapi/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
			'//www.tinymce.com/css/codepen.min.css'
		],
		setup: function (ed) {
			editor = ed;

			function change(e) {
				var content = ed.getContent();
				//console.log(content);
				//content = content.replace(r, function (a, b) {
				//	var replacement = '<span class="emotext"><span class="'+a+'"><span>'+a+' </span></span></span>';
				//	console.log(replacement);
				//	return replacement;
				//});
				//console.log(content);
				//ed.setContent(content, {format: 'raw'});
			}

			function log(e) {
				//console.log('log');
				//console.log(e.type);
			}

			function PreProcess(e) {
			}

			function PostProcess(e) {
				var dom = e.target.dom;
				var c = 0, initialContent = e.content,
					initialText = $(e.content).text(),
					customContent = initialText.replace(regexp, function (a) {
						c++;
						var cl = a;
						switch(a){
							case 'ah' : cl += 'b'; break;
							case 'hey' : cl += 'f'; break;
							case 'mmm' : cl += 'b'; break;
							case 'ok' : cl += 's'; break;
						};
						return '<span class="emotext '+cl+'"><span class="word">'+a+'</span></span>'
					});
				customContent = '<p>' + customContent + '&#8203;</p>';
				var customText = $(customContent).text();
				//console.log(c);
				if (c != replacementCount) {
					replacementCount = c;
					var rng = ed.selection.getRng(),
						startOffset = rng.startOffset,
						endOffset = rng.endOffset;
					e.target.$('body').html(customContent);
					console.log(customContent);
					var nodeText = e.target.$('p')[0].lastChild,
						range = document.createRange(),
						body = e.target.$('body')[0];
					//console.log(rng,startOffset,endOffset);
					console.log(rng.startContainer, startOffset);
					console.log(rng.endContainer, endOffset);
					console.log(nodeText);
					//console.log(rng);
					range.setStart(nodeText, 1);
					range.setEnd(nodeText, 1);
					//range.setStartBefore(nodeText);
					//range.setEndBefore(nodeText);
					//range.setEnd(body,endOffset);
					e.target.selection.setRng(range);
					//*/
				}
				//ed.setContent(customContent);
			}

			function BeforeSetContent(e, a) {
				//console.log(e,a);
			}

			function KeyDown(e){
				if(e.code.toLowerCase() == 'enter'){
					e.preventDefault();
					e.stopPropagation();
					var messageHtml = ed.getContent();
						displayMessage(messageHtml);
					ed.setContent('');
				}
			}

			//ed.on('NodeChange',change);
			ed.on('submit', KeyDown);
			ed.on('keydown', KeyDown);
			ed.on('keyup', change);
			ed.on('BeforeSetContent', log);
			ed.on('BeforeSetContent', BeforeSetContent);
			ed.on('NodeChange', log);
			ed.on('ExecCommand', log);
			ed.on('BeforeRenderUI', log);
			ed.on('BeforeExecCommand', log);
			ed.on('LoadContent', PostProcess);
			ed.on('PreProcess', log);
			ed.on('PreProcess', PreProcess);
			ed.on('PostProcess', log);
			ed.on('PostProcess', PostProcess);
		}
	});

	function displayMessage(messageHtml,from){
		div = $('<div class="message '+from+'"></div>').html(messageHtml);
		$('.chat').append(div);
	}


	// Spacebrew Object
	var sb, app_name = "emotext";

	/**
	 * setup Configure spacebrew connection and adds the mousedown listener.
	 */
	function setupSpacebrew() {
		var random_id = Math.floor(Math.random()*89999+10000);

		app_name = app_name+'_'+chance.hash({length:6});

		// create spacebrew client object
		sb = new Spacebrew.Client({reconnect: true});

		// here's where you upgrade to an admin connetion!
		sb.extend(Spacebrew.Admin);

		// set the base description
		sb.name(app_name);
		sb.description(chance.name());

		// configure the publication and subscription feeds
		sb.addPublish("emotext", "string", "");
		sb.addSubscribe("emotext", "string", "");

		// override Spacebrew events - this is how you catch events coming from Spacebrew
		sb.onOpen = onOpen;

		// special admin-only events
		sb.onNewClient = onNewClient;
		sb.onUpdateClient = onNewClient;
		sb.onRemoveClient = onRemoveClient;
		sb.onUpdateRoute = onUpdateRoute;

		// connect to spacbrew
		sb.connect();
	}

	/**
	 * Function that is called when Spacebrew connection is established
	 */
	function onOpen() {
		var message = "Connected as " + sb.name() + ". ";
		console.log(message);
	}

	var numClients = 0,
		emotextClients = new Array();

	function onNewClient(client) {

		var regexp = /emotext_(.*)/g;
		if(client.name.match(regexp)){
			console.log("new client %s ", client.name);
			emotextClients[client.name] = client;
			sb.send("newClient", "string", client.name);
		}
		// update HTML

		// send name out as route (because, why not?)
	}

	function onRemoveClient(name, address) {
		console.log("remove client " + name);
		$("#clients").html(sb.admin.clients.length);
	}

	function onUpdateRoute(type, pub, sub) {
		//
	}

	setupSpacebrew();


});
