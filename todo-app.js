(function() {
    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        // ! При загрузке блокируем кнопку создания дела
       // if (!input.value) {
        button.setAttribute('disabled', 'true');
       // }

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        };
    }

    //создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        let item = document.createElement('li');
        //кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        //устанавливаем стили для элемента списка, а так же для размещения кнопок
        //в его правой части с помощью Flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        //вкладываем кнопки в отдельный элемент, чтобы они объеденились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function createTodoApp(container, title = 'Список дел', initialList=[], localStorage, list) {
       let storageItems = [];

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        //браузер создает событие submit на форме по нажатию Enter или кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            
            //эта строчка необходима, чтобы предотвратить стандартное действие браузера
            //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            //игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
               // button.setAttribute('disabled');
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value);

            //добавляем обработчики на кнопки
            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success');
                // (4) Сохраняем в localStorage состояние done дела
                let storageArreyBegin3 = '';
                storageArreyBegin3 = localStorage.getItem(list);
                storageArrey = JSON.parse(storageArreyBegin3);
                let objDone2 = false;
                for (let key in storageArrey) {
                    if (todoItem.item.innerText.search(storageArrey[key].name) > -1) {
                        objDone2 = storageArrey[key].done; 
                        storageArrey[key].done = ! objDone2;
                    }
                }
                let serialStorageArrey3 ='';
                localStorage.clear();
                serialStorageArrey3 = JSON.stringify(storageArrey);    
                localStorage.setItem(list, serialStorageArrey3);
                //------
            });
            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    // (6) Удаляем дело из localStorage
                    let storageArreyBegin5 = '';
                    storageArreyBegin5 = localStorage.getItem(list);
                    storageArrey = JSON.parse(storageArreyBegin5);
                    let keyDelete2 = -1;
                    for (let key in storageArrey) {
                        if (todoItem.item.innerText.search(storageArrey[key].name) > -1) {
                            keyDelete2 = key;
                            //storageArrey.splice(index[, key, elem1, ..., elemN])
                        }
                    }
                    if (keyDelete2 > -1) {
                        storageArrey.splice(keyDelete2, 1);
                    }
                    let serialStorageArrey5 ='';
                    localStorage.clear();
                    serialStorageArrey5 = JSON.stringify(storageArrey);    
                    localStorage.setItem(list, serialStorageArrey5);
                    //------
                    todoItem.item.remove();
                }
            });
             //создаем и добавляем в список новое дело с названием из поля ввода
             todoList.append(todoItem.item);  
             // (1) При создании дела сохраняем его в localStorage
             let serialStorageArrey = '';
             storageArrey.push({name:todoItemForm.input.value, done: false});
             localStorage.clear();
             serialStorageArrey = JSON.stringify(storageArrey);    
             localStorage.setItem(list, serialStorageArrey);
             //----          
             //обнуляем значениев поле, чтобы не пришлось стирать его вручную
             todoItemForm.input.value ='';

             // ! после ввода дела блокируем кнопку создания дела, т.к. поле ввода пустое
             todoItemForm.button.setAttribute('disabled', 'true');
         });
         // ! при вводе значения в поле, если поле не пустое, разблокируем кнопку создания дела
         todoItemForm.input.addEventListener('input', function() {
            todoItemForm.button.removeAttribute('disabled'); 
            if (!todoItemForm.input.value) {
                todoItemForm.button.setAttribute('disabled', 'true');
             } 
         })

         // !! создаем начальный список
         /*for (let item of initialList) {
            // if (item.done) {
                let todoItemInit = createTodoItem(item.name);
                todoList.append(todoItemInit.item);
                if (item.done) {
                    todoItemInit.item.classList.toggle('list-group-item-success');
                }*/
            // }
        // }*/
        // (2) Создаем список дел из сохраненных в localStorage
        let storageArrey = [];
        let storageArreyBegin = '';
        storageArreyBegin = localStorage.getItem(list);
        if (storageArreyBegin === null) {
            storageArrey = [];
        } else {
            storageArrey = JSON.parse(storageArreyBegin);
        }
        for (let obj of storageArrey) {
            let todoItemStorage2 = createTodoItem(obj.name);
            //добавляем обработчики на кнопки
            todoItemStorage2.doneButton.addEventListener('click', function() {
                todoItemStorage2.item.classList.toggle('list-group-item-success');
                // (3) Сохраняем в localStorage состояние done дела
                let storageArreyBegin2 = '';
                storageArreyBegin2 = localStorage.getItem(list);
                storageArrey = JSON.parse(storageArreyBegin2);
                let objDone = false;
                for (let key in storageArrey) {
                    if (todoItemStorage2.item.innerText.search(storageArrey[key].name) > -1) {
                        objDone = storageArrey[key].done; 
                        storageArrey[key].done = ! objDone;
                    }
                }
                let serialStorageArrey2 ='';
                localStorage.clear();
                serialStorageArrey2 = JSON.stringify(storageArrey);    
                localStorage.setItem(list, serialStorageArrey2);
                //------
            });
            todoItemStorage2.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    // (5) Удаляем дело из localStorage
                    let storageArreyBegin4 = '';
                    storageArreyBegin4 = localStorage.getItem(list);
                    storageArrey = JSON.parse(storageArreyBegin4);
                    let keyDelete = -1;
                    for (let key in storageArrey) {
                        if (todoItemStorage2.item.innerText.search(storageArrey[key].name) > -1) {
                            keyDelete = key;
                            //storageArrey.splice(index[, key, elem1, ..., elemN])
                        }
                    }
                    if (keyDelete > -1) {
                        storageArrey.splice(keyDelete, 1);
                    }
                    let serialStorageArrey4 ='';
                    localStorage.clear();
                    serialStorageArrey4 = JSON.stringify(storageArrey);    
                    localStorage.setItem(list, serialStorageArrey4);
                    //------
                    todoItemStorage2.item.remove();
                }
            });
            todoList.append(todoItemStorage2.item);
                if (obj.done) {
                    todoItemStorage2.item.classList.toggle('list-group-item-success');
                }
        }

        // -----
    } //end function

    window.createTodoApp = createTodoApp;
    
    //document.addEventListener('DOMContentLoaded', function() {
        //window.createTodoApp = createTodoApp; 
     //  createTodoApp(document.getElementById('my-todos'), 'Мои дела');
      /* createTodoApp(document.getElementById('mom-todos'), 'Дела для мамы');
       createTodoApp(document.getElementById('dad-todos'), 'Дела для папы');
    });*/
})();