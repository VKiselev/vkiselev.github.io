$(function() {
    var err_flag = false,
        clases = 'col-lg-offset-8 col-md-offset-7 col-sm-offset-6',
        wishes = [],
        lsKey = 'wishes',
        isFetch = false;

    fetch();

    document.getElementsByClassName('shade')[0].addEventListener('click', closeEditView);

    if (!window.localStorage) {
        console.warn('Your browser dosent support localStorage');
    }

    //Add wish form (slider)
   $('#slide-form').on('click', function () {
       $('.add-form').slideToggle('slow');
       testingFillForm();
   });

    //submit
   $('button:submit').on('click', {target: true}, onsubmit);

    fetch();

    function fetch () {
        var i = 0;
        if (localStorage.getItem(lsKey) != null && localStorage.getItem(lsKey) !== 'null' && !isFetch) {
            wishes = JSON.parse(localStorage.getItem(lsKey));

            for (i; i < wishes.length; i++) {
                renderWishEl(wishes[i]);
            }

            isFetch = true;
        }

    }

    function push (wishes) {
        localStorage.setItem(lsKey, JSON.stringify(wishes))
    }

    function onsubmit (event) {
        event.preventDefault();
        if(!(event.target.id === 'slide-form')
            && !(event.target.id === "edit-btn")) {
            console.log('submit');
            validate();
        }
    }

    function validate () {
        var wish = {};

        wish.login = $('#input-name').val();
        wish.email = $('#input-email').val();
        wish.tele = $('#input-telnum').val();
        wish.newWish = $('#tarea').val();

        $('#error-log').html('');

        err_flag = checkFields(wish);

        if (err_flag) {
            saveWish (wish);
            clearForm();
            disableErrorMesages();
        } else {
            enableErrorMessages();
        }
    }

    //all validatin logic
    function checkFields (wish) {
        var regexp;

        err_flag = true;
        if (!wish.login){
            errors('Вы не указали своё имя !');
            err_flag = false;
        } else {
            if ((wish.login.length) <= 3) {
                errors('Ваше имя менее 4 символов !');
                err_flag = false;
            } else {
                regexp = /^[a-zA-Zа-яА-Я _-]{4,16}$/g;
                if (!regexp.test(wish.login)) {
                    errors('Ваше имя должно состоять только из букв !');
                    err_flag = false;
                }
            }
        }

        if (!wish.email){
            errors('Вы не указали адрес своей электронной почты !');
            err_flag = false;
        }

        if (!wish.tele){
            errors('Вы не указали свой номер телефона !');
            err_flag = false;
        } else {
//            regexp = /^[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}$/g;
            regexp = /^\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/g;
            if (!regexp.test(wish.tele)){
                errors('Формат № телефона не совпадает с типовым !');
                err_flag = false;
            }
        }
        if (!wish.newWish){
            errors('Вы не указали Ваше новое желание !');
            err_flag = false;
        }
        return err_flag;
    }

    function errors (error_message){
        var	errorContainer,
            errorEl;

        errorContainer = document.getElementById('error-log');
        errorEl = document.createElement('DIV');
        errorEl.innerHTML = (error_message);
        errorContainer.appendChild(errorEl);
    }

    function enableErrorMessages () {
        $('#error-log').removeClass('hide-el');
        $('.form-container').removeClass(clases);
    }

    function disableErrorMesages () {
        $('#error-log').addClass('hide-el');
        $('.form-container').addClass(clases);
    }

    function saveWish (wish) {
        console.log('save!');

        var newWishEl = renderWishEl(wish);

        wish.id = generateId();
        newWishEl.id = wish.id;
        wishes.push(wish);

        push(wishes);
    }

    function renderWishEl (wish) {
        var wishContainer = document.getElementById('wish-container'),
            delEl = document.createElement('DIV'),
            editEl = document.createElement('DIV'),
            newItem = document.createElement('DIV'),
            firstDiv = wishContainer.getElementsByTagName('DIV')[0];

        delEl.className = 'delete';
        editEl.className = 'edit';

        delEl.addEventListener('click', deleteWish);
        editEl.addEventListener('click', editWish);

        newItem.appendChild(editEl);
        newItem.appendChild(delEl);

        newItem.appendChild(document.createTextNode(wish.newWish));
        newItem.className = 'col-lg-2 col-md-3 col-sm-4 col-xs-6 wish';

        if (wish.id) {
            newItem.id = wish.id;
        }

        wishContainer.insertBefore(newItem, firstDiv);

        return newItem;
    }

    function deleteWish (event) {
        console.log('delete');
        var targetItem = event.srcElement.parentElement,
            i = 0;

        for (i; i < wishes.length; i++) {
            if (wishes[i].id === targetItem.id) wishes.splice(i, 1);
        }
        push(wishes);
        targetItem.parentElement.removeChild(targetItem);
    }

    function editWish (event) {
        console.log('edit');
        var targetItem = event.srcElement.parentElement,
            i = 0;
        for (i; i < wishes.length; i++) {
            if (wishes[i].id === targetItem.id) wish = wishes[i];
        }

        renderEditView(wish);
    }

    function renderEditView (wish) {
        document.getElementById('edit-name').value = wish.login;
        document.getElementById('edit-email').value = wish.email;
        document.getElementById('edit-telnum').value = wish.tele;
        document.getElementById('edit-tarea').value = wish.newWish;
        document.getElementsByClassName('shade')[0].style.display = 'block';
        document.getElementsByClassName('editForm')[0].style.display = 'block';
        document.getElementById('edit-btn').addEventListener('click', saveChanges);
    }

    function closeEditView () {
        document.getElementsByClassName('shade')[0].style.display = 'none';
        document.getElementsByClassName('editForm')[0].style.display = 'none';
    }

    function saveChanges () {
        console.log('save changes');
        wishSave(wish);
    }

    function wishSave(wish){
        var oper;
        wish.login = document.getElementById('edit-name').value;
        wish.email = document.getElementById('edit-email').value;
        wish.tele = document.getElementById('edit-telnum').value;
        wish.newWish = document.getElementById('edit-tarea').value;
        oper = document.getElementById(wish.id);
        opera = oper.lastChild;
        oper.removeChild(opera);
        oper.appendChild(document.createTextNode(wish.newWish));
        for (var i = 0; i < wishes.length; i++) {
            if (wishes[i].id === wish.id) wishes[i] = wish;
        }
        push(wishes);
        closeEditView();
    }

    function generateId () {
        return 'id' + Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
    }

    function clearForm () {
        $('#input-name').val('');
        $('#input-email').val('');
        $('#input-telnum').val('');
        $('#tarea').val('');
    }

    //func for quic testing (remove in release ver)
    function testingFillForm () {
        $('#input-name').val('Valentin');
        $('#input-email').val('valkis09@mail.ru');
        $('#input-telnum').val('(999)333-12-34');
        $('#tarea').val('My wish');
    }
});