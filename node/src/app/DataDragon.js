import $ from 'jquery';

//Manages
// - window.dd (datadragon info)
// - window.dat (json blob collection)
export default class DataDragon {
	//Begins the flow for rerouting the update. Returns a jquery promice that you can
	// .then(f()) off of.
	//
	//All other functions are just to help this one.
	//
	//Start request for the realm json
	//.then drop down ddragon info
	//.then for each of the points of data
	//   Start request for items
	//   requests.map($.when).then(()=>callback)
	static update(realm=null, language=null, callback=null) {
		$.when(DataDragon.setDataDragon(realm))
		 .done(()=>{
		 		console.log("DataDragon updated")
		  	$.when(...DataDragon.setLanguage(language))
		  	 .done(()=>{
		  	 	console.log("Finished getting language data")
		  	 	if(callback) {callback()}
		  	 })
		 })
	}

	static setDataDragon(realm) {
		realm = realm || localStorage.getItem('dd_realm') || 'na'
		localStorage.setItem('dd_realm', realm)
		return $.getJSON(`json/realm_${realm}.json`, DataDragon.updateDataDragon)
	}

	static updateDataDragon(payload) {
		window.dd = {
			cdn: payload.cdn,
			version: payload.dd,
			language: localStorage.getItem('dd_language'),
			version: payload.v
		}
	}

	static setLanguage(language) {
		language = language || localStorage.getItem('dd_language') || 'en_US'
		localStorage.setItem('dd_language', language)
		window.dd.language = language

    //List all the jsons we're going to get
    let dataPoints = ['items', 'champions', 'languages']

    return dataPoints.map(DataDragon.requestData)
	}

	static requestData(dataPoint) {
		return $.getJSON(
			`json/${window.dd.language}/${dataPoint}.json`,
			(blob) => DataDragon.updateData(dataPoint, blob)
		)
	}

	static updateData(dataPoint, blob) {
		window.dat = window.dat || {}
		window.dat[dataPoint] = blob
	}



}