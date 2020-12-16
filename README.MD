---

# VG_range_slider

Плагин JQuery, представляющий собой слайдер с диапазоном значений.
Перемещение внутри слайдера осуществляется через бегунок(handle), диапазон(bar), шкалу(scale), либо через внешние настройки(settings).

### Клонирование репозитория

_Команды будут работать только в том случае, если на вашем компьютере установлен [git](https://git-scm.com/)_

```bash
$ mkdir range_slider
$ cd range_slider
$ git clone https://github.com/avatarsik6699/VG_slider.git
```

### Подключение и настройка слайдера

Для того чтобы начать пользоваться слайдером, вам необходимо подключить JQuery, js, css слайдера.
**Вариант с ручной установкой**
Вставить _JQuery_ и _VG_range_slider_ в конец **body** вашего **html** файла

```html
<script
  src="https://code.jquery.com/jquery-3.5.1.min.js"
  integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
  crossorigin="anonymous"
></script>
<script src="./range_slider/dist/app/VG_range_slider.js"></script>
```

Вставить _CSS_ в **head** вашего **html** файла

```html
<link href="./range_slider/dist/app/VG_range_slider.css"></script>
```

**Вариант с установкой через npm**

**Быстрое подключение слайдера без настроек**
`$('.js-root').slider()` --- отрисуется с настройками по-умолчанию.

**Подключение слайдера с настройками**
`$('.js-root').slider(settings)` --- отрисуется по заданным настройкам.

**settings** --- _представляет собой объект {}, который может принимать следующие параметры:_
| key | type | default | value |
| --- | ---- | ----- | ------- |
| max | number | 1000 | any number |
| min | number | 500 | any number |
| value | array | [50, 100] | any number |
| step | number | 5 | any number |
| position | string | horzintal| horzintal/vertical |
| type | string | range | single/range |
| scale | boolean | true | true/false |
| tooltip | boolean | true | true/false |
| bar | boolean | true | true/false |
| settings | boolean | true | true/false |

### Методы слайдера

В том случае, если 1 параметром в слайдер передана строка `$('.js-root').slider('method') `, то слайдер попытается найти данный метод и вызвать его. Если же данного метода нет, то выбросится ошибка о том, что данный метод не существует.
`$('.js-root').slider('hide')` --- скрывает слайдер.
`$('.js-root').slider('destroy')` --- уничтожает слайдер (удаляет все теги внутри .js-root).
`$('.js-root').slider('show')` --- показывает слайдер.

```js
$('.js-root').slider('getState', callback);
// Особый метод, принимающий в качестве 2 параметра callback функцию, которая вызывается
// при любом изменении в state слайдера. Callback может принимать 1 параметр - event,
// где имеется поле detail содержащее всю актуальную информацию об слайдере.
```

### Разработка

_Команды будут работать только в том случае, если на вашем компьютере установлены [Node](https://nodejs.org) и [npm](https://www.npmjs.com/)._
`$ npm test` --- запуск тестов Mocha + Chai
`$ npm build` --- production режим
`$ npm dev` --- development режим
`$ npm lint` --- проверка кода через ESlint + prettier

### Архитектура

### Внешние зависимости

В данной таблице описаны внешние зависимости слайдера.
| Плагин | Документация |
| ------ | ------------ |
| JQuery | api.jquery.com |

---
