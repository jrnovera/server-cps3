//Import of required modules
//External Modules 
const express = require("express"); 
const mongoose = require("mongoose");
//Internal Modules 
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require ("./routes/cart");
const orderRoutes = require ("./routes/order");

//Setting up constants
const port = 4001;
const cors = require("cors"); // Middleware for handling Cross-Origin Resource Sharing
const app = express(); // The Express application

//Configure Express middleware;
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({extended:true})); // Parses incoming URL-endoded data with the 'queryString' library
app.use(cors()); //Enables CORS

//Connect to MongoDB Database
//Establishes a connection to the MongoDB database using the provided connection string.
mongoose.connect("mongodb+srv://admin:admin@b335-valencia.9d3pnn3.mongodb.net/gadgetsStore", 
	{
		useNewUrlParser: true, 
		useUnifiedTopology: true	
	});
//Outputs a message once the connection is open.
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));


//Define Routes
//Assigns route handlers to speicfic URL paths. 
app.get("/", (req, res) => {
	res.send("Hello world")
})
app.use("/b1/users", userRoutes);
app.use("/b1/products", productRoutes);
app.use("/b1/cart", cartRoutes);
app.use("/b1/orders", orderRoutes);

//Start the server
//Server  starts listening on the speicified port
//Outputs a message indicating the server is online on the port it is listening on. 
app.listen(process.env.PORT || port, () => {console.log(`API is now online on port ${process.env.PORT || port}`)});

    

   

   
