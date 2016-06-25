module.exports = function(data, $element, request, callback) {
	$element.text("Request query string: " + request.query);
	callback(data);
};
