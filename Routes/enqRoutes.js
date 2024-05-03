const express = require("express");
const { createEnquire, updateEnquire, deleteEnquire, getEnquire, getEnquireById } = require("../controller/enqCtrl");
const router = express.Router();

router.post('/',createEnquire);
router.put('/update/:id',updateEnquire);
router.delete('/delete/:id', deleteEnquire);
router.get("/get",getEnquire)
router.get("/get/:id",getEnquireById);




module.exports=router;