const mongoose = require('mongoose');
const User = mongoose.model('user');

async function createUsers() {
    // Add admin user
    try {
        const admin = await User.findOne({ username: 'admin' });
        if (admin) console.log('Admin user already exists!');
        else {
            const newAdmin = new User({
                username: 'admin',
                password: 'admin',
                email: 'admin@email.com',
                role: 'ADMIN'
            });
            await newAdmin.save();
            console.log('Admin user created');
        }
    } catch (error) {
        console.error('Error during user creation: ', error);
    }

    // Add default user
    try {
        const user = await User.findOne({ username: 'user' });
        if (user) console.log('Default user already exists!');
        else {
            const newUser = new User({
                username: 'user',
                password: 'user',
                email: 'user@email.com',
                role: 'DEFAULT'
            });
            await newUser.save();
            console.log('Default user created');
        }
    } catch (error) {
        console.error('Error during user creation:  ', error);
    }
}

module.exports = createUsers;