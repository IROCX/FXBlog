// router.js
var express = require('express');
var router = express.Router();
const campgroundService = require('../services/campgroundService');
const { isLoggedIn, actionAuth } = require('../middlewares/authMiddleware');
const {
	INTERNAL_SERVER_ERROR,
	SECRET_ID,
} = require('./../middlewares/constants');
const logger = require('../models/logger');

router.get('/campgrounds', async (req, res) => {
	try {
		const campgrounds = await campgroundService.getAllCampgrounds();
		res.render('campgrounds/campgrounds', { campgrounds });
	} catch (error) {
		logger.error({ error }, 'Error in /campgrounds');
		res.status(500).send(INTERNAL_SERVER_ERROR);
	}
});

router.post('/campgrounds', isLoggedIn, async (req, res) => {
	try {
		const { name, image, description } = req.body;
		const sanitizedDescription = req.sanitize(description);
		const author = {
			id: req.user._id,
			username: req.user.username,
		};

		await campgroundService.createCampground(
			name,
			image,
			sanitizedDescription,
			author
		);

		res.redirect('/campgrounds');
	} catch (error) {
		res.status(500).send(INTERNAL_SERVER_ERROR);
	}
});

router.get('/campgrounds/add', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.get('/campgrounds/:id', async (req, res) => {
	try {
		const campgroundId = req.params.id;
		const foundCampground =
			await campgroundService.getCampgroundByIdWithComments(campgroundId);

		res.render('campgrounds/show', {
			foundCampground,
			SECRET_id: process.env[SECRET_ID],
		});
	} catch (error) {
		res.status(500).send(INTERNAL_SERVER_ERROR);
	}
});

router.get('/campgrounds/:id/edit', actionAuth, async (req, res) => {
	try {
		const campgroundId = req.params.id;
		const editCampground = await campgroundService.getCampgroundById(
			campgroundId
		);

		res.render('campgrounds/edit', { editCampground });
	} catch (error) {
		console.error(error.message);
		res.status(500).send(INTERNAL_SERVER_ERROR);
	}
});

router.put('/campgrounds/:id', actionAuth, async (req, res) => {
	try {
		const campgroundId = req.params.id;
		const updateData = req.body.updateData;

		// Uncomment the line below if you want to sanitize the description
		updateData.desc = req.sanitize(updateData.desc);

		await campgroundService.updateCampground(campgroundId, updateData);

		res.redirect(`/campgrounds/${campgroundId}`);
	} catch (error) {
		console.error(error.message);
		res.status(500).send(INTERNAL_SERVER_ERROR);
	}
});

router.delete('/campgrounds/:id', actionAuth, async (req, res) => {
	try {
		const campgroundId = req.params.id;

		await campgroundService.deleteCampgroundById(campgroundId);

		res.redirect('/campgrounds');
	} catch (error) {
		console.error(error.message);
		res.status(500).send(INTERNAL_SERVER_ERROR);
	}
});

router.post('/search', isLoggedIn, async (req, res) => {
	try {
		const searchedUser = req.body.user;
		const campgrounds = await campgroundService.searchCampgroundsByUser(
			searchedUser
		);

		res.render('campgrounds/searchtemplate', {
			searchedUser: campgrounds,
			searchKey: searchedUser,
		});
	} catch (error) {
		console.error(error.message);
		res.redirect('/campgrounds');
	}
});

module.exports = router;
