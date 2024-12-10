import User from "../../Models/User.js"

export const authenticateIsAdmin = async (req, res, next) => {
    try {
        const adminUser = await User.findOne({ username: req.user.username, password: req.user.password, role: 'admin' });
        if (adminUser) {
            next()
        } else {
            res.status(404).json({ message: "User is not authorized for this action!!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Some error occured on server", error: error.message });
    }
}