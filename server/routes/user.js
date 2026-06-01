const { User } = require("../models/user")
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const authJwt = require("../middleware/authJwt");
router.post('/signup', async (req, res) => {
    const { name, email, password, phone } = req.body
    try {
        const existinguser = await User.findOne({ email: email })
        if (existinguser) {
            return res.status(400).json({ msg: "User already exist" });
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const result = await User.create({
            name: name,
            email: email,
            password: hashpassword,
            phone: phone,
        })
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);
        res.status(200).json({
            user: result,
            token: token

        })

    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ msg: `${field} already in use` });
        }
        res.status(500).json({ msg: "something went wrong" })
    }

})
// singin
router.post("/signin", async (req, res) => {
    const { email, password } = req.body
    try {
        const existinguser = await User.findOne({ email: email })
        if (!existinguser) {
            return res.status(404).json({ msg: "User not exist" });
        }
        const matchpass = await bcrypt.compare(password, existinguser.password)
        if (!matchpass) {
            return res.status(400).json({ msg: "Invalid Credentials" })
        }
        const token = jwt.sign({ email: existinguser.email, is: existinguser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY)
        res.status(200).json({
            user: existinguser,
            token: token,
            msg: "User Authenticated"

        })

    } catch (error) {
        console.log(error);
        res.status(500)
    }
});
// get all 

router.get("/", authJwt, async (req, res) => {

    try {

        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({ msg: "Error fetching users" });

    }

});
// get by id 
router.get("/:id", authJwt, async (req, res) => {

    try {

        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({ msg: "Error fetching user" });

    }

});
// delete
router.delete("/:id", authJwt, async (req, res) => {

    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User deleted"
        });

    } catch (error) {

        res.status(500).json({ msg: "Error deleting user" });

    }

});


// 
router.put("/:id", async (req, res) => {
    const { name, email, password, phone } = req.body
    try {
        const userexist = await User.findById(req.params.id)
        let newpassword
        if (req.body.password) {
            newpassword = bcrypt.hashSync(req.body.password, 10)
        }
        else {
            newpassword = userexist.password;
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                email: email,
                password: newpassword,
                phone: phone,

            },
            {
                new: true
            })
        if (!user) {
            return res.status(400).json({ msg: "user can not update" });
            res.send(user);
        }
    } catch (error) {

        res.status(500).json({ msg: "Error updating user" });

    }
})
module.exports = router;