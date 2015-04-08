/*

script.js file for Eventbrite coding challenge
Margaret Feltz
March 2015

*/
var url = 'https://www.eventbriteapi.com/v3/events/search/',
		
		/* Data to search or when using the api, getting
		   events specific to the venue city and region */
		data = {
			'venue.city': null,  // CHANGE
			'venue.region': (null || "").toUpperCase(), // CHANGE
			'token': 'BKKRDKVUVRC5WG4HAVLT',
			'popular': true,
			'start_date.keyword': 'this_week'
		},

		/* 
		   appendEvent
		   Function to append a new event to the event list in extension
		   Creates a new li for each new event 
		*/
		appendEvent = function(event) {
			var $eventItem = $(document.createElement('li')),
				event_url = event.url,
				name = event.name.text,
				desc = descriptionCheck(event),
				logo_url = event.logo_url;
			if(desc && desc.length > 300) {
				desc = desc.substring(0,150) + "...";
			}

			//creating events for eventList
			$eventItem.addClass('eventItem');
			$eventItem.append('	<div id="title">\
									<a href="' + event_url + '"><img id="logo_img" src="' + logo_url + '"\/></a>\
									<a id="nameDiv" href="' + event_url + '">' + name + '</a>\
								</div>');
			$eventItem.append('<p id="theDate">' + moment(event.created).format("MMM D YY") + '</p>');
			$eventItem.append('<p id="description">' + desc + '</p>');

			return $eventItem;
		},

		/* descriptionCheck
		   Checks that description is not null to avoid fault */
		descriptionCheck = function(event) {
			if (event.description == null){
				return " ";
			}
			else {
				return event.description.text;
			}
		},

		/* getEvents
		   getEvents makes the ajax call to the API calls appendEvent to create
		   the event list */
		getEvents = function() { // called by event handler on button
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'JSON',
				data: data
			}).done(function(results) {
				if (results.pagination.object_count === 0) {
					//creating error statement
					var $eventList = $('#eventList');
					$eventList.empty();
					var $eventError = $(document.createElement('div'));
					$eventError.append('<h2>' + "No Events Found" + '</h2>');
					$eventError.append('<h3>' + "Check city spelling" + '</h3>');
					$eventError.append('<h3>' + "State abbreviation uppercase (ex. CT, MA, etc.)" + '</h3>');
					$eventList.append($eventError);
					$eventList.show();
				} else {
					var $eventList = $('#eventList');
					//delete current eventList
					$eventList.empty();

					results.events.forEach(function(event) { // calls each event
						var $eventItem = appendEvent(event);

						//appends each event created to eventList
						$eventList.append($eventItem);
					});
					$eventList.show();
				}
			});

		},

		/* validLocation checks to see if user has entered a city and state*/
		validLocation = function() {
			/*
				- both are not empty
				- State is only 2 letters
			*/
			if(!data["venue.city"] || !data["venue.region"]) {
				return false;
			}
			if(data["venue.region"].length != 2) {
				return false;
			}
			
			return true; // TURN OFF
		};

/* page and functions render upon clicking the "Find Events!" button */
$('#findEvents').bind('click', function() {
	//setting desired city and state of event
	data["venue.city"] = $('#city-name').val();
	data["venue.region"] = $('#state-abbrev').val();

	if (validLocation()) {
		getEvents();
	} else {
		//creating error statement
		var $eventList = $('#eventList');
		$eventList.empty();
		var $eventError = $(document.createElement('div'));
		$eventError.append('<h2>' + "Invalid input" + '</h2>');
		$eventList.append($eventError);
		$eventList.show();
	}
});
