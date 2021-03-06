Router.route("/:friendlyUrl", {
    name: "showProductListByCategory",
    data: function () {
        categoryFriendlyUrl = this.params.friendlyUrl
        return categoryFriendlyUrl;
    }
});

/**
Dada una direccion URL amigable para la categoria deseada, catFriendlyUrl,
este metodo busca el arreglo de productos que corresponden a esa categoria
llamando al metodo getProductIndexArrayForCategoryFriendlyUrl del lado
del servidor.
*/
var getProductIndexArrayForCategoryId = function (catFriendlyUrl) {
    Session.set("isLoading", true);
    var array;
    var name = "categoryIndexData_" + catFriendlyUrl;
    array = Session.get(name);

    //console.log("Buscando indice de productos para la categoria " + catFriendlyUrl);

    if (valid(array)) {
        //console.log("  - Retornando arreglo en cache: " + array.length);
        Session.set("isLoading", false);
        return array;
    }

    console.log("  - Solicitando arreglo al servidor");
    if (!valid(Session.get(name))) {
        Meteor.call("getProductIndexArrayForCategoryFriendlyUrl", catFriendlyUrl,
            function (error, response) {
                if (valid(error)) {
                    console.log("Error: " + error);
                }
                else if (valid(response)) {
                    console.log("  - Retornando data del servidor");
                    var n;
                    n = "categoryIndexData_" + response.catFriendlyUrl;

                    if (valid(response.array) &&
                        valid(response.array.length) && response.array.length > 0) {
                        //console.log("  - Redefiniendo arreglo en cache: " + response.array.length);
                        Session.set(n, response.array);
                    }
                    else {
                        console.log("  - Error: Arreglo invalido o vacio");
                        Session.set(n, []);
                    }
                }
                Session.set("isLoading", false);
            });
    } else {
        Session.set("isLoading", false);
    }
    return Session.get(name);
}

Template.showProductListByCategory.helpers({
    /**
    Se retorna la URL amigable de la categoria actual
    */
    getCurrentCategoryFriendlyUrl: function () {
        return categoryFriendlyUrl;
    },
    /**
    Se obtienen un indice de productos para la categoria actual
    */
    getProductList: function () {
        return getProductIndexArrayForCategoryId(categoryFriendlyUrl);
    },
    /**
    Returna true si hay productos en la categoria actual y false si no
    */
    hasProducts: function () {
        var indexArray;

        indexArray = getProductIndexArrayForCategoryId(categoryFriendlyUrl);

        if (valid(indexArray)) {
            if (indexArray.length > 0) {
                return true;
            }
        }
        return false;
    },
    getCategory: function () {
        return ReactiveMethod.call("getCategoryForCategoryId", categoryFriendlyUrl);
    },
    isLoading: function (productList) {
        return Session.get("isLoading");
    }
});
