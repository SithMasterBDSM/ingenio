Router.route("/manageProductCategory", {
    name: "manageProductCategory",
    loadingTemplate: "manageProductCategoryLoading",
    data: function () {
        var options = { "sort": [["nameSpa", "asc"]] };
        productCategoryCursor = productCategory.find({}, options);
    },
    waitOn: function () {
        return Meteor.subscribe("productCategory") && Meteor.subscribe("product2category");
    }
});

Template.manageProductCategory.helpers({
    dbProductCategory: function () {
        return productCategoryCursor;
    }
});

Template.manageProductCategory.events({
    "submit #addNewProductCategoryForm": function (event, template) {
        event.preventDefault();
        var n = event.target.identifier.value;
        var root;
        var oid;

        root = productCategory.findOne({ nameSpa: "/" });
        if (!valid(root)) {
            oid = new Mongo.ObjectID();
            productCategory.insert({ _id: oid, nameSpa: "/", parentCategoryId: null });
            root = productCategory.findOne({ nameSpa: "/" });
            if (!valid(root)) {
                console.log("ERROR: No se encuentra root");
                return;
            }
        }

        var parent;
        var baseName = event.target.parentCategories.value;
        parent = ("" + baseName).substring(10, 34);
        parent = "ObjectID(\"" + parent + "\")";

        if (!valid(parent) || baseName === "null") {
            parent = root._id;
        }

        oid = new Mongo.ObjectID();
        productCategory.insert({ _id: oid, nameSpa: n, parentCategoryId: parent });
        getTopLevelProductCategories();
    },
    "submit .categoryDelete": function (event, template) {
        event.preventDefault();

        productCategory.remove(this._id);
        getTopLevelProductCategories();
    },
    "keyup .editCategoryName": function (event, template) {
        event.preventDefault();

        if (!valid(this._id) || !valid(event.target.value)) {
            return false;
        }

        var prev = productCategory.findOne({ nameSpa: event.target.value, _id: { $ne: this._id } });

        if (!valid(prev)) {
            productCategory.update(this._id, { $set: { nameSpa: event.target.value } });
            getTopLevelProductCategories();
            event.target.style.color = "#000000";
        }
        else {
            event.target.style.color = "#ff0000";
        }
    },
    "keyup .editFriendlyUrl": function (event, template) {
        event.preventDefault();

        if (!valid(this._id) || !valid(event.target.value)) {
            return false;
        }
        newUrl = event.target.value;

        var prev = productCategory.findOne({ friendlyUrl: newUrl, _id: { $ne: this._id } });

        if (!valid(prev)) {
            productCategory.update(this._id, { $set: { friendlyUrl: newUrl } });
            getTopLevelProductCategories();
            event.target.style.color = "#000000";
        }
        else {
            event.target.style.color = "#ff0000";
        }
    },
    "change .parentCategories": function (event, template) {
        event.preventDefault();
        var elementData = event.target.value;

        Meteor.call("changeProductCategories", elementData, function (error, value) {
            getTopLevelProductCategories();
        });
    }
});

Template.categorySelectionChange.helpers({
    containerIsParent: function (container, subjectBeingTested) {
        if (!valid(container) || !valid(subjectBeingTested) ||
            !valid(subjectBeingTested.parentCategoryId) || !valid(container._id)) {
            return false;
        }

        var sid = "" + subjectBeingTested.parentCategoryId;
        if (sid.indexOf("ObjectID(") > -1) {
            sid = sid.substring(10, 34);
        }
        var cid = "" + container._id;
        if (sid === cid) {
            return true;
        }
        return false;
    },
    notItself: function (container, subjectBeingTested) {
        if (!valid(container) || !valid(subjectBeingTested)) {
            return false;
        }

        var sid = "" + subjectBeingTested;
        if (sid.indexOf("ObjectID(") > -1) {
            sid = sid.substring(10, 34);
        }

        var cid = "" + container;
        if (cid.indexOf("ObjectID(") > -1) {
            cid = cid.substring(10, 34);
        }

        if (sid === cid) {
            return false;
        }
        return true;
    },
    isRootOrNull: function () {
        var rid = Session.get("rootProductCategoryId");
        if (!valid(rid) || !valid(this) || !valid(this._id)) {
            return true;
        }
        rid = "" + rid;
        var tid = ("" + this._id);
        if (tid === rid) {
            return true;
        }
        return false;
    }
});
