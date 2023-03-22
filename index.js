//An array for JSON data for question inputs
let questionsData = [];

//Retrieving JSON data from local storage
if (localStorage.getItem("questionsData") != null) {
    questionsData = JSON.parse(localStorage.getItem("questionsData"));
}

//Retrieving HTML and even listeners from local storage
if (localStorage.getItem("formContainer") !== null) {
    const formContainer = document.getElementById('forms');
    formContainer.innerHTML = localStorage.getItem("formContainer");
    const questionContainers = formContainer.querySelectorAll('.question-container');
    questionContainers.forEach(container => {
        addEventListenersToQuestion(container);
    });
}

//RESET button
const resetButton = document.getElementById('reset-btn');
resetButton.addEventListener('click', function () {
    event.preventDefault();
    localStorage.removeItem("formContainer");
    localStorage.removeItem("questionsData");
    location.reload();
});

//ADD QUESTION button
const generateFormButton = document.getElementById('generate-form-btn');
generateFormButton.addEventListener('click', function () {
    event.preventDefault();
    const formContainer = document.getElementById('forms');
    createQuestion(null, formContainer);
});

//CREATE QUESTION function
function createQuestion(parentQuestion, container) {

    let thisQuestion = new Question(parentQuestion, container);

    //QUESTION CONTAINER
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');
    thisQuestion.container.appendChild(questionContainer);

    //FORM ELEMENT
    const formElement = document.createElement('form');
    formElement.classList.add(thisQuestion.classCSS);

    //CONDITION PART
    if (thisQuestion.isSubquestion) {
        switch (thisQuestion.parentQuestion.typeValue) {

            case 'text':
                generateTypeInput('Condition', formElement, ["equals"]);
                generateTextInput('HIDDEN', formElement);
                break;

            case 'yes/no':
                generateTypeInput("Condition", formElement, ["equals"]);
                generateTypeInput('HIDDEN', formElement, ["yes", "no"]);
                break;

            case 'number':
                generateTypeInput("Condition", formElement, ["equals", "greater than", "less than"]);
                generateTextInput('HIDDEN', formElement);
                break;

            default:
                console.log("error with inheritance");
                break;
        }
    }

    //GENERATING INPUTS
    generateTextInput('Question', formElement);
    generateTypeInput("Type", formElement, ['text', 'number', 'yes/no']);

    //ADDING FORM ELEMENT TO QUESTION CONTAINER
    questionContainer.appendChild(document.createElement('br'));
    questionContainer.appendChild(formElement);

    //SUBQUESTIONS CONTAINER
    const subquestionsContainer = document.createElement('div');
    subquestionsContainer.classList.add("subquestions-container");
    questionContainer.appendChild(subquestionsContainer);

    //BUTTONS CONTAINER
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('button-container');
    formElement.appendChild(buttonsContainer);


    //GENERATING BUTTONS
    generateButton('subquestion-delete-btn', "Delete subquestion", buttonsContainer, () => deleteQuestion(formElement));
    generateButton('subquestion-save-btn', "Save subquestion", buttonsContainer, function () {
        event.preventDefault();
        const subquestionContainer = formElement.closest('.question-container');
        blockQuestion(subquestionContainer);

        thisQuestion.typeValue = formElement.querySelector('select[name="Type"]').value;
        thisQuestion.questionInput = formElement.querySelector('input[name="Question"]').value;
        formElement.querySelector('select[name=Type]').querySelector('option:checked').setAttribute('selected', 'selected');
        formElement.querySelector('input[name="Question"]').setAttribute("value", thisQuestion.questionInput);

        if (thisQuestion.isSubquestion) {
            thisQuestion.conditionValue = formElement.querySelector('select[name="Condition"]').value;
            thisQuestion.conditionHiddenValue = formElement.querySelector('[name="HIDDEN"]').value;

            if (thisQuestion.parentQuestion.typeValue === 'yes/no') {
                formElement.querySelector('[name="HIDDEN"]').querySelector('option:checked').setAttribute('selected', 'selected');
            }

            formElement.querySelector('select[name="Condition"]').querySelector('option:checked').setAttribute('selected', 'selected');
            formElement.querySelector('[name="HIDDEN"]').setAttribute("value", thisQuestion.conditionHiddenValue);
        }

        let questionJSON = {
            parentQuestionInput: thisQuestion.parentQuestionInput,
            questionInput: thisQuestion.questionInput,
            typeValue: thisQuestion.typeValue,
            conditionValue: thisQuestion.conditionValue,
            conditionHiddenValue: thisQuestion.conditionHiddenValue
        };

        questionsData.push(questionJSON);
        localStorage.setItem("questionsData", JSON.stringify(questionsData));


        // the button for adding subquestion is appearing only when the question is saved,
        // in order to prevent changing the question and messing up with the structure 
        generateButton('subquestion-btn', 'Add subquestion', buttonsContainer, () => addSubquestion(thisQuestion, subquestionsContainer));
        this.remove();

        const formContainer = document.getElementById('forms').innerHTML;
        localStorage.setItem("formContainer", formContainer);
    });

}

function Question(parentQuestion, container) {

    if (parentQuestion === undefined) {
        parentQuestion = null;
    }

    this.parentQuestion = parentQuestion;
    this.container = container;


    if (parentQuestion === null) {
        this.isSubquestion = false;
        this.classCSS = 'simple-form';
        this.parentQuestionInput = null;
    } else {
        this.isSubquestion = true;
        this.classCSS = 'simple-subform';
        this.parentQuestionInput = this.parentQuestion.questionInput;
    }

}

function generateButton(classCSS, textContent, container, behaviour) {
    const generatedButton = document.createElement('button');
    generatedButton.textContent = textContent;
    generatedButton.addEventListener('click', behaviour);
    generatedButton.classList.add(classCSS);
    container.appendChild(generatedButton);
}

function generateTypeInput(h1name, container, argsArray) {
    if (h1name !== 'HIDDEN') {
        const typeTag = document.createElement('h4');
        typeTag.textContent = h1name;
        container.appendChild(typeTag);
    }
    const selectElement = document.createElement('select');
    selectElement.setAttribute('name', h1name);
    argsArray.forEach(element => {
        const textType = document.createElement('option');
        textType.textContent = element;
        textType.setAttribute('value', element);
        selectElement.appendChild(textType);

    });
    container.appendChild(selectElement);
}

function generateTextInput(h1name, container) {
    if (h1name !== 'HIDDEN') {
        const questionTag = document.createElement('h4');
        questionTag.textContent = h1name;
        container.appendChild(questionTag);
    }
    const questionInput = document.createElement('input');
    questionInput.setAttribute('type', 'text');
    questionInput.setAttribute('name', h1name);
    container.appendChild(questionInput);
    container.appendChild(document.createElement('br'));
}

function blockQuestion(container) {
    const motherQuestion = container.closest('.question-container');
    const motherForm = motherQuestion.querySelector('form');
    const motherTypeSelect = motherForm.querySelector('select[name="Type"]');
    motherTypeSelect.setAttribute('disabled', 'disabled');
    const motherQuestionInput = motherForm.querySelector('input[name="Question"]');
    motherQuestionInput.setAttribute('disabled', 'disabled');
}

function deleteQuestion(formElement) {
    event.preventDefault();
    const subquestionContainer = formElement.closest('.question-container');
    subquestionContainer.remove();
    localStorage.removeItem("formContainer");
    const formContainer = document.getElementById('forms').innerHTML;
    localStorage.setItem("formContainer", formContainer);
}

function addSubquestion(parentQuestion, subquestionsContainer) {
    event.preventDefault();
    createQuestion(parentQuestion, subquestionsContainer);
    const formContainer = document.getElementById('forms').innerHTML;
    localStorage.setItem("formContainer", formContainer);
}

function addEventListenersToQuestion(questionContainer) {
    const addSubquestionButton = questionContainer.querySelector('.subquestion-btn');
    const deleteQuestionButton = questionContainer.querySelector('.subquestion-delete-btn');
    const saveQuestionButton = questionContainer.querySelector('.subquestion-save-btn');

      //EVENT LISTENER TO ADD SUBQUESTION BUTTON
    if (addSubquestionButton) {
        addSubquestionButton.addEventListener('click', function () {
            event.preventDefault();
            const questionInputFromContainer = questionContainer.querySelector('input[name="Question"]').value;
            const questionObjectFromContainer = questionsData.find(obj => obj.questionInput === questionInputFromContainer);
            const parentQuestionObject = questionsData.find(obj => obj.questionInput === questionObjectFromContainer.parentQuestionInput);

            if (parentQuestionObject === undefined) {
                const newQuestionObj = new Question(null, questionContainer);
                newQuestionObj.typeValue = questionObjectFromContainer.typeValue;
                createQuestion(newQuestionObj, questionContainer);
            } else {
                createQuestion(questionObjectFromContainer, questionContainer);
            }
        });
    }
    //EVENT LISTENER TO DELETE QUESTION BUTTON
    if (deleteQuestionButton) {
        deleteQuestionButton.addEventListener('click', function () {
            event.preventDefault();
            deleteQuestion(questionContainer);
        });
    }
    //EVENT LISTENER TO SAVE QUESTION BUTTON
    if (saveQuestionButton) {
        saveQuestionButton.addEventListener('click', function () {
            event.preventDefault();
            const subquestionContainer = questionContainer.closest('.question-container');
            blockQuestion(subquestionContainer, true);
            const formContainer = document.getElementById('forms').innerHTML;
            localStorage.setItem("formContainer", formContainer);
        });
    }
}