// Прямой тест Yandex GPT API
const axios = require('axios');

async function testYandexGPT() {
  const apiKey = process.env.YANDEX_API_KEY || process.env.YANDEX_GPT_API_KEY;
  const folderId = process.env.YANDEX_FOLDER_ID || process.env.YANDEX_GPT_FOLDER_ID;
  
  console.log('Testing Yandex GPT API...');
  console.log('API Key:', apiKey ? 'SET' : 'NOT SET');
  console.log('Folder ID:', folderId ? 'SET' : 'NOT SET');
  
  if (!apiKey || !folderId) {
    console.error('❌ Yandex GPT not configured');
    return;
  }

  try {
    const response = await axios.post(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        modelUri: `gpt://${folderId}/yandexgpt/latest`,
        completionOptions: {
          stream: false,
          temperature: 0.6,
          maxTokens: "1000"
        },
        messages: [
          {
            role: "user",
            text: "Напиши короткий пост для ВКонтакте про кофе"
          }
        ]
      },
      {
        headers: {
          'Authorization': `Api-Key ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Yandex GPT API работает!');
    console.log('Ответ:', response.data.result.alternatives[0].message.text);
    console.log('Токены:', response.data.result.usage);
  } catch (error) {
    console.error('❌ Ошибка Yandex GPT API:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testYandexGPT();
