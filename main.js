import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { request } from "http";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "auction system",
  password: "5432",
  port: 5432,
});

db.connect();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/Firstpage");
});

app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.get("/register", (req, res) => {
  res.render("pages/register");
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const Password = req.body.password;
  try {
    const checkresult = await db.query(
      "SELECT * FROM register WHERE email_id=$1",
      [email]
    );
    if (checkresult.rows.length > 0) {
      res.send("Email already exist");
    } else {
      const result = await db.query(
        "INSERT INTO register(email_id,password) VALUES ($1,$2)",
        [email, Password]
      );
      res.render("pages/register");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const Password = req.body.password;
  try {
    const result = await db.query("SELECT * FROM  register WHERE email_id=$1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storepassword = user.password;
      if (Password === storepassword) {
        res.redirect("/bid");
      } else {
        res.send("Incorrect username or password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/bid", (req, res) => {
  res.render("pages/bid");
});
app.get("/buy", async (req, res) => {
  try {
    const biditem = await db.query("SELECT * FROM biditem");
    res.render("pages/buy", { biditem: biditem.rows }); // Pass biditem to the template
  } catch (error) {
    console.error("Error fetching biditem data", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/buy", upload.single('image'), async (req, res) => {
   if (!req.file) {
        return res.status(400).send('No image uploaded.');
    }
  const product_name = req.body.name;
  const product_desc = req.body.Description;
  const product_price = req.body.price;
  const product_date = req.body.date;
  const product_time = req.body.bidtime;
  const valid_date = req.body.validdate;
  const product_category = req.body.product_category;
  
  console.log("----", product_category);
  console.log("time", product_time);
  try {
    await db.query(
      "INSERT INTO biditem(product_name, product_price,product_description,product_time,publish_date,valid_date,product_category) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [
        product_name,
        product_price,
        product_desc,
        product_time,
        product_date,
        valid_date,
        product_category,
        // req.file.filename
      ]
    );
    console.log("Bid item inserted successfully");

    res.redirect("/buy");
  } catch (error) {
    console.error("Error inserting biditem data", error);
    res.status(500).send("Internal Server Error");
  }
});
app.use('/uploads', express.static('uploads'));

app.get("/description/:product_id", async (req, res) => {
  try {
    const id = req.params.product_id;
    console.log(id);
    const biditem = await db.query(
      `SELECT * FROM  biditem WHERE product_id = ${id}`
    );
    const result = await db.query(
      `SELECT product_time , valid_date FROM biditem WHERE product_id=${id}`
    );
    const productTime = result.rows[0].product_time; // Assuming product_time is in 'HH:mm' format
    const date = result.rows[0].valid_date; // Assuming valid_date is in 'YYYY-MM-DD' format

    // Convert productTimeStr and dateStr to Date object

    console.log("Product time:", productTime);
    console.log("Date:", date);

   
    res.render("pages/description", { biditem: biditem.rows }); // Pass biditem to the template
  } catch (error) {
    console.error("Error fetching biditem data", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/purchase", async (req, res) => {
  try {
    const bidshow = await db.query("SELECT * FROM purchaseprice");
   
     let highestBid = 0;
      let winner = '';

    // Find the highest bidder
    bidshow.rows.forEach(row => {
      const currentBid = row.price;
      if (currentBid > highestBid) {
        highestBid = currentBid;
        winner = row.user_name;
      }
    });
    console.log("winner is",winner)

    res.render("pages/pricebid", { bidshow: bidshow.rows,winner:winner });
  } catch (error) {
    console.error("Error fetching biditem data", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/purchase", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const price = req.body.price;
    // Process the form data (insert into database, etc.)

    console.log("Email:", email);
    console.log("Price:", price);
    console.log("name:", name);
    const bidpurchase = await db.query(
      "INSERT INTO purchaseprice(email,price,user_name) VALUES($1,$2,$3)",
      [email, price, name]
    );
    const bidshow = await db.query("SELECT * FROM purchaseprice");

    // Render the template with bidshow data
    res.render("pages/pricebid", { bidshow: bidshow.rows });

    console.log("item inseerted successfully");
  } catch (error) {
    console.error("Error processing form data", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
