Template.productCategoryIndexList.helpers({
    extractIdFromObjectID: function (oid) {
        return ("" + oid);
    }
});

Template.productCategoryIndexList.events({
     // Desactivado por solicitud de Alexis
    /*
    "click .productCategoryMenuOption": function (event, template) {
        event.preventDefault();
        var catId = ("" + event.target.getAttribute("data-id"));
        Meteor.call("getSubcategoriesByCategoryId", catId, function (error, children) {
            if (!valid(error) && valid(children)) {
                var html = "";
                html += '<ul class="sub-cat">';
                var i;
                for (i in children) {
                    html += '<li><a class="link-a" href="/' + children[i].friendlyUrl + '">' + children[i].nameSpa + '</a></li>';
                }
                html += '</ul>';
                document.getElementById(catId).innerHTML = html;
            } else {
                document.getElementById(catId).innerHTML = "No se encontraron subcategorias.";
            }
        });
    }
    */
});
