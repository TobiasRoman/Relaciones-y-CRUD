const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { promiseImpl } = require('ejs');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include : [{association: "actors"}]
        })
            .then(movies => {
                res.send(movies)
                /*res.render('moviesList.ejs', {movies})*/
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        Genres.findAll()
        .then(allGenres => {
            res.render("moviesAdd", {
                allGenres
            })
        })
        .catch(error => (error))
        
    },
    create: function (req,res) {

    },
    edit: function(req,res) {
        const genresPromise = Genres.findAll()
        const moviePromise = Movies.findByPk(+req.params.id)
        promiseImpl.all([genresPromise, moviePromise])// MIRAR DE NUEVO 
        .then(([allGenres,Movie]) =>{
            res.render("moviesEdit")
        })

    },
    update: function (req,res) {

    },
    delete: function (req,res) {

    },
    destroy: function (req,res) {
        Movies.destroy({
            where: req
        })

    }
}

module.exports = moviesController;