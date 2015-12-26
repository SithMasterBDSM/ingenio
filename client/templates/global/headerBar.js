Template.headerBar.events({
	/**
    Esta función se llama cuando en la barra de navegación un usuario anónimo
    da click en el enlace de crear un nuevo usuario registrado.
	*/
	"click #registerNewUser": function(event, template)
	{
        event.preventDefault();
        $("#userRegistrationModalDialog").modal("show");
	},
	/**
    Esta función se llama cuando un usuario registrado en sesión activa
    desea salir de la sesión.
	*/
	"click #logoutUser": function(event, template)
	{
        event.preventDefault();
        globalLogout();
	}
});
