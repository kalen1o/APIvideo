'use strict';

var server = 'https://itunes.apple.com';

let $searchFormElement = $('#search-form');

$searchFormElement.on('submit', function(event) {
	event.preventDefault();

	let value = $('[name="search-value"]', this).val();

	value = value.trim();

	if(!value) return;

	sendRequest(value);
});

let videosList = [],
	$videoInfoElement = $('#video-info'),
	$videoHolderElement = $('.video-holder');

function sendRequest(term) {
	var request = $.ajax(`${server}/search?entity=musicVideo&term=${term}`);

	let $videosListElement = $('#videos-list');

	console.log(request, 'request');
	request.done(response => {
		response = JSON.parse( response );
		videosList = response.results;
		console.log(videosList);

		$videosListElement.empty();

		videosList.forEach(video => {
			$('<a>')
				.attr({'href': '', 'data-id': video.trackId})
				.addClass('list-group-item')
				.text(video.trackName)
				.appendTo($videosListElement);
		})
	}).fail(error => {
		console.log('error', error);
		alert(error.responseJSON.error.message);
	});;
};

$('body').on('click', '[data-id]', function(event) {
	event.preventDefault();

	let id = $(this).data('id');

	let videoData = videosList.find(element => element.trackId === id);

	let $image = $('<img>').attr('src', videoData.artworkUrl100).addClass('pull-left'),
		$artist = $('<p>').text(`Artist: ${videoData.artistName}`),
		$collection = $('<p>').text(`Collection: ${videoData.collectionName}`),
		$genre = $('<p>').text(`Genre: ${videoData.primaryGenreName}`),
		$date = $('<p>').text(`Release Date: ${videoData.releaseDate}`);

	$videoInfoElement
		.find('.video-heading')
			.text( `${videoData.trackName} | ${videoData.artistName}` )
			.end()
		.find('.video-body')
			.empty()
			.append($image)
			.append($artist)
			.append($collection)
			.append($genre)
			.append($date);


	let $video = $('<video controls loop>').addClass('video').attr('id', 'myVideo'),
		$videoSource = $('<source>').attr({'src': videoData.previewUrl, 'type': 'video/mp4'});
	
	$videoHolderElement
		.empty()
		.append($video)
		.find('.video')
			.text('Your browser does not support the video tag.')
			.append($videoSource);
});

$('#myCarousel').on('slid.bs.carousel', function (event) {
	let video = $('#myVideo', this).get(0);
	video.pause();
})