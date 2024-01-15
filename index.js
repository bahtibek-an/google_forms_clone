const {createStore} = Redux;

const ADD_FORM = 'ADD_FORM';
const DELETE_FORM = 'DELETE_FORM';
const UPDATE_FORM_TYPE = 'UPDATE_FORM_TYPE';
const ADD_OPTION = "ADD_OPTION";
const REMOVE_OPTION = "REMOVE_OPTION";
const HANDLE_CHANGE_INPUT_FORM = "HANDLE_CHANGE_INPUT";
const HANDLE_CHANGE_INPUT_OPTION = "HANDLE_CHANGE_INPUT_OPTION";
const CLEAR_FORM = "CLEAR_FORM";

const addForm = () => ({
    type: ADD_FORM
});

const clearForm = () => ({
    type: CLEAR_FORM,
});

const handleChangeInputForm = (formIndex, value) => ({
    type: HANDLE_CHANGE_INPUT_FORM,
    payload: { formIndex, value }
});

const handleChangeInputOption = (formIndex, optionIndex, value) => ({
    type: HANDLE_CHANGE_INPUT_OPTION,
    payload: { formIndex, optionIndex, value }
});

const deleteForm = (formIndex) => ({
    type: DELETE_FORM,
    payload: {formIndex}
});

const removeOption = (formIndex, optionIndex) => ({
    type: REMOVE_OPTION,
    payload: {formIndex, optionIndex},
});


const addOption = (index) => ({
    type: ADD_OPTION,
    payload: {index}
});

const updateFormType = (index, formType) => ({
    type: UPDATE_FORM_TYPE,
    payload: {index, formType}
});

const initialState = {
    forms: []
};

function formReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_FORM:
            return {
                ...state,
                forms: [...state.forms, {type: 'text', options: [], value: ""}]
            };
        case UPDATE_FORM_TYPE:
            const updatedForms = state.forms.map((form, index) => {
                if (index === action.payload.index) {
                    return {...form, type: action.payload.formType};
                }
                return form;
            });
            return {...state, forms: updatedForms};
        case ADD_OPTION:
            const optionAddedForms = state.forms.map((form, idx) => {
                if (idx === action.payload.index) {
                    return {...form, options: [...form.options, { id: Date.now(), value: ''  }]};
                }
                return form;
            });
            return {...state, forms: optionAddedForms};
        case REMOVE_OPTION: {
            const {formIndex, optionIndex} = action.payload;
            const updatedFormsForRemoval = state.forms.map((form, idx) => {
                if (idx === formIndex) {
                    return {
                        ...form,
                        options: form.options.filter((_, optIdx) => optIdx !== optionIndex)
                    };
                }
                return form;
            });
            return {...state, forms: updatedFormsForRemoval};
        }
        case DELETE_FORM: {
            const {formIndex} = action.payload;
            const updatedForm = state.forms.filter((form, idx) => idx !== formIndex);
            return {...state, forms: updatedForm};
        }
        case HANDLE_CHANGE_INPUT_FORM: {
            const { formIndex, value } = action.payload;

            const updatedForm = state.forms.map((form, idx) => idx === formIndex ? ({ ...form, value }) : form );
            return {...state, forms: updatedForm};
        }
        case HANDLE_CHANGE_INPUT_OPTION: {
            const { formIndex, optionIndex, value } = action.payload;
            const updatedForms = state.forms.map((form, idx) => {
                if (idx === formIndex) {
                    return {
                        ...form,
                        options: form.options.map((option, index) => {
                            if(optionIndex === index) {
                                return { value };
                            }
                            return option;
                        })
                    };
                }
                return form;
            });
            return {...state, forms: updatedForms};
        }
        case CLEAR_FORM: {
            const updateForms = state.forms.filter((form) => form.value.trim() !== '')
                .map((form) => ({ ...form, options: form.options.filter((option) => option.value.trim() !== '') }));
            return {forms: updateForms}; 
        }
        default:
            return state;
    }
}

const getElementForm = (type, index, form) => {
    switch (type) {
        case "select": {
            const optionsHtml = form.options.map((option, optIndex) => `
                <div class="flex mt-2">
                    <input class="option-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="question-${index}-option-${optIndex}" 
                        name="question-${index}-option-${optIndex}"
                        type="text" 
                        placeholder="Option ${optIndex + 1}"
                        value="${option.value}"
                        data-option-index="${option.id}"
                    >
                    <button 
                        data-form-index="${index}"
                        data-option-index="${optIndex}"
                        class="delete__option-btn w-[35px] ml-2 rounded border flex items-center justify-center">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            `).join('');

            return `
            <label class="option-label mt-2 block text-gray-700 text-sm font-bold mb-2" for="option-${index}">
                Options
            </label>
            <div class="option">
                <div class="option__list">
                    ${optionsHtml}
                </div>
                <button class="option__add-btn create-form mt-4 text-[#cccccc] rounded focus:outline-none focus:shadow-outline">
                    Add an option
                </button>
            </div>
            <div class="option__footer flex">
                <button class="form__delete-btn mt-4 flex border rounded ml-auto">
                    <svg 
                        class="text-gray-400 dark:text-gray-500 w-8 h-8" 
                        aria-hidden="true" 
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            `;
        }
        case "text":
            return `
                <div class="option__footer flex">
                    <button class="form__delete-btn mt-4 flex border rounded ml-auto">
                        <svg 
                            class="text-gray-400 dark:text-gray-500 w-8 h-8" 
                            aria-hidden="true" 
                            fill="currentColor" 
                            viewBox="0 0 20 20" 
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            `;
        case "multiple_choice": {
            const optionsHtml = form.options.map((option, optIndex) => `
                <div class="flex mt-2">
                    <input class="option-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="question-${index}-option-${optIndex}" 
                        name="question-${index}-option-${optIndex}"
                        type="text" 
                        placeholder="Option ${optIndex + 1}"
                        value="${option.value}"
                        data-option-index="${option.id}"
                    >
                    <button 
                        data-form-index="${index}"
                        data-option-index="${optIndex}"
                        class="delete__option-btn w-[35px] ml-2 rounded border flex items-center justify-center">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            `).join('');

            return `
            <label class="option-label mt-2 block text-gray-700 text-sm font-bold mb-2" for="option-${index}">
                Options
            </label>
            <div class="option">
                <div class="option__list">
                    ${optionsHtml}
                </div>
                <button 
                    class="option__add-btn create-form mt-4 text-[#cccccc] rounded focus:outline-none focus:shadow-outline">Add an option</button>
            </div>
            <div class="option__footer flex">
                <button class="form__delete-btn mt-4 flex border rounded ml-auto">
                    <svg 
                        class="text-gray-400 dark:text-gray-500 w-8 h-8" 
                        aria-hidden="true" 
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            `;
        }
        case "date": {

            return `
                <div class="option__footer flex">
                    <button class="form__delete-btn mt-4 flex border rounded ml-auto">
                        <svg 
                            class="text-gray-400 dark:text-gray-500 w-8 h-8" 
                            aria-hidden="true" 
                            fill="currentColor" 
                            viewBox="0 0 20 20" 
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            `;
        }
    }
}

const store = createStore(formReducer);

function updateUI() {
    const {forms} = store.getState();
    const formList = document.querySelector('.form__list');
    formList.innerHTML = '';

    forms.forEach((form, index) => {
        const formElement = document.createElement('div');
        formElement.className = "bg-white p-4 rounded mt-4";
        formElement.innerHTML = `
            <div class="flex justify-between">
                <input 
                    class="form__input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="question-${index}" 
                    placeholder="Question ${index + 1}"
                    name="question-${index}"
                    type="text"
                    value="${form.value}"
                >
                <select name="question-${index}-${form.type}" class="question-type ml-4 w-[200px] block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state-${index}">
                  <option value="text" ${form.type === 'text' ? 'selected' : ''}>Text</option>
                  <option value="select" ${form.type === 'select' ? 'selected' : ''}>Select</option>
                  <option value="multiple_choice" ${form.type === 'multiple_choice' ? 'selected' : ''}>Multiple choice</option>
                  <option value="date" ${form.type === 'date' ? 'selected' : ''}>Date</option>
                </select>
            </div>
            ${getElementForm(form.type, index, form)}
        `;

        formList.appendChild(formElement);

        if (form.type === 'select' || form.type === 'multiple_choice') {
            const addButton = formElement.querySelector('.option__add-btn');
            const deleteButtons = formElement.querySelectorAll(".delete__option-btn");
            
            form.options.forEach((_, optIndex) => {
                const optionInput = formElement.querySelector(`#question-${index}-option-${optIndex}`);
                optionInput.addEventListener('change', (e) => {
                    store.dispatch(handleChangeInputOption(index, optIndex, e.target.value));
                });
            });
           
            addButton.addEventListener('click', function () {
                store.dispatch(addOption(index));
            });
            if (deleteButtons) {
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const formIndex = parseInt(this.getAttribute('data-form-index'));
                        const optionIndex = parseInt(this.getAttribute('data-option-index'));
                        store.dispatch(removeOption(formIndex, optionIndex));
                    });
                });
            }
        }

        const formInput = formElement.querySelector('.form__input');
        if(formInput) {
            formInput.addEventListener("change", (e) => {
                const value = e.target.value;
                store.dispatch(handleChangeInputForm(index, value));
            });
        }

        const deleteFormBtn = formElement.querySelector(".form__delete-btn");
        if (deleteFormBtn) {
            deleteFormBtn.addEventListener("click", function () {
                store.dispatch(deleteForm(index));
            });
        }

        const selectElement = formElement.querySelector('.question-type');
        selectElement.addEventListener('change', function () {
            const selectedType = this.value;
            store.dispatch(updateFormType(index, selectedType));
        });

    });
}

document.querySelector(".form__content").addEventListener("submit", (e) => {
    store.dispatch(clearForm())
});

store.subscribe(updateUI);

document.querySelector('.create-form').addEventListener('click', () => {
    store.dispatch(addForm());
});
