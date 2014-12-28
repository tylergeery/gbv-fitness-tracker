// Okay Ty, let's try to write some decent Javascript

$('#submit_register').off('click').on('click', function() {
	var error,
		username = $('#username').val(),
		email = $('#email').val(),
		password = $('#password').val(),
		confirmPassword = $('#confirm-password').val();

	$('.error').remove();

	if(!username) {
		error = 'Please enter a username';
	} else if(!email) {
		error = 'Please enter an email';
	} else if(!password) {
		error = 'Please enter a password';
	} else if (password !== confirmPassword) {
		error = 'Those passwords do not match';
	}

	if(!!error) {
		$('#register_form').prepend('<p class="error seven columns">'+error+'</p>');
		return false;
	}
});