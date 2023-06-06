var config = require("../config");
var pgp = require("pg-promise")();
var db = pgp(config.getDbConnectionString());
module.exports = function (app) {
    app.get("/api/continent", function (req, res) {
        res.set('Access-Control-Allow-Origin', '*')

        db.any("SELECT DISTINCT continent FROM public.country ORDER BY continent ASC;")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any room",
                    error: err,
                });
            });
    });


    app.get("/api/country/city/continent", function (req, res) {
        db.any(`SELECT c.name AS country_name, ct.name AS capital, c.continent
        FROM country c
        JOIN city ct ON c.capital = ct.id
        ORDER BY c.continent ASC;`)
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any room",
                    error: err,
                });
            });
    });



    app.get("/api/city/:id_number", function (req, res) {
        db.any(
            `SELECT ct.id As city_ID, c.name AS country_name, 
            ct.name AS capital, c.continent, ct.population, ct.district
            FROM country c
            JOIN city ct ON c.capital = ct.id
            where ct.id =` + req.params.id_number
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });


    app.get("/api/city/name/:city_name", function (req, res, next) {
        db.any(
            `SELECT ct.id As city_ID, c.name AS country_name, 
            ct.name AS capital, c.continent, ct.population, ct.district
            FROM country c
            JOIN city ct ON c.capital = ct.id
            where ct.name = $1`,
            [req.params.city_name]
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });


    app.get("/api/country/country_code/:country_code", function (req, res, next) {
        res.set('Access-Control-Allow-Origin', '*')
        db.any(
            `SELECT c.code, c.name AS country_name, ct.name AS capital, ct.district, 
            ct.population, c.continent, c.surfacearea, c.indepyear, c.population, 
            c.lifeexpectancy, c.gnp, c.gnpold, c.localname, c.governmentform, 
            c.headofstate, c.code2
     FROM country c
     JOIN city ct ON c.capital = ct.id
     WHERE c.code = $1`,
            [req.params.country_code]
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });


    app.get("/api/country/country_name/:country_name", function (req, res, next) {
        res.set('Access-Control-Allow-Origin', '*')
        db.any(
            `SELECT DISTINCT name 
            FROM public.country 
            WHERE continent = $1`,
            [req.params.country_name]
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });


    app.get("/api/country/current_country_name/:current_country_name", function (req, res, next) {
        res.set('Access-Control-Allow-Origin', '*')
        db.any(
            `SELECT c.code, c.name AS country_name, ct.name AS capital, ct.district, 
            ct.population, c.continent, c.surfacearea, c.indepyear, c.population, 
            c.lifeexpectancy, c.gnp, c.gnpold, c.localname, c.governmentform, 
            c.headofstate, c.code2
     FROM country c
     JOIN city ct ON c.capital = ct.id
     WHERE c.name = $1`,
            [req.params.current_country_name]
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });


};
