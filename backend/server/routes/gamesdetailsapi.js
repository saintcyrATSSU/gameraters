const url = 'https://games-details.p.rapidapi.com/single_game/730';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '417d64baecmsh79798f9984757ebp1fd1f6jsn82142ba39f42',
		'x-rapidapi-host': 'games-details.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}