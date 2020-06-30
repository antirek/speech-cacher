# speech-cacher

- кеширует результаты записей фраз (tts) и распознанных записей (asr/stt) через Yandex.Cloud Speech API

- проксирует запросы ваших приложений к Yandex.Cloud Speech API

## Как работает

### Распознавание

Вы отправляете запись на speech-cacher, speech-cacher выдает id, в это время отправляет запись в Yandex.Cloud, где происходит распознание и возвращается текст. Затем по id в любое время вы можете получить результат распознавания. 

### Запись

Вы отправляете текст и параметры озвучивания на speech-cacher, speech-cacher выдает id, в это время отправляет текст для генерации звука в Ynadex.Cloud. Полученный файл затем можно получить в любое время по id. При повторной отправке того же текста и параметров вернется уже готовый кешированный результат.

## Конфигурация

- Укажите Yandex.Cloud API key в конфигурационном файле.

- Задайте токен доступа к API speech-cacher'а в формате UUIDv4 [Генератор UUID](https://www.uuidgenerator.net/)

## API

Доступна Swagger API спецификация по http://{ip}/v1/api/
