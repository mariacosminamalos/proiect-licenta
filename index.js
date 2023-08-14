const express = require('express');
const axios = require('axios');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { createPool } = require('mysql2');
const exphbs = require('express-handlebars');
const flash = require('express-flash');

const pool = createPool({
  host: "localhost",
  user: "mariacosmina",
  password: "28Avocado28.",
  database: "db1",
  connectionLimit: 10
});

passport.use(
  new LocalStrategy((username, password, done) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      return done(err);
    }
    done(null, results[0]);
  });
});

const app = express();
const port = process.env.PORT || 5500;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

app.engine(
  'hbs',
  exphbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials/',
  }));

app.set('view engine', 'hbs');
app.use(express.static('public', { extensions: ['css'] }));

const getsubmenusModel = require("./models/submenusModel");
const submenus = getsubmenusModel();

const getstripModel = require("./models/stripModel");
const Home = getstripModel();



app.get('/', (req, res) => {
  res.render("mainPageView", { layout: "index", submenus: submenus, strip: Home });
});

const searchLocations = require("./models/cityStrip");

app.get('/screens/destinatii/:page?', async (req, res) => {
  try {
    const cityName = req.params.page;
    const locations = await searchLocations(cityName);

    res.render("destinationPageView", { layout: "index", submenus: submenus, destinations: locations });
  } catch (error) {
    console.error('A apărut o eroare:', error);
    res.status(500).send('Internal Server Error');
  }
});

const getFlightsInfo = require("./models/searchFlights");

app.get('/screens/zboruri', async (req, res) => {
 
  try {
    
    // res.json(flights);

    res.render("flightsMainView", { layout: "index", submenus: submenus});
  } catch (error) {
    console.error('A apărut o eroare:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/screens/zboruri', async (req, res) => {
  const { origin, destination, departureDate } = req.body;

  try {
    const parsedResponse = await getFlightsInfo(origin, destination, departureDate);
    const flights = parsedResponse.OTA_AirDetailsRS.FlightDetails;
    res.json({ flights }); // trimite răspunsul în format JSON
  } catch (error) {
    console.error('A apărut o eroare:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/login', (req, res) => {
  res.render('login'); // Aici ar trebui să fie template engine-ul tău, cum ar fi Handlebars, EJS, Pug, etc.
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/dashboard', (req, res) => {
  res.send('Bun venit în panoul de control!');
});


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      return done(err);
    }
    done(null, results[0]);
  });
});


app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());



app.get('/login', (req, res) => {
  res.render('login'); // Aici ar trebui să fie template engine-ul tău, cum ar fi Handlebars, EJS, Pug, etc.
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));


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

      res.send('Înregistrare reușită!');
    });
  }catch (error) {
    console.log(error);
    res.status(500).send('Eroare la înregistrare.');
  }
});

passport.use(
  new LocalStrategy((username, password, done) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
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



app.get('/dashboard', (req, res) => {
  res.send('Bun venit în panoul de control!');
});

app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});