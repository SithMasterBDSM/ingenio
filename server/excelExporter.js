var addRowToWorksheet = function(ws, data, range, row, excel)
{
    var column;
    for ( column = 0; column != data.length; column++ ) {
        if ( range.e.c < column ) {
            range.e.c = column;
        }

        // Create cell object: .v is the actual data */
        var cell = { v: data[column] };
        if ( cell.v == null ) {
            continue;
        }

        // Determine the cell type
        if ( typeof cell.v === 'number' ) {
            cell.t = 'n';
        }
        else if ( typeof cell.v === 'boolean' ) {
            cell.t = 'b';
        }
        else {
            cell.t = 's';
        }

        // Format cell
        cell.s =  { 
            patternType: "solid",
            fgColor: "FFFF0000",
            bgColor: "FF000000" ,
            top: {style: "thick", color: "FFFFFF00"}
        };
        cell.c = "huy";

        // Write cell
        var cellIndex = excel.utils.encode_cell({c:column, r:row});
        ws[cellIndex] = cell;
    }
}

getReferenceFromName = function(n)
{
    var i;
    var r = "";
    n = n.trim();

    for ( i = 0; i < n.length; i++ ) {
        var c = n.charAt(i);
        if ( c === " " || c === "-" ) {
            return r;
        }
        r = r + c;
    }
    return n.substring(0, 4);
}

web2utf = function(w)
{
    var u = w.trim();
    u = u.replace("&aacute;", "á");
    u = u.replace("&eacute;", "é");
    u = u.replace("&iacute;", "í");
    u = u.replace("&oacute;", "ó");
    u = u.replace("&uacute;", "ú");
    u = u.replace("&ntilde;", "ñ");
    u = u.replace("&Aacute;", "Á");
    u = u.replace("&Eacute;", "É");
    u = u.replace("&Iacute;", "Í");
    u = u.replace("&Oacute;", "Ó");
    u = u.replace("&Uacute;", "Ú");
    u = u.replace("&Ntilde;", "Ñ");
    return u;
}

getName = function(nw)
{
    var n = web2utf(nw);
    var i;
    var r = "";
    var c;

    for ( i = 0; i < n.length; i++ ) {
        c = n.charAt(i);
        if ( c == ' ' || c == '-' ) {
            break;
        }
        r = r + c;
    }

    var start = r.length;
    for ( i = r.length; i < n.length; i++ ) {
        c = n.charAt(i);
        if ( c == ' ' || c == '-' ) {
            start++;
        }
        else {
            break;
        }
    }

    var na = "";
    for ( i = start; i < n.length; i++ ) {
        c = n.charAt(i);
        if ( c !== "." ) {
            na += c;
        }
    }
    return na;
}

createWorkbookFromMarpicoData = function(excel)
{
    // Access database
    var marPicoProduct = global["marPicoProduct"];
    var marPicoCategory = global["marPicoCategory"];
    var cursor = marPicoProduct.find();

    // 1. Create worksheet and workbook
    var ws = {}
    var wb = {}
    wb.Sheets = {};
    wb.Props = {};
    wb.SSF = {};
    wb.SheetNames = [];

    // Range will keep growing to fit complete data
    var range = {s: {c:0, r:0}, e: {c:0, r:0}};
    var i;
    var row = 0;
    var data;

    // Prepare data
    var maxNumberOfVariants = 0;
    var maxNumberOfCategories = 0;
    var totalVariantsCounter = 0;
    cursor.forEach(function(p) {
        var n = p.arrayOfVariants.length;
        if ( maxNumberOfVariants < n ) {
            maxNumberOfVariants = n;
        }
        totalVariantsCounter += n;
        n = p.arrayOfparentCategoriesId;
        if ( maxNumberOfCategories < n ) {
            maxNumberOfCategories = n;
        }
    });
    console.log("Total variants: " + totalVariantsCounter);
    console.log("Max variants per product: " + maxNumberOfVariants);

    // Fill header
    data = [];
    data.push("LISTADO DE PRODUCTOS GENERADO AUTOMÁTICAMENTE http://test.ingenio-promocionales.com/exportDatabaseToExcel");
    addRowToWorksheet(ws, data, range, row, excel);
    row++;

    data = [];
    data.push("PROVEEDOR");
    data.push("REFERENCIA DEL PROVEEDOR");
    data.push("NOMBRE DE PRODUCTO PROVEEDOR");
    data.push("REFERENCIA INGENIO");
    data.push("NOMBRE DE PRODUCTO INGENIO");
    data.push("DESCRIPCIÓN");
    data.push("TIPO DE MARCACIÓN CON LA QUE VA EL PRECIO");
    data.push("CATEGORÍA DEL PROVEEDOR (1)");
    data.push("SUBCATEGORÍA DEL PROVEEDOR (1)");
    data.push("CATEGORÍA INGENIO");
    data.push("SUBCATEGORÍA INGENIO (1)");
    data.push("SUBCATEGORÍA INGENIO (2)");
    data.push("SUBCATEGORÍA INGENIO (3)");
    data.push("PRODUCTO NUEVO");
    data.push("PRECIO PROVEEDOR");
    data.push("DESCUENTO DE PROMOCIÓN");
    data.push("DISPONIBILIDAD");
    data.push("20");
    data.push("50");
    data.push("100");
    data.push("200");
    data.push("300");
    data.push("500");
    data.push("1000");
    data.push("2000");
    data.push("3000");
    data.push("4000");
    data.push("5000");
    data.push("10000");
    for ( i = 0; i < maxNumberOfVariants; i++ ) {
        data.push("REFERENCIA COLOR PROVEEDOR " + "(" + (i+1) + ")");
        data.push("COLOR/VARIANTE " + "(" + (i+1) + ")");
        data.push("REFERENCIA COLOR INGENIO " + "(" + (i+1) + ")");
        data.push("CANTIDAD EN INVENTARIO" + "(" + (i+1) + ")");
    }
    addRowToWorksheet(ws, data, range, row, excel);
    row++;

    // Fill data
    cursor.forEach(function(p) {
        //console.log("  - Product: " + p.name);
        if ( range.e.r < row ) {
            range.e.r = row;
        }

        data = [];
        data.push("MarPico");
        data.push(getReferenceFromName(p.name));
        data.push(getName(p.name));
        data.push("ING" + (1000+row-1));
        data.push("ING" + (1000+row-1) + " " + getName(p.name));
        data.push(web2utf(p.description));

        data.push("Marcación");
        data.push("Catp");
        data.push("Subcat");
        data.push("Cat ing");
        data.push("Subcat (1)");
        data.push("Subcat (2)");
        data.push("Subcat (3)");
        data.push("no sabemos");
        data.push("Precio");
        data.push("0%");
        data.push("?");
        data.push("20");
        data.push("50");
        data.push("100");
        data.push("200");
        data.push("300");
        data.push("500");
        data.push("1000");
        data.push("2000");
        data.push("3000");
        data.push("4000");
        data.push("5000");
        data.push("10000");

        for ( i = 0; i < p.arrayOfVariants.length; i++ ) {
            var v = p.arrayOfVariants[i];
            data.push(v.reference);
            data.push(web2utf(v.description));
            data.push("ING" + (1000+row-1) + "_" + (i+1));
            data.push(v.quantityTotal);
        }

        addRowToWorksheet(ws, data, range, row, excel);
        row++;
    });
    ws['!ref'] = excel.utils.encode_range(range);
    
    var wscols = [
        {wch:9},
        {wch:7},
        {wch:30},
        {wch:6},
        {wch:27},
        {wch:22}
    ];
    ws['!cols'] = wscols;

    var json;
    json = excel.utils.sheet_to_json(ws);
    console.log("JSON: " + json.length);
    console.log(json[0]);


    // Add worksheet to workbook
    wb.SheetNames.push("Ingenio");
    wb.Sheets["Ingenio"] = ws;
    return wb;
}
