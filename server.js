const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // İstemciden gelen bağlantılara izin verin
        methods: ["GET", "POST"]
    }
});

// Socket.io olayları
io.on('connection', (socket) => {
    console.log('Yeni bir kullanıcı bağlandı');
    socket.emit('receiveNotification', 'Socket.io bağlantısı kuruldu!');
    socket.on('disconnect', () => {
        console.log('Bir kullanıcı ayrıldı.');
    });
});

// Orta katman (middleware)
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/appointmentDB')
    .then(() => console.log('MongoDB veritabanına bağlanıldı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

// MongoDB Şema
const appointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    date: String,
    time: String,
    membership: String,
    approved: { type: Boolean, default: false } // Randevu onayı için yeni alan
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Randevu Oluşturma (POST)
app.post('/appointments', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(200).send('Randevu başarıyla kaydedildi!');
    } catch (err) {
        console.error('Randevu kaydedilemedi:', err);
        res.status(500).send('Randevu kaydedilirken bir hata oluştu.');
    }
});

// Tüm Randevuları Okuma (GET)
app.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({});
        res.json(appointments);
    } catch (err) {
        console.error('Randevular alınırken hata:', err);
        res.status(500).send('Randevular alınırken bir hata oluştu.');
    }
});

// Randevu Onaylama (PUT)
app.put('/appointments/approve/:id', async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        res.status(200).send('Randevu başarıyla onaylandı!');
    } catch (err) {
        console.error('Randevu onaylanırken hata:', err);
        res.status(500).send('Randevu onaylanırken bir hata oluştu.');
    }
});

// Randevu Silme (DELETE)
app.delete('/appointments/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.status(200).send('Randevu başarıyla silindi!');
    } catch (err) {
        console.error('Randevu silinirken hata:', err);
        res.status(500).send('Randevu silinirken bir hata oluştu.');
    }
});

// Multer kullanarak resim yükleme ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/'); // Yüklenen dosyaların kaydedileceği klasör
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Dosya ismi timestamp ile benzersiz yapılıyor
    }
});

const upload = multer({ storage: storage });

// Yüklenen resimleri sunmak için statik klasör
app.use('/images', express.static('images'));

// Resim yükleme (POST)
app.post('/upload', upload.single('imageFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Bir resim dosyası yükleyin.');
    }

    // Yüklenen dosyanın URL'sini döndürüyoruz
    const filePath = `http://localhost:3000/images/${req.file.filename}`;
    res.json({ imageUrl: filePath });
});

// Statik dosyaları sunma
app.use(express.static('public'));

// Sunucuyu başlatma
server.listen(3000, () => {
    console.log('Sunucu http://localhost:3000 adresinde çalışıyor');
});
