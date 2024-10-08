const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid");
            } else {
                const currentUser = User.findById(user._id).select('-password');
                req.user = currentUser;
                next();
            }
        })
    } else {
        return res.status(401).json("You are currently not authenticated! Please Login");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            res.status(403).json("You are not authorized to do this!");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Only Admins can do this!");
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization };