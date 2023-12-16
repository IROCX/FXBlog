// campgroundService.js

const Campground = require('./../models/campgrounds');

async function getAllCampgrounds() {
    try {
        return await Campground.find({});
    } catch (error) {
        throw new Error('Error fetching campgrounds from the database.');
    }
}

async function createCampground(name, image, description, author) {
    try {
        const newCampground = await Campground.create({ name, image, description, author });
        console.log('New Campground Created:', newCampground);
        return newCampground;
    } catch (error) {
        throw new Error('Error creating a new campground in the database.');
    }
}

async function getCampgroundById(id) {
    try {
        return await Campground.findById(id).exec();
    } catch (error) {
        throw new Error(`Error fetching campground with ID ${id} from the database.`);
    }
}

async function getCampgroundByIdWithComments(id) {
    try {
        return await Campground.findById(id).populate('comments').exec();
    } catch (error) {
        throw new Error(`Error fetching campground with ID ${id} from the database.`);
    }
}

async function updateCampground(id, updateData) {
    try {
        return await Campground.findByIdAndUpdate(id, updateData, { new: true }).exec();
    } catch (error) {
        throw new Error(`Error updating campground with ID ${id} in the database.`);
    }
}

async function deleteCampgroundById(id) {
    try {
        const campground = await getCampgroundById(id);

        for (const commentId of campground.comments) {
            await Comment.findByIdAndDelete(commentId).exec();
        }

        return await campground.deleteOne().exec();
    } catch (error) {
        throw new Error(`Error deleting campground with ID ${id} from the database.`);
    }
}

async function searchCampgroundsByUser(username) {
    try {
        return await Campground.find({ 'author.username': username }).exec();
    } catch (error) {
        throw new Error(`Error searching campgrounds by username ${username} from the database.`);
    }
}

module.exports = { getAllCampgrounds, createCampground, getCampgroundByIdWithComments,  getCampgroundById,
    updateCampground, deleteCampgroundById, searchCampgroundsByUser };
