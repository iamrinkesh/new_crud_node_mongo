const express = require('express');
const router = express.Router();
const EventModel = require('../models/events');
const multer = require('multer');
const fs = require('fs');

var storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, './public/uploads');
    },
    filename: (req, file, cb)=>{
        if (file.fieldname === "event_logo"){
            cb(null, file.fieldname+"_"+file.originalname);
        }else if (file.fieldname === "client_logo"){
            cb(null, file.fieldname+"_"+file.originalname);
        }
    }
});

var upload = multer({
    storage: storage,
}).fields([{
    name: 'event_logo', maxCount: 1
  }, {
    name: 'client_logo', maxCount: 1
  }]);


router.post('/add-event', upload, async (req, res)=>{
    // console.log(req.files.event_logo);
    // console.log(req.files.client_logo);
    const event = new EventModel({
        event_name : req.body.event_name,
        start_date : req.body.start_date,
        end_date : req.body.end_date,
        event_location : req.body.event_location,
        event_logo : req.files.event_logo[0].filename,
        company_name : req.body.company_name,
        email : req.body.email,
        phone : req.body.phone,
        address : req.body.address,
        client_logo : req.files.client_logo[0].filename
        
    });
    await event.save((err)=>{
        if (err) {
            res.json({message : err.message, type: 'danger'});
        }else{
            req.session.message = {
                type : 'success',
                message : 'Event added successfully!'
            }
            res.redirect('/');
        }
    })
});

router.get('/', function (req, res) { 
    EventModel.find().exec((err, events)=>{
        if (err) {
            res.json({message : err.message, type: 'danger'});
        }else{
            res.render('index', {
                pageTitle: 'Home page!', 
                path : '/',
                events : events
            })
        }
    });
});

router.get('/add-event', function (req, res) { 
    res.render('add-event', {
        pageTitle: 'Add Event!', 
        path : '/add-event'})
});

router.get('/edit-event/:id', function (req, res) { 
    let id = req.params.id;
    EventModel.findById(id, (err, event) => {
        if (err) {
            res.redirect('/');
        }else {
            if(event == null){
                res.redirect('/');
            }else {
                res.render('edit-event', {
                    pageTitle: 'Edit Event!', 
                    event: event, 
                    path : '/edit-event'
                })
            }
        }
    }) 
});

router.post('/update-event/:id', upload, async (req, res)=>{ 
    let id = req.params.id;
    let new_event_logo = '';
    let new_client_logo = '';
    if(req.files.event_logo) {
        new_event_logo = req.files.event_logo[0].filename;
        try {
            fs.unlinkSync('.public/uploads/'+req.body.old_event_logo);
        }catch(err){
            console.log(err);
        }
    }else{
        new_event_logo = req.body.old_event_logo;
    }
    if(req.files.client_logo){
        new_client_logo = req.files.client_logo[0].filename;
        try {
            fs.unlinkSync('.public/uploads/'+req.body.old_client_logo);
        }catch(err){
            console.log(err);
        }
    }else{
        new_client_logo = req.body.old_client_logo;
    }

    EventModel.findByIdAndUpdate(id, {
        event_name : req.body.event_name,
        start_date : req.body.start_date,
        end_date : req.body.end_date,
        event_location : req.body.event_location,
        event_logo : new_event_logo,
        company_name : req.body.company_name,
        email : req.body.email,
        phone : req.body.phone,
        address : req.body.address,
        client_logo : new_client_logo
    }, 
    (err, result) => {
        if (err) {
            response.json({ message : err.message, type: 'danger' });
        }else{
            req.session.message = {
                type: 'success',
                message: 'Event Updated Successfully!'
            }
            res.redirect('/');
        }
    })
});

router.get('/delete-event/:id', (req, res) => {
    let id = req.params.id;
    EventModel.findByIdAndRemove(id, (err, result) => {
        if(result.event_logo != ''){
            try {
                fs.unlinkSync('.public/uploads/'+result.event_logo);
            }catch(err) {
                console.log(err);
            }
        }
        if(result.client_logo != ''){
            try {
                fs.unlinkSync('.public/uploads/'+result.client_logo);
            }catch(err) {
                console.log(err);
            }
        }
        if(err){
            res.json({message:err.message, type:'danger'})
        }else{
            req.session.message = {
                type : 'info',
                message : 'Event Deleted Successfully!'
            }
            res.redirect('/');
        }
    });
});

module.exports = router;