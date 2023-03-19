//ADD QUESTION BUTTON
const generateFormButton = document.getElementById('generate-form-btn');
generateFormButton.addEventListener('click', function () {
    event.preventDefault();
    const formContainer = document.getElementById('forms');
    createQuestion(null, formContainer);
});

//GENERATE HTML BUTTON
const generateHTMLbtn = document.getElementById('generate-html-btn');
generateHTMLbtn.addEventListener('click', function () {
    event.preventDefault();
    generateHTML();

});

const questionsArray = [];

function generateHTML() {
    console.log(questionsArray);
}

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

    //QUESTION INPUT
    generateTextInput('Question', formElement);

    //TYPE INPUT
    generateTypeInput("Type", formElement, ['text', 'number', 'yes/no']);

    //ADDING ELEMENTS TO CONTAINER
    questionContainer.appendChild(document.createElement('br'));
    questionContainer.appendChild(formElement);

    //SUBQUESTIONS CONTAINER
    const subquestionsContainer = document.createElement('div');
    subquestionsContainer.classList.add("subquestions-container");
    questionContainer.appendChild(subquestionsContainer);

    //BUTTON CONTAINER
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('button-container');
    formElement.appendChild(buttonsContainer);


    //DELETE QUESTION BUTTON
    generateButton('subquestion-delete-btn', "Delete subquestion", buttonsContainer, function () {
        event.preventDefault();
        const subquestionContainer = formElement.closest('.question-container');
        subquestionContainer.remove();
    });

    //SAVE QUESTION BUTTON
    generateButton('subquestion-save-btn', "Save this question", buttonsContainer, function () {
        event.preventDefault();
        const subquestionContainer = formElement.closest('.question-container');
        blockOrUnblock(subquestionContainer, true);

        thisQuestion.typeValue = formElement.querySelector('select[name="Type"]').value;
        thisQuestion.questionInput = formElement.querySelector('input[name="Question"]').value;

        if (thisQuestion.isSubquestion) {
            thisQuestion.conditionValue = formElement.querySelector('select[name="Condition"]').value;
            thisQuestion.conditionHiddenValue = formElement.querySelector('[name="HIDDEN"]').value;
        }


        let questionJSON = {
            parentQuestionInput: thisQuestion.parentQuestionInput,
            questionInput: thisQuestion.questionInput,
            typeValue: thisQuestion.typeValue,
            conditionValue: thisQuestion.conditionValue,
            conditionHiddenValue: thisQuestion.conditionHiddenValue
        };

        questionsArray.push(questionJSON);


        // the button for adding subquestion is appearing only when the question is saved,
        // in order to prevent changing the question and messing up with the structure 

        generateButton('subquestion-btn', 'Add subquestion', buttonsContainer, function () {
            event.preventDefault();
            createQuestion(thisQuestion, subquestionsContainer);
        });

        this.remove();
    });

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

function blockOrUnblock(container, isBlocking) {
    const motherQuestion = container.closest('.question-container');
    const motherForm = motherQuestion.querySelector('form');
    if (isBlocking) {
        const motherTypeSelect = motherForm.querySelector('select[name="Type"]');
        motherTypeSelect.setAttribute('disabled', 'disabled');
        const motherQuestionInput = motherForm.querySelector('input[name="Question"]');
        motherQuestionInput.setAttribute('disabled', 'disabled');
    } else {
        const motherTypeSelect = motherForm.querySelector('select[name="Type"]');
        motherTypeSelect.removeAttribute('disabled');
        const motherQuestionInput = motherForm.querySelector('input[name="Question"]');
        motherQuestionInput.removeAttribute('disabled');
    }
}

function Question(parentQuestion, container) {

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

