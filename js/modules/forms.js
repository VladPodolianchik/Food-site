import { closeModal, openModal } from "./modal";
import { postData } from "../services/services";

function forms(formSelector, modalTimerId) {
    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: "img/form/spinner.svg",
        success: "Спасибо, скоро свяжемся",
        failure: "Что-то не так"
    }

    forms.forEach(item => {
        bindPostData(item);
    })

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            // form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage)

            const formData = new FormData(form);

            // const object = {};                                              // Если надо отправить в json формате
            // formData.forEach(function(value, key){                          // Если надо отправить в json формате
            //     object[key] = value;                                        // Если надо отправить в json формате
            // });

            const json = JSON.stringify(Object.fromEntries(formData.entries()));   // в массивов массивов, затем в класический обьект и затем в json

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            })
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        
        prevModalDialog.classList.add('hide');
        openModal('.modal', modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>x</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal('.modal');
        }, 2000);
    }

    // fetch('https://jsonplaceholder.typicode.com/posts', {
    //     method: "POST",
    //     body: JSON.stringify({name: "Alex"}),
    //     headers: {
    //         "Content-type": "application/json"
    //     }
    // })
    //     .then(response => response.json())
    //     .then(json => console.log(json));



    // fetch('http://localhost:3000/menu')    // путь скопирован из json-server
    //     .then(data => data.json())
    //     .then(res => console.log(res))

}

export default forms;