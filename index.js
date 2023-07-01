const { mainModel } = require("./models/post")
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const mongoose = require('mongoose');
require('dotenv').config();
let sql;
var data = [{
  tj: "Arti Muncul Disini",
  jt: 'kgf',
  mode: 0,
  textBahasa: "Indonesia Ke Rejang"
}];

var dataKaganga = [{
  tj: "Arti Muncul Disini",
  jt: 'kgf',
}];
var badword = false;
async function post(data, Indonesia, Rejang) {
  Indonesia = Indonesia.toLowerCase()
  Rejang = Rejang.toLowerCase()
  try {
    // Validasi kata kasar
    const containsBadWord = badWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      return regex.test(Indonesia) || regex.test(Rejang);
    });

    if (Indonesia.trim() !== "" && Rejang.trim() !== "" && !containsBadWord) {
      // TODO: Tambahkan posting ke database terlebih dahulu.
      const existingDataIndo = await mainModel.findOne({ Indonesia });
      const existingDataRejang = await mainModel.findOne({ Rejang });

      if (!existingDataIndo && !existingDataRejang) {
        // Data belum ada dalam database, tambahkan ke database
        await mainModel.create({ Indonesia, Rejang });
        data.unshift({ Indonesia, Rejang });
      } else {
        console.log("Data already exists in the database.");
      }
    } else {
      badword = true;
    }
  } catch (err) {
    console.error(err);
  }
}



var notes = [];
mainModel.find({}, null, { sort: { like: -1 } }).then(docs => { notes = docs })

/*() 

sql = 'SELECT * FROM Table1';
db.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);

  // For each note, query the comment table to see if there are any comments associated with it
  rows.forEach((row) => {
    mainModel.create({Indonesia: row.Indo, Rejang: row.Rejang})
  });
});*/


const app = express()

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post("/ganti", (req, res) => {
  if (data[0].mode == 0) {
    data[0].mode = 1
    data[0].textBahasa = "Rejang Ke Indonesia"
  } else if (data[0].mode == 1) {
    data[0].mode = 0;
    data[0].textBahasa = "Indonesia Ke Rejang"
  }
  res.redirect('/')
})
app.get("/", function(req, res) {

  res.render("home", {
    data: data,
    notes: notes
  })
})
app.get("/database", function(req, res) {

  res.render("database", {
    data: notes
  })
})

app.get("/database2", function(req, res) {

  res.json({
      data: notes
    });
})
/**
 * @param {mainModel} model 
 */
const badWordsString = process.env.katakasar;
const badWords = badWordsString.split(',');



app.post("/post-database", async function(req, res) {
  // Assign values from request body
  const Indonesia = req.body.Indonesia;
  const Rejang = req.body.Rejang;

  // Call the function
  await post(notes, Indonesia, Rejang);

  if (badword == true) {
    badword = false;
    const responseHTML = `
          <html>
          <head>
            <title>GAGAL</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
  <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="a.png" type="image/x-icon">

          </head>
          <style>
    @font-face {
        font-family: rlabel;
        src: url(bangkahulu.ttf);
    }
    :root {
        --primary-color: #DD5F54;
        --secondary-color: #B5483F;
        --accent-color: #E2766C;
        --highlight-color: #E90709;
        --dark-color: #BA4541;
    }
    body {
        background-color: var(--primary-color);
    }
    .custom-card {
        max-width: 200px;
        margin: 0 auto;
    }

    .custom-card img {
        height: auto;
        max-height: 200px;
        width: auto;
        max-width: 200px;
        box-shadow: none;
        object-fit: contain;
    }

    .custom-form input {
        width: 100%;
    }

    .centered-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .navbar {
        background-color: var(--secondary-color);
    }
    .navbar-brand {
        color: white;
        font-weight: bold;
    }
    main.container {
        color: white;
    }
    .btn-primary {
        background-color: var(--accent-color);
        border-color: var(--secondary-color);
    }
    .btn-primary:hover {
        background-color: var(--accent-color);
        border-color: var(--accent-color);
    }
    .btn-primary:active {
        background-color: var(--highlight-color);
        border-color: var(--highlight-color);
    }
    .card {
        background-color: var(--dark-color);
        color: white;
    }
    .center-heading {
        text-align: center;
    }
    .cat-image {
      max-width: 1000px;
      height: auto;
      margin: 20px auto;
    }
</style>
          <body class="text-white">
          <header>
    <nav class="navbar navbar-expand-lg navbar-dark ">
        <a class="navbar-brand" href="#">
            <img src="a.png" width="30" height="30" class="d-inline-block align-top" alt="">
            Kamus Rejang Kito</a>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <a class="nav-item nav-link active" href="http://kamus-rejang-kito.mfathinhalim.repl.co/">Home</a>
            <a class="nav-item nav-link" href="/database">Kamus bacaan dan Tambahkan Kata!</a>
            <a class="nav-item nav-link" href="/kaganga">Kaganga!</a>
          </div>
        </div>
      </nav>
</header>

          <article class="card mt-3 centered-card">
          
        <div class="card-body centered-card">
        <img class="cat-image rounded" src="https://media2.giphy.com/media/ThqjzQjwdd1GCRNgAE/giphy.gif" alt="Cute Cat">
            <h1>Mohon gunakan kata kata yang sopan!</h1>
            <button class="btn btn-primary btn-lg" onclick="redirectToDatabase()">Kembali</button>
        </div>
        
        <h1>MADE BY M.FATHIN HALIM</h1>
    </article>

    
            
            <script>
              function redirectToDatabase() {
                window.location.href = '/database';
              }
            </script>
          </body>
          </html>
        `;

    res.send(responseHTML);
  } else {
    res.redirect("/database");
  }


});


app.post("/search", async (req, res) => {
  var input = req.body.value

  if (input == "doma#0777") {
    const responseHTML = `
          <html>
          <head>
            <title>Easter Egg</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
  <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="a.png" type="image/x-icon">

          </head>
          <style>
    @font-face {
        font-family: rlabel;
        src: url(bangkahulu.ttf);
    }
    :root {
        --primary-color: #DD5F54;
        --secondary-color: #B5483F;
        --accent-color: #E2766C;
        --highlight-color: #E90709;
        --dark-color: #BA4541;
    }
    body {
        background-color: var(--primary-color);
    }
    .custom-card {
        max-width: 200px;
        margin: 0 auto;
    }

    .custom-card img {
        height: auto;
        max-height: 200px;
        width: auto;
        max-width: 200px;
        box-shadow: none;
        object-fit: contain;
    }

    .custom-form input {
        width: 100%;
    }

    .centered-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .navbar {
        background-color: var(--secondary-color);
    }
    .navbar-brand {
        color: white;
        font-weight: bold;
    }
    main.container {
        color: white;
    }
    .btn-primary {
        background-color: var(--accent-color);
        border-color: var(--secondary-color);
    }
    .btn-primary:hover {
        background-color: var(--accent-color);
        border-color: var(--accent-color);
    }
    .btn-primary:active {
        background-color: var(--highlight-color);
        border-color: var(--highlight-color);
    }
    .card {
        background-color: var(--dark-color);
        color: white;
    }
    .center-heading {
        text-align: center;
    }
    .cat-image {
      max-width: 600px;
      height: auto;
      margin: 20px auto;
    }
</style>
          <body class="text-white">
          <header>
    <nav class="navbar navbar-expand-lg navbar-dark ">
        <a class="navbar-brand" href="#">
            <img src="a.png" width="30" height="30" class="d-inline-block align-top" alt="">
            Kamus Rejang Kito</a>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <a class="nav-item nav-link active" href="http://kamus-rejang-kito.mfathinhalim.repl.co/">Home</a>
            <a class="nav-item nav-link" href="/database">Kamus bacaan dan Tambahkan Kata!</a>
            <a class="nav-item nav-link" href="/kaganga">Kaganga!</a>
          </div>
        </div>
      </nav>
</header>

          <article class="card mt-3 centered-card">
          
        <div class="card-body centered-card">
        <img class="cat-image rounded" src="https://i.pinimg.com/originals/90/cc/1e/90cc1eaca40b8ad9008e87a8b38df44a.jpg" alt="Cute Cat">
            <h1>H- Halo!</h1>
            <button class="btn btn-primary btn-lg" onclick="redirectToDatabase()">Kembali</button>
        </div>
        
        <h1>MADE BY M.FATHIN HALIM</h1>
    </article>

    
            
            <script>
              function redirectToDatabase() {
                window.location.href = '/';
              }
            </script>
          </body>
          </html>
        `;

    res.send(responseHTML);
  } else {

    const mode = data[0].mode

    if (mode == 0) {
      input = input.replace("ê", "e").replace("1", "satu").replace("2", "dua").replace("3", "tiga").replace("4", "empat").replace("5", "lima").replace("6", "enam").replace("7", "tujuh").replace("8", "delapan").replace("9", "sembilan").replace("10", "sepuluh")
      const myArray = input.toLowerCase().split(" ");

      const result = [];
      for (const value of myArray) {
        const query = { Indonesia: value }; // Ganti "field" dengan nama field yang sesuai di dalam koleksi
        const data = await mainModel.findOne(query);
        if (data) {
          result.push(data);
        } else {
          const newData = {
            Indonesia: value,
            Rejang: value
          };
          result.push(newData);
        }
      }

      // Mengubah array menjadi string
      let resultString = result.map(item => item.Rejang).join(", ");

      // Mengganti koma dengan spasi
      var doc = resultString.replace(/,/g, " ");

      // Menampilkan hasil
      data[0].tj = input;
      data[0].jt = kaganga(input);

      if (doc !== null) {

        data[0].tj = doc;
        data[0].jt = kaganga(doc);
      }

      res.redirect('/')

    } else {
      input = input.replace("ê", "e").replace("1", "satu").replace("2", "dua").replace("3", "tiga").replace("4", "empat").replace("5", "lima").replace("6", "enam").replace("7", "tujuh").replace("8", "delapan").replace("9", "sembilan").replace("10", "sepuluh")
      const myArray = input.toLowerCase().split(" ");
 
      const result = [];
      for (const value of myArray) {
        const query = { Rejang: value }; // Ganti "field" dengan nama field yang sesuai di dalam koleksi
        const data = await mainModel.findOne(query);
        if (data) {
          result.push(data);
        } else {
          const newData = {
            Indonesia: value,
            Rejang: value
          };
          result.push(newData);
        }
      }

      // Mengubah array menjadi string
      let resultString = result.map(item => item.Indonesia).join(", ");

      // Mengganti koma dengan spasi
      var doc = resultString.replace(/,/g, " ");

      // Menampilkan hasil
      data[0].tj = input;
      data[0].jt = kaganga(input);

      if (doc !== null) {

        data[0].tj = doc;
        data[0].jt = kaganga(doc);
      }
      res.redirect('/')
    }
  }
})
app.post("/searchKaganga", (req, res) => {
  const input = req.body.value.toLowerCase()
  dataKaganga[0].tj = input;
  dataKaganga[0].jt = kaganga(input);

  res.redirect('/kaganga')


})
app.get("/kaganga", (req, res) => {
  res.render("kaganga", {
    data: dataKaganga
  })
})

app.post("/search2", async (req, res) => {
  var input = req.body.value.toLowerCase();
  const mode = req.body.mode;

  if (mode == 0) {
    /*db.get("SELECT Rejang FROM Table1 WHERE Indo='"+input+"'", function(err, row) {

        
        data[0].tj = input;
        data[0].jt = kaganga(input);
        if(row!==undefined){
            data[0].tj = row.Rejang;
            data[0].jt = kaganga(row.Rejang);
        }
        res.json({
            tj: data[0].tj,
            jt: data[0].jt
        });
    });*/

    input = input.replace("ê", "e").replace("1", "satu").replace("2", "dua").replace("3", "tiga").replace("4", "empat").replace("5", "lima").replace("6", "enam").replace("7", "tujuh").replace("8", "delapan").replace("9", "sembilan").replace("10", "sepuluh")
    const myArray = input.split(" ");

    const result = [];
    for (const value of myArray) {
      const query = { Indonesia: value }; // Ganti "field" dengan nama field yang sesuai di dalam koleksi
      const data = await mainModel.findOne(query);
      if (data) {
        result.push(data);
      } else {
        const newData = {
          Indonesia: value,
          Rejang: value
        };
        result.push(newData);
      }
    }

    // Mengubah array menjadi string
    let resultString = result.map(item => item.Rejang).join(", ");

    // Mengganti koma dengan spasi
    var doc = resultString.replace(/,/g, " ");

    // Menampilkan hasil
    data[0].tj = input;
    data[0].jt = kaganga(input);

    if (doc !== null) {
      doc = doc.toLowerCase()
      data[0].tj = doc;
      data[0].jt = kaganga(doc);
    }

    res.json({
      tj: data[0].tj,
      jt: data[0].jt
    });

  } else {
    input = input.replace("ê", "e").replace("1", "satu").replace("2", "dua").replace("3", "tiga").replace("4", "empat").replace("5", "lima").replace("6", "enam").replace("7", "tujuh").replace("8", "delapan").replace("9", "sembilan").replace("10", "sepuluh")
    const myArray = input.split(" ");

    const result = [];
    for (const value of myArray) {
      const query = { Rejang: value }; // Ganti "field" dengan nama field yang sesuai di dalam koleksi
      const data = await mainModel.findOne(query);
      if (data) {
        result.push(data);
      } else {
        const newData = {
          Indonesia: value,
          Rejang: value
        };
        result.push(newData);
      }
    }

    // Mengubah array menjadi string
    let resultString = result.map(item => item.Indonesia).join(", ");

    // Mengganti koma dengan spasi
    var doc = resultString.replace(/,/g, " ");

    // Menampilkan hasil
    data[0].tj = input;
    data[0].jt = kaganga(input);

    if (doc !== null) {
      doc = doc.toLowerCase()
      data[0].tj = doc;
      data[0].jt = kaganga(doc);
    }

    res.json({
      tj: data[0].tj,
      jt: data[0].jt
    });
  }
});


function kaganga(kaganga) {
  kaganga = kaganga.toLowerCase()
  kaganga = kaganga.replace("nd", "Dx")
  kaganga = kaganga.replace("mb", "Bx")
  kaganga = kaganga.replace("nj", "Jx")
  kaganga = kaganga.replace("ngg", "Gx")
  kaganga = kaganga.replace("ngk", "Qx")
  kaganga = kaganga.replace("nc", "Cx")
  kaganga = kaganga.replace("nt", "Tx")
  kaganga = kaganga.replace("mp", "Px")
  kaganga = kaganga.replace("gh", "qx")
  kaganga = kaganga.replace("ng", "F")
  kaganga = kaganga.replace("n", "N")
  kaganga = kaganga.replace("eak", "K")
  kaganga = kaganga.replace("k", "kx")
  kaganga = kaganga.replace("g", "gx")
  kaganga = kaganga.replace("t", "tx")
  kaganga = kaganga.replace("d", "dx")
  kaganga = kaganga.replace("p", "px")
  kaganga = kaganga.replace("b", "bx")
  kaganga = kaganga.replace("m", "M")
  kaganga = kaganga.replace("c", "cx")
  kaganga = kaganga.replace("j", "jx")
  kaganga = kaganga.replace("s", "sx")
  kaganga = kaganga.replace("r", "rx")
  kaganga = kaganga.replace("l", "lx")
  kaganga = kaganga.replace("y", "yx")
  kaganga = kaganga.replace("w", "wx")
  kaganga = kaganga.replace("h", "hx")
  kaganga = kaganga.replace("i", "ia")
  kaganga = kaganga.replace("u", "ua")
  kaganga = kaganga.replace("e", "ea")
  kaganga = kaganga.replace("o", "oa")
  kaganga = kaganga.replace("Ma", "m")
  kaganga = kaganga.replace("Mia", "im")
  kaganga = kaganga.replace("Mua", "um")
  kaganga = kaganga.replace("Mea", "em")
  kaganga = kaganga.replace("Moa", "om")
  kaganga = kaganga.replace("mF", 'Fm')
  kaganga = kaganga.replace("imF", 'Fim')
  kaganga = kaganga.replace("umF", 'Fum')
  kaganga = kaganga.replace("emF", 'Fem')
  kaganga = kaganga.replace("omF", 'Fom')
  kaganga = kaganga.replace("MK", 'mK')
  kaganga = kaganga.replace("mN", 'Nm')
  kaganga = kaganga.replace("imN", 'Nmi')
  kaganga = kaganga.replace("umN", 'Nmu')
  kaganga = kaganga.replace("emN", 'Nme')
  kaganga = kaganga.replace("omN", 'Nmo')
  kaganga = kaganga.replace("mM", "Mm")
  kaganga = kaganga.replace("miM", "Mim")
  kaganga = kaganga.replace("muM", "Mum")
  kaganga = kaganga.replace("meM", "Mem")
  kaganga = kaganga.replace("moM", "Mom")
  kaganga = kaganga.replace("Na", "n")
  kaganga = kaganga.replace("Ni", "in")
  kaganga = kaganga.replace("Nu", "un")
  kaganga = kaganga.replace("Ne", "en")
  kaganga = kaganga.replace("No", "on")
  kaganga = kaganga.replace("va", "v")
  kaganga = kaganga.replace("vi", "iv")
  kaganga = kaganga.replace("vu", "uv")
  kaganga = kaganga.replace("ve", "ev")
  kaganga = kaganga.replace("vo", "ov")
  kaganga = kaganga.replace("Fa", "f")
  kaganga = kaganga.replace("Fia", "if")
  kaganga = kaganga.replace("Fua", "uf")
  kaganga = kaganga.replace("Fea", "ef")
  kaganga = kaganga.replace("Foa", "of")
  kaganga = kaganga.replace("FK", "fK")
  kaganga = kaganga.replace("fN", 'Nf')
  kaganga = kaganga.replace("ifN", 'Nif')
  kaganga = kaganga.replace("ufN", 'Nuf')
  kaganga = kaganga.replace("efN", 'Nef')
  kaganga = kaganga.replace("ofN", 'Nof')
  kaganga = kaganga.replace("fM", "Mf")
  kaganga = kaganga.replace("ifM", "Mif")
  kaganga = kaganga.replace("ufM", "Muf")
  kaganga = kaganga.replace("efM", "Mef")
  kaganga = kaganga.replace("ofM", "Mof")
  kaganga = kaganga.replace("txa", "t")
  kaganga = kaganga.replace("txia", "it")
  kaganga = kaganga.replace("txua", "ut")
  kaganga = kaganga.replace("txea", "et")
  kaganga = kaganga.replace("txoa", "ot")
  kaganga = kaganga.replace("tF", "Ft")
  kaganga = kaganga.replace("itF", "Fit")
  kaganga = kaganga.replace("utF", "Fut")
  kaganga = kaganga.replace("etF", "Fet")
  kaganga = kaganga.replace("otF", "Fot")
  kaganga = kaganga.replace("txK", 'tK')
  
  kaganga = kaganga.replace("tM", "Mt")
  kaganga = kaganga.replace("itM", "Mit")
  kaganga = kaganga.replace("utM", "Mut")
  kaganga = kaganga.replace("etM", "Met")
  kaganga = kaganga.replace("otM", "Mot")
  kaganga = kaganga.replace("bxa", "b")
  kaganga = kaganga.replace("bxia", "ib")
  kaganga = kaganga.replace("bxua", "ub")
  kaganga = kaganga.replace("bxea", "eb")
  kaganga = kaganga.replace("bxoa", "ob")
  kaganga = kaganga.replace("bF", 'Fb')
  kaganga = kaganga.replace("ibF", 'Fib')
  kaganga = kaganga.replace("ubF", 'Fub')
  kaganga = kaganga.replace("ebF", 'Feb')
  kaganga = kaganga.replace("obF", 'Fob')
  kaganga = kaganga.replace("bxK", 'bK')
  kaganga = kaganga.replace("bN", 'Nb')
  kaganga = kaganga.replace("ibN", 'Nib')
  kaganga = kaganga.replace("ubN", 'Nub')
  kaganga = kaganga.replace("ebN", 'Neb')
  kaganga = kaganga.replace("obN", 'Nob')
  kaganga = kaganga.replace("bM", "Mb")
  kaganga = kaganga.replace("ibM", "Mib")
  kaganga = kaganga.replace("ubM", "Mub")
  kaganga = kaganga.replace("ebM", "Meb")
  kaganga = kaganga.replace("obM", "Mob")
  kaganga = kaganga.replace("cxa", "c")
  kaganga = kaganga.replace("cxia", "ic")
  kaganga = kaganga.replace("cxua", "uc")
  kaganga = kaganga.replace("cxea", "ec")
  kaganga = kaganga.replace("cxoa", "oc")
  kaganga = kaganga.replace("cF", 'Fc')
  kaganga = kaganga.replace("icF", 'Fic')
  kaganga = kaganga.replace("ucF", 'Fuc')
  kaganga = kaganga.replace("ecF", 'Fec')
  kaganga = kaganga.replace("ocF", 'Foc')
  kaganga = kaganga.replace("cxK", 'cK')
  kaganga = kaganga.replace("cN", 'Nc')
  kaganga = kaganga.replace("icN", 'Nic')
  kaganga = kaganga.replace("ucN", 'Nuc')
  kaganga = kaganga.replace("ecN", 'Nec')
  kaganga = kaganga.replace("ocN", 'Noc')
  kaganga = kaganga.replace("cM", "Mc")
  kaganga = kaganga.replace("icM", "Mic")
  kaganga = kaganga.replace("ucM", "Muc")
  kaganga = kaganga.replace("ecM", "Mec")
  kaganga = kaganga.replace("ocM", "Moc")
  kaganga = kaganga.replace("dxa", "d")
  kaganga = kaganga.replace("dxia", "id")
  kaganga = kaganga.replace("dxua", "ud")
  kaganga = kaganga.replace("dxea", "ed")
  kaganga = kaganga.replace("dxoa", "od")
  kaganga = kaganga.replace("Fd", 'dF')
  kaganga = kaganga.replace("idF", 'Fid')
  kaganga = kaganga.replace("udF", 'Fud')
  kaganga = kaganga.replace("edF", 'Fed')
  kaganga = kaganga.replace("odF", 'Fod')
  kaganga = kaganga.replace("dxK", 'dK')
  kaganga = kaganga.replace("dN", 'Nd')
  kaganga = kaganga.replace("idN", 'Nid')
  kaganga = kaganga.replace("udN", 'Nud')
  kaganga = kaganga.replace("edN", 'Ned')
  kaganga = kaganga.replace("odN", 'Nod')
  kaganga = kaganga.replace("dM", "Md")
  kaganga = kaganga.replace("idM", "Mid")
  kaganga = kaganga.replace("udM", "Mud")
  kaganga = kaganga.replace("edM", "Med")
  kaganga = kaganga.replace("odM", "Mod")
  kaganga = kaganga.replace("Bxa", "B")
  kaganga = kaganga.replace("Bxia", "iB")
  kaganga = kaganga.replace("Bxua", "uB")
  kaganga = kaganga.replace("Bxea", "eB")
  kaganga = kaganga.replace("Ny", "v")
  kaganga = kaganga.replace("Bxoa", "oB")
  kaganga = kaganga.replace("BF", 'FB')
  kaganga = kaganga.replace("iBF", 'FiB')
  kaganga = kaganga.replace("uBF", 'FuB')
  kaganga = kaganga.replace("eBF", 'FeB')
  kaganga = kaganga.replace("oBF", 'FoB')
  kaganga = kaganga.replace("BxK", 'BK')
  kaganga = kaganga.replace("BN", 'NB')
  kaganga = kaganga.replace("iBN", 'NiB')
  kaganga = kaganga.replace("uBN", 'NuB')
  kaganga = kaganga.replace("eBN", 'NeB')
  kaganga = kaganga.replace("oBN", 'NoB')
  kaganga = kaganga.replace("BM", "MB")
  kaganga = kaganga.replace("iBM", "MiB")
  kaganga = kaganga.replace("uBM", "MuB")
  kaganga = kaganga.replace("eBM", "MeB")
  kaganga = kaganga.replace("oBM", "MoB")
  kaganga = kaganga.replace("Jxa", "J")
  kaganga = kaganga.replace("Jxia", "iJ")
  kaganga = kaganga.replace("Jxua", "uJ")
  kaganga = kaganga.replace("Jxea", "eJ")
  kaganga = kaganga.replace("Jxoa", "oJ")

  kaganga = kaganga.replace("vxa", "v")
  kaganga = kaganga.replace("vxia", "iv")
  kaganga = kaganga.replace("vxua", "uv")
  kaganga = kaganga.replace("vxea", "ev")
  kaganga = kaganga.replace("vxoa", "ov")

  kaganga = kaganga.replace("JF", 'FJ')
  kaganga = kaganga.replace("iJF", 'FiJ')
  kaganga = kaganga.replace("uJF", 'FuJ')
  kaganga = kaganga.replace("eJF", 'FeJ')
  kaganga = kaganga.replace("oJF", 'FoJ')
  kaganga = kaganga.replace("JxK", 'JK')
  kaganga = kaganga.replace("JN", 'NJ')
  kaganga = kaganga.replace("iJN", 'NiJ')
  kaganga = kaganga.replace("uJN", 'NuJ')
  kaganga = kaganga.replace("eJN", 'NeJ')
  kaganga = kaganga.replace("oJN", 'NoJ')
  kaganga = kaganga.replace("JM", "MJ")
  kaganga = kaganga.replace("iJM", "MiJ")
  kaganga = kaganga.replace("uJM", "MuJ")
  kaganga = kaganga.replace("eJM", "MeJ")
  kaganga = kaganga.replace("oJM", "MoJ")
  kaganga = kaganga.replace("Gxa", "G")
  kaganga = kaganga.replace("Gxia", "iG")
  kaganga = kaganga.replace("Gxua", "uG")
  kaganga = kaganga.replace("Gxea", "eG")
  kaganga = kaganga.replace("Gxoa", "oG")

  kaganga = kaganga.replace("gia", "ig")
  kaganga = kaganga.replace("gua", "ug")
  kaganga = kaganga.replace("gea", "eg")
  kaganga = kaganga.replace("goa", "og")

  kaganga = kaganga.replace("GF", 'FG')
  kaganga = kaganga.replace("iGF", 'FiG')
  kaganga = kaganga.replace("uGF", 'FuG')
  kaganga = kaganga.replace("eGF", 'FeG')
  kaganga = kaganga.replace("oGF", 'FoG')
  kaganga = kaganga.replace("GxK", 'GK')
  kaganga = kaganga.replace("GN", 'NG')
  kaganga = kaganga.replace("iGN", 'NiG')
  kaganga = kaganga.replace("uGN", 'NuG')
  kaganga = kaganga.replace("eGN", 'NeG')
  kaganga = kaganga.replace("oGN", 'NoG')

  
  
  kaganga = kaganga.replace("GM", "MG")
  kaganga = kaganga.replace("iGM", "MiG")
  kaganga = kaganga.replace("uGM", "MuG")
  kaganga = kaganga.replace("eGM", "MeG")
  kaganga = kaganga.replace("oGM", "MoG")
  kaganga = kaganga.replace("Qxa", "Q")
  kaganga = kaganga.replace("Qxia", "iQ")
  kaganga = kaganga.replace("Qxua", "uQ")
  kaganga = kaganga.replace("Qxea", "eQ")
  kaganga = kaganga.replace("Qxoa", "oQ")
  kaganga = kaganga.replace("QF", 'FQ')
  kaganga = kaganga.replace("iQF", 'FiQ')
  kaganga = kaganga.replace("uQF", 'FuQ')
  kaganga = kaganga.replace("eQF", 'FeQ')
  kaganga = kaganga.replace("oQF", 'FoQ')
  kaganga = kaganga.replace("QxK", 'QK')
  kaganga = kaganga.replace("QN", 'NQ')
  kaganga = kaganga.replace("iQN", 'NiQ')
  kaganga = kaganga.replace("uQN", 'NuQ')
  kaganga = kaganga.replace("eQN", 'NeQ')
  kaganga = kaganga.replace("oQN", 'NoQ')
  kaganga = kaganga.replace("QM", "MQ")
  kaganga = kaganga.replace("iQM", "MiQ")
  kaganga = kaganga.replace("uQM", "MuQ")
  kaganga = kaganga.replace("eQM", "MeQ")
  kaganga = kaganga.replace("oQM", "MoQ")
  kaganga = kaganga.replace("Cxa", "C")
  kaganga = kaganga.replace("Cxia", "iC")
  kaganga = kaganga.replace("Cxua", "uC")
  kaganga = kaganga.replace("Cxea", "eC")
  kaganga = kaganga.replace("Cxoa", "oC")
  kaganga = kaganga.replace("CF", 'FC')
  kaganga = kaganga.replace("iCF", 'FiC')
  kaganga = kaganga.replace("uCF", 'FuC')
  kaganga = kaganga.replace("eCF", 'FeC')
  kaganga = kaganga.replace("oCF", 'FoC')
  kaganga = kaganga.replace("CxK", 'CK')
  kaganga = kaganga.replace("CN", 'NC')
  kaganga = kaganga.replace("iCN", 'NiC')
  kaganga = kaganga.replace("uCN", 'NuC')
  kaganga = kaganga.replace("eCN", 'NeC')
  kaganga = kaganga.replace("oCN", 'NoC')
  kaganga = kaganga.replace("CM", "MC")
  kaganga = kaganga.replace("iCM", "MiC")
  kaganga = kaganga.replace("uCM", "MuC")
  kaganga = kaganga.replace("eCM", "MeC")
  kaganga = kaganga.replace("oCM", "MoC")
  kaganga = kaganga.replace("Txa", "T")
  kaganga = kaganga.replace("Txia", "iT")
  kaganga = kaganga.replace("Txua", "uT")
  kaganga = kaganga.replace("Txea", "eT")
  kaganga = kaganga.replace("Txoa", "oT")
  kaganga = kaganga.replace("TF", 'FT')
  kaganga = kaganga.replace("iTF", 'FiT')
  kaganga = kaganga.replace("uTF", 'FuT')
  kaganga = kaganga.replace("eTF", 'FeT')
  kaganga = kaganga.replace("oTF", 'FoT')
  kaganga = kaganga.replace("TxK", 'TK')
  kaganga = kaganga.replace("TN", 'NT')
  kaganga = kaganga.replace("iTN", 'NiT')
  kaganga = kaganga.replace("uTN", 'NuT')
  kaganga = kaganga.replace("eTN", 'NeT')
  kaganga = kaganga.replace("oTN", 'NoT')
  kaganga = kaganga.replace("TM", "MT")
  kaganga = kaganga.replace("iTM", "MiT")
  kaganga = kaganga.replace("uTM", "MuT")
  kaganga = kaganga.replace("eTM", "MeT")
  kaganga = kaganga.replace("oTM", "MoT")
  kaganga = kaganga.replace("Pxa", "P")
  kaganga = kaganga.replace("Pxia", "iP")
  kaganga = kaganga.replace("Pxua", "uP")
  kaganga = kaganga.replace("Pxea", "eP")
  kaganga = kaganga.replace("Pxoa", "oP")
  kaganga = kaganga.replace("PF", 'FP')
  kaganga = kaganga.replace("iPF", 'FiP')
  kaganga = kaganga.replace("uPF", 'FuP')
  kaganga = kaganga.replace("ePF", 'FeP')
  kaganga = kaganga.replace("oPF", 'FoP')
  kaganga = kaganga.replace("PxK", 'PK')
  kaganga = kaganga.replace("PN", 'NP')
  kaganga = kaganga.replace("iPN", 'NiP')
  kaganga = kaganga.replace("uPN", 'NuP')
  kaganga = kaganga.replace("ePN", 'NeP')
  kaganga = kaganga.replace("oPN", 'NoP')
  kaganga = kaganga.replace("PM", "MP")
  kaganga = kaganga.replace("iPM", "MiP")
  kaganga = kaganga.replace("uPM", "MuP")
  kaganga = kaganga.replace("ePM", "MeP")
  kaganga = kaganga.replace("oPM", "MoP")
  kaganga = kaganga.replace("qxa", "q")
  kaganga = kaganga.replace("qxia", "iq")
  kaganga = kaganga.replace("qxua", "uq")
  kaganga = kaganga.replace("qxea", "eq")
  kaganga = kaganga.replace("qxoa", "oq")
  kaganga = kaganga.replace("qF", 'Fq')
  kaganga = kaganga.replace("iqF", 'Fiq')
  kaganga = kaganga.replace("uqF", 'Fuq')
  kaganga = kaganga.replace("eqF", 'Feq')
  kaganga = kaganga.replace("oqF", 'Foq')
  kaganga = kaganga.replace("qxK", 'qK')
  kaganga = kaganga.replace("qN", 'Nq')
  kaganga = kaganga.replace("iqN", 'Niq')
  kaganga = kaganga.replace("uqN", 'Nuq')
  kaganga = kaganga.replace("eqN", 'Neq')
  kaganga = kaganga.replace("oqN", 'Noq')
  kaganga = kaganga.replace("qM", "Mq")
  kaganga = kaganga.replace("iqM", "Miq")
  kaganga = kaganga.replace("uqM", "Muq")
  kaganga = kaganga.replace("eqM", "Meq")
  kaganga = kaganga.replace("oqM", "Moq")
  kaganga = kaganga.replace("Dxa", "D")
  kaganga = kaganga.replace("Dxia", "iD")
  kaganga = kaganga.replace("Dxua", "uD")
  kaganga = kaganga.replace("Dxea", "eD")
  kaganga = kaganga.replace("Dxoa", "oD")
  kaganga = kaganga.replace("DF", 'FD')
  kaganga = kaganga.replace("iDF", 'FiD')
  kaganga = kaganga.replace("uDF", 'FuD')
  kaganga = kaganga.replace("eDF", 'FeD')
  kaganga = kaganga.replace("oDF", 'FoD')
  kaganga = kaganga.replace("DxK", 'DK')
  kaganga = kaganga.replace("DN", 'ND')
  kaganga = kaganga.replace("iDN", 'NiD')
  kaganga = kaganga.replace("uDN", 'NuD')
  kaganga = kaganga.replace("eDN", 'NeD')
  kaganga = kaganga.replace("oDN", 'NoD')
  kaganga = kaganga.replace("DM", "MD")
  kaganga = kaganga.replace("iDM", "MiD")
  kaganga = kaganga.replace("uDM", "MuD")
  kaganga = kaganga.replace("eDM", "MeD")
  kaganga = kaganga.replace("oDM", "MoD")
  kaganga = kaganga.replace("mbxa", "B")
  kaganga = kaganga.replace("mbxia", "iB")
  kaganga = kaganga.replace("mbxua", "uB")
  kaganga = kaganga.replace("mbxea", "eB")
  kaganga = kaganga.replace("mbxoa", "oB")
  kaganga = kaganga.replace("BxK", 'BK')
  kaganga = kaganga.replace("BM", "MB")
  kaganga = kaganga.replace("iBM", "MiB")
  kaganga = kaganga.replace("uBM", "MuB")
  kaganga = kaganga.replace("eBM", "MeB")
  kaganga = kaganga.replace("oBM", "MoB")
  kaganga = kaganga.replace("Na", "n")
  kaganga = kaganga.replace("nia", "in")
  kaganga = kaganga.replace("nua", "un")
  kaganga = kaganga.replace("nea", "en")
  kaganga = kaganga.replace("noa", "on")
  kaganga = kaganga.replace("nF", 'Fn')
  kaganga = kaganga.replace("inF", 'Fin')
  kaganga = kaganga.replace("unF", 'Fun')
  kaganga = kaganga.replace("enF", 'Fen')
  kaganga = kaganga.replace("onF", 'Fon')
  kaganga = kaganga.replace("nK", 'nK')
  kaganga = kaganga.replace("nN", 'Nn')
  kaganga = kaganga.replace("inN", 'Nni')
  kaganga = kaganga.replace("unN", 'Nnu')
  kaganga = kaganga.replace("enN", 'Nne')
  kaganga = kaganga.replace("onN", 'Nno')
  kaganga = kaganga.replace("nM", "Mn")
  kaganga = kaganga.replace("inM", "Min")
  kaganga = kaganga.replace("unM", "Mun")
  kaganga = kaganga.replace("enM", "Men")
  kaganga = kaganga.replace("onM", "Mon")
  kaganga = kaganga.replace("pxa", "p")
  kaganga = kaganga.replace("pxia", "ip")
  kaganga = kaganga.replace("pxua", "up")
  kaganga = kaganga.replace("pxea", "ep")
  kaganga = kaganga.replace("pxoa", "op")
  kaganga = kaganga.replace("pF", 'Fp')
  kaganga = kaganga.replace("ipF", 'Fip')
  kaganga = kaganga.replace("upF", 'Fup')
  kaganga = kaganga.replace("epF", 'Fep')
  kaganga = kaganga.replace("opF", 'Fop')
  kaganga = kaganga.replace("pxK", 'pK')
  kaganga = kaganga.replace("pN", 'Np')
  kaganga = kaganga.replace("ipN", 'Nip')
  kaganga = kaganga.replace("upN", 'Nup')
  kaganga = kaganga.replace("epN", 'Nep')
  kaganga = kaganga.replace("opN", 'Nop')
  kaganga = kaganga.replace("pM", "Mp")
  kaganga = kaganga.replace("ipM", "Mip")
  kaganga = kaganga.replace("upM", "Mup")
  kaganga = kaganga.replace("epM", "Mep")
  kaganga = kaganga.replace("opM", "Mop")
  kaganga = kaganga.replace("jxa", "j")
  kaganga = kaganga.replace("jxia", "ij")
  kaganga = kaganga.replace("jxua", "uj")
  kaganga = kaganga.replace("jxea", "ej")
  kaganga = kaganga.replace("jxoa", "oj")
  kaganga = kaganga.replace("jF", 'Fj')
  kaganga = kaganga.replace("ijF", 'Fij')
  kaganga = kaganga.replace("ujF", 'Fuj')
  kaganga = kaganga.replace("ejF", 'Fej')
  kaganga = kaganga.replace("ojF", 'Foj')
  kaganga = kaganga.replace("jxK", 'jK')
  kaganga = kaganga.replace("jN", 'N')
  kaganga = kaganga.replace("ijN", 'Nij')
  kaganga = kaganga.replace("ujN", 'Nuj')
  kaganga = kaganga.replace("ejN", 'Nej')
  kaganga = kaganga.replace("ojN", 'Noj')
  kaganga = kaganga.replace("jM", "Mj")
  kaganga = kaganga.replace("ijM", "Mij")
  kaganga = kaganga.replace("ujM", "Muj")
  kaganga = kaganga.replace("ejM", "Mej")
  kaganga = kaganga.replace("ojM", "Moj")
  kaganga = kaganga.replace("nyxa", "v")
  kaganga = kaganga.replace("nyxia", "iv")
  kaganga = kaganga.replace("nyxua", "uv")
  kaganga = kaganga.replace("nyxea", "ev")
  kaganga = kaganga.replace("nyxoa", "ov")
  kaganga = kaganga.replace("vF", 'Fv')
  kaganga = kaganga.replace("ivF", 'Fiv')
  kaganga = kaganga.replace("uvF", 'Fuv')
  kaganga = kaganga.replace("evF", 'Fev')
  kaganga = kaganga.replace("ovF", 'Fov')
  kaganga = kaganga.replace("vxK", 'vK')
  kaganga = kaganga.replace("vN", 'Nv')
  kaganga = kaganga.replace("ivN", 'Niv')
  kaganga = kaganga.replace("uvN", 'Nuv')
  kaganga = kaganga.replace("evN", 'Nev')
  kaganga = kaganga.replace("ovN", 'Nov')
  kaganga = kaganga.replace("vM", "M")
  kaganga = kaganga.replace("ivM", "Miv")
  kaganga = kaganga.replace("uvM", "Muv")
  kaganga = kaganga.replace("evM", "Mev")
  kaganga = kaganga.replace("ovM", "Mov")
  kaganga = kaganga.replace("sxa", "s")
  kaganga = kaganga.replace("sxia", "is")
  kaganga = kaganga.replace("sxua", "us")
  kaganga = kaganga.replace("sxea", "es")
  kaganga = kaganga.replace("sxoa", "os")
  kaganga = kaganga.replace("sF", 'Fs')
  kaganga = kaganga.replace("isF", 'Fis')
  kaganga = kaganga.replace("usF", 'Fus')
  kaganga = kaganga.replace("esF", 'Fes')
  kaganga = kaganga.replace("osF", 'Fos')
  kaganga = kaganga.replace("sxK", 'sK')
  kaganga = kaganga.replace("sN", 'Ns')
  kaganga = kaganga.replace("isN", 'Nis')
  kaganga = kaganga.replace("usN", 'Nus')
  kaganga = kaganga.replace("esN", 'Nes')
  kaganga = kaganga.replace("osN", 'Nos')
  kaganga = kaganga.replace("sM", "Ms")
  kaganga = kaganga.replace("isM", "Mis")
  kaganga = kaganga.replace("usM", "Mus")
  kaganga = kaganga.replace("esM", "Mes")
  kaganga = kaganga.replace("osM", "Mos")
  kaganga = kaganga.replace("rxa", "r")
  kaganga = kaganga.replace("rxia", "ir")
  kaganga = kaganga.replace("rxua", "ur")
  kaganga = kaganga.replace("rxea", "er")
  kaganga = kaganga.replace("rxoa", "or")
  kaganga = kaganga.replace("rF", 'Fr')
  kaganga = kaganga.replace("irF", 'Fir')
  kaganga = kaganga.replace("urF", 'Fur')
  kaganga = kaganga.replace("erF", 'Fer')
  kaganga = kaganga.replace("orF", 'For')
  kaganga = kaganga.replace("rxK", 'rK')
  kaganga = kaganga.replace("rN", 'Nr')
  kaganga = kaganga.replace("irN", 'Nir')
  kaganga = kaganga.replace("urN", 'Nur')
  kaganga = kaganga.replace("erN", 'Ner')
  kaganga = kaganga.replace("orN", 'Nor')
  kaganga = kaganga.replace("rM", "Mr")
  kaganga = kaganga.replace("irM", "Mir")
  kaganga = kaganga.replace("urM", "Mur")
  kaganga = kaganga.replace("erM", "Mer")
  kaganga = kaganga.replace("orM", "Mor")
  kaganga = kaganga.replace("lxa", "l")
  kaganga = kaganga.replace("lxia", "il")
  kaganga = kaganga.replace("lxua", "ul")
  kaganga = kaganga.replace("lxea", "el")
  kaganga = kaganga.replace("lxoa", "ol")
  kaganga = kaganga.replace("lF", 'Fl')
  kaganga = kaganga.replace("ilF", 'Fil')
  kaganga = kaganga.replace("ulF", 'Ful')
  kaganga = kaganga.replace("elF", 'Fel')
  kaganga = kaganga.replace("olF", 'Fol')
  kaganga = kaganga.replace("lxK", 'lK')
  kaganga = kaganga.replace("lN", 'Nl')
  kaganga = kaganga.replace("ilN", 'Nil')
  kaganga = kaganga.replace("ulN", 'Nul')
  kaganga = kaganga.replace("elN", 'Nel')
  kaganga = kaganga.replace("olN", 'Nol')
  kaganga = kaganga.replace("lM", "Ml")
  kaganga = kaganga.replace("ilM", "Mil")
  kaganga = kaganga.replace("ulM", "Mul")
  kaganga = kaganga.replace("elM", "Mel")
  kaganga = kaganga.replace("olM", "Mol")
  kaganga = kaganga.replace("yxa", "y")
  kaganga = kaganga.replace("yxia", "iy")
  kaganga = kaganga.replace("yxua", "uy")
  kaganga = kaganga.replace("yxea", "ey")
  kaganga = kaganga.replace("yxoa", "oy")
  kaganga = kaganga.replace("yF", 'Fy')
  kaganga = kaganga.replace("iyF", 'Fiy')
  kaganga = kaganga.replace("uyF", 'Fuy')
  kaganga = kaganga.replace("eyF", 'Fey')
  kaganga = kaganga.replace("oyF", 'Foy')
  kaganga = kaganga.replace("yxK", 'yK')
  kaganga = kaganga.replace("yN", 'Ny')
  kaganga = kaganga.replace("iyN", 'Niy')
  kaganga = kaganga.replace("uyN", 'Nuy')
  kaganga = kaganga.replace("eyN", 'Ney')
  kaganga = kaganga.replace("oyN", 'Noy')
  kaganga = kaganga.replace("yM", "My")
  kaganga = kaganga.replace("iyM", "Miy")
  kaganga = kaganga.replace("uyM", "Muy")
  kaganga = kaganga.replace("eyM", "Mey")
  kaganga = kaganga.replace("oyM", "Moy")
  kaganga = kaganga.replace("wxa", "w")
  kaganga = kaganga.replace("wxia", "iw")
  kaganga = kaganga.replace("wxua", "uw")

  kaganga = kaganga.replace("wxea", "ew")
  kaganga = kaganga.replace("wxoa", "ow")
  kaganga = kaganga.replace("wxi", "iw")
  kaganga = kaganga.replace("wxu", "uw")

  kaganga = kaganga.replace("wxe", "ew")
  kaganga = kaganga.replace("wxo", "ow")
  kaganga = kaganga.replace("wF", 'Fw')
  kaganga = kaganga.replace("iwF", 'Fiw')
  kaganga = kaganga.replace("uwF", 'Fuw')
  kaganga = kaganga.replace("ewF", 'Few')
  kaganga = kaganga.replace("owF", 'Fow')
  kaganga = kaganga.replace("wxK", 'wK')
  kaganga = kaganga.replace("wN", 'Nw')
  kaganga = kaganga.replace("iwN", 'Niw')
  kaganga = kaganga.replace("uwN", 'Nuw')
  kaganga = kaganga.replace("ewN", 'New')
  kaganga = kaganga.replace("owN", 'Now')
  kaganga = kaganga.replace("wM", "Mw")
  kaganga = kaganga.replace("iwM", "Miw")
  kaganga = kaganga.replace("uwM", "Muw")
  kaganga = kaganga.replace("ewM", "Mew")
  kaganga = kaganga.replace("owM", "Mow")
  kaganga = kaganga.replace("hxa", "h")
  kaganga = kaganga.replace("hxia", "ih")
  kaganga = kaganga.replace("hxua", "uh")
  kaganga = kaganga.replace("hxea", "eh")
  kaganga = kaganga.replace("hxoa", "oh")
  kaganga = kaganga.replace("hF", 'Fh')
  kaganga = kaganga.replace("ihF", 'Fih')
  kaganga = kaganga.replace("uhF", 'Fuh')
  kaganga = kaganga.replace("ehF", 'Feh')
  kaganga = kaganga.replace("ohF", 'Foh')
  kaganga = kaganga.replace("hxK", 'hK')
  kaganga = kaganga.replace("hN", 'Nh')
  kaganga = kaganga.replace("ihN", 'Nih')
  kaganga = kaganga.replace("uhN", 'Nuh')
  kaganga = kaganga.replace("ehN", 'Neh')
  kaganga = kaganga.replace("ohN", 'Noh')
  kaganga = kaganga.replace("hM", "Mh")
  kaganga = kaganga.replace("ihM", "Mih")
  kaganga = kaganga.replace("uhM", "Muh")
  kaganga = kaganga.replace("ehM", "Meh")
  kaganga = kaganga.replace("ohM", "Moh")
  kaganga = kaganga.replace("kxa", "k")
  kaganga = kaganga.replace("kxia", "ik")
  kaganga = kaganga.replace("kxua", "uk")
  kaganga = kaganga.replace("kxu", "uk")
  kaganga = kaganga.replace("kxea", "ek")
  kaganga = kaganga.replace("kxoa", "ok")
  kaganga = kaganga.replace("kF", 'Fk')
  kaganga = kaganga.replace("ikF", 'Fik')
  kaganga = kaganga.replace("ukF", 'Fuk')
  kaganga = kaganga.replace("ekF", 'Fek')
  kaganga = kaganga.replace("okF", 'Fok')
  kaganga = kaganga.replace("kxK", 'kK')
  kaganga = kaganga.replace("kN", 'Nk')
  kaganga = kaganga.replace("ikN", 'Nik')
  kaganga = kaganga.replace("ukN", 'Nuk')
  kaganga = kaganga.replace("ekN", 'Nek')
  kaganga = kaganga.replace("okN", 'Nok')
  kaganga = kaganga.replace("kM", "Mk")
  kaganga = kaganga.replace("ikM", "Mik")
  kaganga = kaganga.replace("ukM", "Muk")
  kaganga = kaganga.replace("ekM", "Mek")
  kaganga = kaganga.replace("okM", "Mok")
  kaganga = kaganga.replace("gxa", "g")
  kaganga = kaganga.replace("gxia", "gia")
  kaganga = kaganga.replace("gxua", "gua")
  kaganga = kaganga.replace("gxea", "gea")
  kaganga = kaganga.replace("gxoa", "goa")
  kaganga = kaganga.replace("gia", "ig")
  kaganga = kaganga.replace("gua", "ug")
  kaganga = kaganga.replace("gea", "eg")
  kaganga = kaganga.replace("goa", "og")
  kaganga = kaganga.replace("gF", 'Fg')
  kaganga = kaganga.replace("igF", 'Fig')
  kaganga = kaganga.replace("ugF", 'Fug')
  kaganga = kaganga.replace("egF", 'Feg')
  kaganga = kaganga.replace("ogF", 'Fog')
  kaganga = kaganga.replace("gxK", 'gK')
  kaganga = kaganga.replace("gM", "Mg")
  kaganga = kaganga.replace("igM", "Mig")
  kaganga = kaganga.replace("ugM", "Mug")
  kaganga = kaganga.replace("egM", "Meg")
  kaganga = kaganga.replace("ogM", "Mog")
kaganga = kaganga.replace("gN", 'Ng')
  kaganga = kaganga.replace("igN", 'Nig')
  kaganga = kaganga.replace("ugN", 'Nug')
  kaganga = kaganga.replace("egN", 'Neg')
  kaganga = kaganga.replace("ogN", 'Nog')
  kaganga = kaganga.replace("tN", 'Nt')
  kaganga = kaganga.replace("tiaN", 'Nit')
  kaganga = kaganga.replace("tuaN", 'Nut')
  kaganga = kaganga.replace("teaN", 'Net')
  kaganga = kaganga.replace("toaN", 'Not')

  kaganga = kaganga.replace("tn", 'Nt')
  kaganga = kaganga.replace("tian", 'Nit')
  kaganga = kaganga.replace("tuan", 'Nut')
  kaganga = kaganga.replace("tean", 'Net')
  kaganga = kaganga.replace("toan", 'Not')
  return kaganga
}

const uri = process.env.MONGODBURI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Increase the server selection timeout
})
  .then(() => {
    app.listen(2203, (req, res) => {
      Host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0'
    })
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

