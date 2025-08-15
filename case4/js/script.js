class NYCountdown {
  constructor() {
    // Получаю текущую дату и элементы страницы
    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
    this.initElements();
    this.setupEventListeners();
  }

  // Инициализация элементов DOM
  initElements() {
    this.calculateBtn = document.getElementById('calculateBtn'); // Кнопка "Рассчитать"
    this.dateInput = document.getElementById('dateInput'); // Инпут даты
    this.daysResult = document.getElementById('daysResult'); // Рез. дней
    this.leapYearResult = document.getElementById('leapYearResult'); // Виосокосный/не високосный
  }

  // Настройка ивентов
  setupEventListeners() {
    this.dateInput.addEventListener('input', this.handleInput.bind(this));
    this.dateInput.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.dateInput.addEventListener('keypress', this.handleKeyPress.bind(this));
    this.calculateBtn.addEventListener('click', this.calculate.bind(this));
  }

  // Обработка ввода с автокоррекцией символов
  handleInput(e) {
    let value = e.target.value.replace(/\D/g, ''); // Отсекаю ненужные символи регуляркой
    const parts = {
      day: value.substring(0, 2),
      month: value.substring(2, 4),
      year: value.substring(4, 8),
    };

    // Автоматическая коррекция неверных значений
    const corrected = {
      day: this.correctDay(parts.day),
      month: this.correctMonth(parts.month),
      year: this.correctYear(parts.year),
    };

    e.target.value = this.formatDate(corrected);
  }

  // Коррекция дня (01-31)
  correctDay(day) {
    if (day.length === 2) {
      const dayNum = parseInt(day, 10);
      return dayNum > 31 || dayNum < 1 ? '01' : day.padStart(2, '0'); // Редактирует значение дней, если оно < 01 или > 31, то автоматически подставялет 01.
    }
    return day;
  }

  // Коррекция месяца (01-12)
  correctMonth(month) {
    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      return monthNum > 12 || monthNum < 1 ? '01' : month.padStart(2, '0'); // Редактирует значение месяцев, если оно < 01 или > 12, то автоматически подставялет 01.
    }
    return month;
  }

  // Коррекция года (0001-9999)
  correctYear(year) {
    if (year.length === 4) {
      const yearNum = parseInt(year, 10);
      if (yearNum === 0) return this.currentYear.toString();
      if (yearNum > 9999) return '9999';
      return year.padStart(4, '0'); // Редактирует значение месяцев, если оно < 0001 или > 9999, то автоматически подставялет текущую дату.
    }
    return year;
  }

  // Форматирование даты в ДД.ММ.ГГГГ
  formatDate({ day, month, year }) {
    let result = day;
    if (month) result += `.${month}`;
    if (year) result += `.${year}`;
    return result.substring(0, 10);
  }

  // Блокировка нечисловых символов
  handleKeyDown(e) {
    const allowedKeys = [46, 8, 9, 27, 13, 37, 38, 39, 40];
    const isDigit = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);

    if (!allowedKeys.includes(e.keyCode) && !isDigit) {
      e.preventDefault();
    }
  }

  // Обработка нажатия Enter, чтобы при нажатии можно было сразу нажать по кнопке расчет.
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.calculate();
    }
  }

  // Основная функция расчета, вызывает методы выше
  calculate() {
    try {
      const dateString = this.dateInput.value.trim();
      this.validateInput(dateString);

      const { day, month, year } = this.parseDate(dateString);
      const inputDate = this.createValidDate(day, month, year);

      const days = this.calculateDaysToNY(inputDate, year);
      this.displayResults(days, year);
    } catch (error) {
      alert(error.message);
    }
  }

  // Проверка формата ввода
  validateInput(dateString) {
    if (!dateString) throw new Error('Пожалуйста, введите дату'); // Выводит ошибку, если инпут пустой

    const dateParts = dateString.split('.'); // Разделяет дату точкам автоматически
    if (
      dateParts.length !== 3 ||
      dateParts[0].length !== 2 ||
      dateParts[1].length !== 2 ||
      dateParts[2].length < 4
    ) {
      throw new Error('Неверный формат даты. Введите дату в формате ДД.ММ.ГГГГ'); // На всякий случай сделана проверка, если юзер каким-то образом сможет вставить дату длинее, либо запретные символы
    }
  }

  // Разделяет дату точкам автоматически
  parseDate(dateString) {
    const [day, month, year] = dateString.split('.');
    return {
      day: parseInt(day, 10),
      month: parseInt(month, 10),
      year: parseInt(year, 10),
    };
  }

  // Создание и проверка даты
  createValidDate(day, month, year) {
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      throw new Error('Введена некорректная дата');
    }
    return date;
  }

  // Расчет дней до Нового года
  calculateDaysToNY(inputDate, year) {
    const newYearDate = new Date(year, 11, 31);

    // Логика для разных годов, если год меньше или больше
    if (year < this.currentYear) {
      return this.getDaysBetween(inputDate, newYearDate); // Если год меньше текущего года, то считаем дни до НГ года, который ввел клиент
    } else if (year === this.currentYear) {
      return this.getDaysBetween(inputDate, newYearDate); // Если год равен текущему году, то считаем дни до текущего года
    } else {
      return this.getDaysBetween(this.currentDate, newYearDate); //
    }
  }

  // Расчет разницы между датами в днях
  getDaysBetween(start, end) {
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  // Проверка на високосный год
  isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0); // Високосный делится нацело на 4, но не кратен 100, но если кратен 400 - то високосный
  }

  // Вывод результатов
  displayResults(days, year) {
    this.daysResult.textContent = days;
    this.leapYearResult.textContent = this.isLeapYear(year) ? 'Да' : 'Нет';
  }
}

// Запуск приложения после загрузки страницы
document.addEventListener('DOMContentLoaded', () => new NYCountdown());
