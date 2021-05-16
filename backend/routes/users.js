const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

// @route POST api/users
// @desc Register user
// @access Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check(
      "password",
      "Password length must be atleast 8 characters!"
    ).isLength({ min: 8 })
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      
      let user = await User.findOne({ email });
      if (user) {
        
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // save user
      //console.log("jkwdhfkwe");
      await user.save(function(err,result){
        if (err){
            console.log(err);
        }
        else{
            console.log(result)
            
        }
      });
      
      const payload = {
        user: {
          id: user.id
        },
      };

      // Return jsonwebtoken
      jwt.sign(
        payload,
        "my-secret-key",
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            // return res.json({ token });
            // localStorage.setItem=('token',token)
            // console.log(localStorage.getItem('token'))

            res.cookie('token', token , {
              expires: new Date(Date.now() + 900000),
              httpOnly: true
            });
            return res.redirect("/login");

          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

module.exports = router;
