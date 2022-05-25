const express = require("express");
const mongoose = require("mongoose");
const functions = require("../database/functions");
const Report = require("../models/Report");
const validationRouter = express.Router();

/**
 * @api {post} /validation/<health_zone_id>/reports/validate validate a report
 */
validationRouter.post("/reports/validate", async (req, res) => {
  // verify user
  if (!req.user) {
    res.status(401).send("Unauthorized user error");
    return;
  }

  // make sure they are admin
  if (req.user.user.role.toLowerCase() !== "admin") {
    res.status(401).send("Authorized user must be an admin");
    return;
  }

  try {
    const id = mongoose.Types.ObjectId(req.body._id);
    const validatedReport = await Report.findByIdAndUpdate(
      id,
      { is_validated: true },
      { new: true }
    );
    res.status(200).send(validatedReport);
  } catch (err) {
    console.log("Error occurred when validating report: " + err.message);
    res.status(500).send({
      message: err.message || "Some error occurred when validating report."
    });
  }
});

/**
 * @api {post} /validation/<health_zone_id>/reports
 */
validationRouter.get("/:health_zone_id/reports", (req, res) => {
  // verify user
  if (!req.user) {
    res.status(401).send("Unauthorized user error");
    return;
  }

  // make sure they are admin
  if (req.user.user.role.toLowerCase() !== "admin") {
    res.status(401).send("Authorized user must be an admin");
    return;
  }

  const health_zone_id = req.params.health_zone_id;
  // good test 1 - 618b21eb8453970bd916764c

  // call helper function
  functions.getForms(health_zone_id, "unvalidated", (err, result) => {
    if (err == null) {
      res.status(200).send(result);
    } else {
      console.log("Error getting forms for health zone: " + err);
      res.status(500).send({
        message: err.message || "Some error occurred while receiving forms."
      });
    }
  });
});

module.exports = validationRouter;
