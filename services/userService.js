// userService.js

const User = require('./../models/user');
const Campground = require('./../models/campgrounds');

async function getUserById(id) {
    try {
        return await User.findById(id).exec();
    } catch (error) {
        throw new Error(`Error fetching user with ID ${id} from the database.`);
    }
}

async function getCampgroundsByUserId(id) {
    try {
        return await Campground.find({ "author.id": id }).exec();
    } catch (error) {
        throw new Error(`Error fetching campgrounds for user with ID ${id} from the database.`);
    }
}

async function getAllUsers() {
    try {
        return await User.find({}).exec();
    } catch (error) {
        throw new Error('Error fetching all users from the database.');
    }
}

async function deleteUserById(id) {
    try {
        const campgrounds = await Campground.find({ 'author.id': id }).exec();

        for (const campground of campgrounds) {
            await campground.deleteOne().exec();
        }

        return await User.findByIdAndRemove(id).exec();
    } catch (error) {
        throw new Error(`Error deleting user with ID ${id} from the database.`);
    }
}

async function registerUser(username, name, contact, email, password) {
    try {
        const newUser = new User({ username, name, contact, email, password });
        await User.register(newUser, password);
        return newUser;
    } catch (error) {
        throw error;
    }
}

module.exports = {  getUserById, getCampgroundsByUserId, getAllUsers, deleteUserById, registerUser  };
