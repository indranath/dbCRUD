
// *********************************************************************************
//
//   dbCRUD: Smart, flexible, automated CRUD for MySQL
//
//   Copyright(c) 2012 John Roers <jroers@gmail.com>, MIT Licensed
//
// *********************************************************************************

module.exports.extend = function(db)
{
    db.addRoutes = function(app, userFunction)
    {
        if (userFunction) {
            db.getUserIdFunction = userFunction;
        }
        for (var tableName in db.model)
        {
            db.addGet(app, tableName);
            db.addGetById(app, tableName);
            db.addPost(app, tableName);
            db.addPut(app, tableName);
            db.addDelete(app, tableName);
        }
    };
    
    db.addGet = function(app, tableName)
    {
        var getFunction = function(request, response)
        {
            var userField = db.getUserIdField(db.model[tableName]);
            //if (userField) {
            //    db.select({ from: db.model[tableName], where: { field: db.model[tableName][userField], equals: db.getUserId() } }, response);
            //} else {
                db.select({ 
                    from: db.model[tableName],
                    start: request.query.start,
                    limit: request.query.limit
                }, response);
            //}
        };
        
        app.get('/' + tableName, getFunction);
    };
    
    db.addGetById = function(app, tableName)
    {
        app.get('/' + tableName + '/:id', function(request, response)
        {
            db.fetchTree(db.model[tableName], request.params.id, response);
        });
    };
    
    db.addPost = function(app, tableName)
    {
        app.post('/' + tableName + '/', function(request, response)
        {
            db.saveTree(db.model[tableName], request.body, response);
        });
        app.post('/' + tableName, function(request, response)
        {
            db.saveTree(db.model[tableName], request.body, response);
        });
    };
    
    db.addPut = function(app, tableName)
    {
        app.put('/' + tableName + '/:id', function(request, response)
        {
            db.saveTree(db.model[tableName], request.body, response);
        });
        app.put('/' + tableName, function(request, response)
        {
            db.saveTree(db.model[tableName], request.body, response);
        });
    };

    db.addDelete = function(app, tableName)
    {
        app.delete('/' + tableName + '/:id', function(request, response)
        {
            request.body._destroy = 1;
            db.saveTree(db.model[tableName], request.body, response);
        });
    };

    return db;
};
