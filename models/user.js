//[SECTION] Modules and Dependencies
const mongoose = require('mongoose');

//[SECTION] Schema/Blueprint 
	const userSchema = new mongoose.Schema({
		firstName: {
			type: String,
			required: [true, 'First Name is Required']
		},
		lastName: {
			type: String,
			required: [true, 'Last Name is Required']
		},
		email: {
			type: String,
			required: [true, 'Email is Required']
		},
		password: {
			type: String,
			required: [true, 'Password is Required']
		},
		isAdmin: {
			type: Boolean,
			default: true
		},
		mobileNo: {
			type: String,
			required: [true, 'Mobile Number is Required']
		},
		enrollments: [
		   {
		   	  courseId: {
		   	  	 type: String,
		   	  	 required: [true, 'Subject ID is Required'] 
		   	  },
		   	  enrolledOn: {
		   	  	 type: Date,
		   	  	 default: new Date()
		   	  }, 
		   	  status: {
		   	  	 type: String,
		   	  	 default: 'Enrolled'
		   	  }
		   }
		] 
	});

//[SECTION] Model
	module.exports = mongoose.model('User', userSchema); 