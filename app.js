const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require('cors');

//for deployment production
const path = require("path");


// app.use(express.static('./frontend/build'));
// app.use((req, res) => {
//     res.sendFile(path.join(__dirname, './client/frontend/index.html'));
// });

// import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobTypeRoute = require('./routes/jobsTypeRoutes');
const jobRoute = require('./routes/jobsRoutes');

const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

//database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));

//MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cookieParser());
app.use(cors());




//ROUTES MIDDLEWARE
// app.get('/', (req, res) => {
    //     res.send("Hello from Node Js");
    // })
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', jobTypeRoute);
app.use('/api', jobRoute);



// error middleware
app.use(errorHandler);


//deploy
// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

    
//deployment -> static files access
app.use(express.static(path.join(__dirname, "./frontend/build")));
// for deployment
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
  });



  
//port
const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});