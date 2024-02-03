const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { createPool } = require('mysql2');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const sgMail = require('@sendgrid/mail');
const { WebhookClient } = require('dialogflow-fulfillment'); 
const cors = require('cors');
const handlebarsHelpers = require('handlebars-helpers')();
const path = require('path');

const pool = createPool({
  host: "localhost",
  user: "mariacosmina",
  password: "28Avocado28.",
  database: "db1",
  connectionLimit: 10
});

const app = express();
const port = process.env.PORT || 5500;

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

app.use((req, res, next) => {
  const ext = path.extname(req.url);
  if (ext === '.js') {
    res.type('application/javascript');
  }
  next();
});

passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      return done(err);
    }
    done(null, results[0]);
  });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log('Trying to authenticate:', username, password);
 
    
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return done(err);
      }
      if (!results.length) {
        return done(null, false, { message: 'Utilizatorul nu există.' });
      }

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Parolă incorectă.' });
        }
      });
    });
  })
);


app.get('/', (req, res) => {
  const registrationSuccess = req.session.registrationSuccess || false;
  req.session.registrationSuccess = false;
  const isLoggedIn = req.isAuthenticated();
  res.render('mainPageView', { layout: 'index', submenus: submenus, strip: Home, registrationSuccess, isLoggedIn});
  

});

app.get('/login', (req, res) => {
  const isLoggedIn = req.isAuthenticated(); 
  const registrationSuccess = req.session.registrationSuccess || false; 

  res.render("mainPageView", { layout: "index", submenus: submenus, strip: Home, registrationSuccess, isLoggedIn });
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      console.log('Autentificare eșuată.');
      res.render("login", { layout: "index", submenus: submenus, strip: Home, errorMessage: "Autentificare eșuată. Verificați numele de utilizator și parola." });
      return;  }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      req.session.isLoggedIn = true;
      req.session.username = req.body.username;
      req.session.registrationSuccess = true; 

      console.log('Autentificare reușită pentru:', user.username); 
      return res.redirect('/'); 
    });
  })(req, res, next);
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    return res.status(400).send('Nume de utilizator și parolă sunt obligatorii.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
      if (err) {
        console.error('Eroare la înregistrare:', err.stack);
        res.status(500).send('A apărut o eroare la înregistrare.');
        return;
      }
      
    req.session.registrationSuccess = true;
    res.redirect('/');

    });
  }catch (error) {
    console.log(error);
    res.status(500).send('Eroare la înregistrare.');
  }
});


const hbs = exphbs.create({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    ...handlebarsHelpers,
    eq: function (a, b, options) {
      return a === b ? options.fn(this) : '';
    },
  },
});

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.use(express.static('public', { extensions: ['css'] }));


exports.dialogflowFirebaseFulfillment = async (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  console.log('Received a request from Dialogflow:', req.body);

  const { email, intrebare } = req.body.queryResult.parameters;

  console.log('Email:', email);
  console.log('Intrebare:', intrebare);

  sgMail.setApiKey('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'); 

  const msg = {
    to: 'mariacosminamls@gmail.com',
    from: 'mariacosmina2810@gmail.com', 
    subject: 'Cerere de asistență',
    text: `Mesaj: ${intrebare}\nAdresa de email: ${email}`,
  };

  try {
    await sgMail.send(msg);
    console.log(`E-mail trimis cu succes`);
    const responseText = `Mulțumim pentru informații! Am trimis următorul mesaj la adresa ${email}: '${intrebare}'. Vei primi un răspuns în curând.`;
    const fulfillmentMessages = [{ text: { text: [responseText] } }];
    res.json({ fulfillmentMessages }); 
  } catch (error) {
    console.error('Eroare la trimiterea e-mailului:', error);
    const responseText = 'A apărut o eroare la trimiterea e-mailului.';
    const fulfillmentMessages = [{ text: { text: [responseText] } }];
    res.json({ fulfillmentMessages });
  }
};

app.use(cors());
app.options('*', cors());

app.post('/dialogflow-fulfillment', (req, res) => {
  exports.dialogflowFirebaseFulfillment(req, res);
});


const getsubmenusModel = require("./models/submenusModel");
const submenus = getsubmenusModel();

const getstripModel = require("./models/stripModel");
const Home = getstripModel();



const searchLocations = require("./models/cityStrip");

app.get('/screens/destinatii/:page?', async (req, res) => {
  try {
    const cityName = req.params.page;

    if (cityName) {
      const locations = await searchLocations(cityName);
      res.render('destinationPageView', { layout: 'index', submenus: submenus, destinations: locations });
    } else {
       const allLocations = await searchLocations();
      res.render('destinationPageView', { layout: 'index', submenus: submenus, destinations: allLocations });
    }
  } catch (error) {
    console.error('A apărut o eroare:', error);
    res.status(500).send('Internal Server Error');
  }
});
const getFlightsInfo = require("./models/searchFlights.js");

app.get('/screens/zboruri', async (req, res) => {
 
  try {
    
    res.render("flightsMainView", { layout: "index", submenus: submenus});
  } catch (error) {
    console.error('A apărut o eroare:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/screens/zboruri', async (req, res) => {
  const { origin, destination, departureDate, adults, cabinClass } = req.body;

  try {
    const parsedResponse = await getFlightsInfo(origin, destination, departureDate, adults, cabinClass);

    console.log('Parsed Response:', parsedResponse.data.flightDeals); 

    if (parsedResponse && parsedResponse.data && parsedResponse.data.flightOffers) {
      const flights = parsedResponse.data;
      res.json({ flights });
    } else {
      console.error('Răspunsul primit nu conține date valide pentru zboruri.');
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error('A apărut o eroare:', error);
    console.error('Eroare detaliată:', error.message);
    res.status(500).send('Internal Server Error');
  }
});




app.get('/screens/blog', async (req, res) => {
 
  try {
    
    res.render("blogView", { layout: "index", submenus: submenus});
  } catch (error) {
    console.error('A apărut o eroare:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});