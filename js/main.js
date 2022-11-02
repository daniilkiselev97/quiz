
const answers = {
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,

}

//Движение вперед
const btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(button => {
    button.addEventListener ('click' , function() {
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card)

        if (thisCard.dataset.validate == 'novalidate') {
            navigate('next', thisCard);
            updateProgressBar('next', thisCardNumber );

        } else {
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            // Валидация на заполенность
            if ((isFilled (thisCardNumber) ) && (checkOnRequired (thisCardNumber) ) ){
                navigate('next', thisCard);
                updateProgressBar('next', thisCardNumber );


            } else {
                alert("Сделайте ответ, прежде чем переходить далее")
            }

        }

    })
});


//Движение назад
const btnPrev = document.querySelectorAll('[data-nav="prev"]')
btnPrev.forEach(button => {
    button.addEventListener ('click' , function() {
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card)
        navigate('prev', thisCard);
        updateProgressBar('prev', thisCardNumber )

        
    })
});


function navigate (direction, thisCard) {
    let nextCard;
    let thisCardNumber = parseInt(thisCard.dataset.card)

    if (direction == 'next') {
    nextCard = thisCardNumber + 1;
    } else {
    nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add('hidden');
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden')


}

// Функция сбора заполненных данных
function gatherCardData (number) {
    let question;
    let result = [];

    //Находим карточку по номеру и дата-атрибуту
    let currentCard = document.querySelector(`[data-card="${number}"]`);

    //Находим главный вопрос карточки
    question = currentCard.querySelector('[data-question]').innerText

    //1.Находим все заполненные значения из радиокнопок
    let radioValues = currentCard.querySelectorAll('[type="radio"]')
    radioValues.forEach(item => {
        if(item.checked) {
            result.push ({
                name: item.name,
                value: item.value
            })
        }
    })


    //Находим все заполненные значения по чекбоксам
    let checkboxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkboxValues.forEach(item => {
        if(item.checked) {
            result.push ({
                name: item.name,
                value: item.value
            })
        }

    })

    //Находим все значения из инпутов
    let inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(item =>{
        itemValue = item.value
        if(itemValue.trim() !=''){
            result.push ({
                name: item.name,
                value: item.value
            })
        }
    })



    let data = {
        question : question,
        answer : result
    }

    return data

    }

    //Функция записи ответа в ответ с ответами
    function saveAnswer(number, data) {
        answers[number] = data
    }

    // saveAnswer(2, gatherCardData(number))

    function isFilled(number) {
        if(answers[number].answer.length > 0) {
            return true
        } else {
            return false
        }
    }

    //Функция на проверку email 
    function validateEmail (email) {
        var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        return pattern.test(email)
    }

    //Проверка на заполненность required чекбоксов и инпутов с email

    function checkOnRequired(number) {
        let currentCard = document.querySelector(`[data-card="${number}"]`);
        let requiredFills = currentCard.querySelectorAll('[required]');

        let isValidArray = []

        requiredFills.forEach(item => {

            if (item.type == 'checkbox' && item.checked == false) {
                    isValidArray.push(false)
            } else if (item.type == 'email' ) {

                if (validateEmail (item.value)) {
                    isValidArray.push(true)
                } else {
                    isValidArray.push(false)
                }

            }

        })

        if (isValidArray.indexOf(false) == -1) {
            return true
        } else {
            return false
        }


    }


    //Подсвечиваем рамку у радиокнопок
    document.querySelectorAll('.radio-group').forEach(item => {
        item.addEventListener('click', function(e) {
            //Проверяем, где произошел клик внутри тега label или нет
            let label = e.target.closest('label')
            if (label) {
                //Отменяем активный класс у всех тегов label
                label.closest('.radio-group').querySelectorAll('label').forEach(item => {
                    item.classList.remove('radio-block--active')
                })
                //Добавляем активный класс к текущему label
                label.classList.add('radio-block--active')
            }

        })
    })

    //Подсвечиваем рамку у чекбоксов
    document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(item => {
        item.addEventListener('change', function () {
            //Если чекбокс проставлен то
            if(item.checked){
                item.closest('label').classList.add('checkbox-block--active')

            } else {
                item.closest('label').classList.remove('checkbox-block--active')
            }
        })
    })

    //Отображение прогресс бара
    
    function updateProgressBar (direction, cardNumber) {

        //Расчет всего количества карточек
        let cardsTotalNumver = document.querySelectorAll('[data-card]').length

        //Текущая карточка
        //Проверка перемещения
        if (direction == 'next') {
            cardNumber = cardNumber + 1

        } else if (direction == 'prev') {
            cardNumber = cardNumber - 1

        }


        //Расчет % прохождения

        let progress = ( (cardNumber * 100) / cardsTotalNumver ).toFixed()

        //Обновляем прогресс бар

        let progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector('.progress');

        if(progressBar) {

            //Обновить число прогресс бара
            progressBar.querySelector('.progress__label strong').innerText = `${progress}%`;
            //Обновить полоску прогресс бара

            progressBar.querySelector('.progress__line-bar').style = `width : ${progress}%`
            
        }

    }

   





