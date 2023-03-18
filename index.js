//When "Add a question" is clicked"
const generateFormButton = document.getElementById('generate-form-btn');
generateFormButton.addEventListener('click', function () {
    event.preventDefault();
    const formContainer = document.getElementById('forms');
    createQuestion(false, formContainer, null);
});


//Creating question
function createQuestion(isSubquestion, container, motherValue) {

    //a container for the question
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');
    container.appendChild(questionContainer);

    //creating form element
    const formElement = document.createElement('form');

    //ensuring every form has ID value --- NOT COMPLETED ---
    const formId = `form-${Date.now()}`;
    formElement.setAttribute('id', formId);

    if (isSubquestion) {
        formElement.classList.add('simple-subform');

        //blocking the previous question and its type so it cannot be modified
        blockOrUnblock(container, true);

        //What conditions to add based on the previously chosen input
        switch (motherValue) {
            case 'text':
                generateTypeInput('Condition', formElement, ["equals"]);
                generateTextInput('', formElement);
                break;
            case 'yes/no':
                generateTypeInput("Condition", formElement, ["equals"]);
                generateTypeInput("", formElement, ["yes", "no"]);
                break;
            case 'number':
                generateTypeInput("Condition", formElement, ["equals", "greater than", "less than"]);
                generateTextInput('', formElement);
                break;
            default:
                console.log("error with inheritance");
                break;
        }
    } else {
        formElement.classList.add('simple-form');
    }

    //generate input for questions
    generateTextInput('Question', formElement);

    //generate input with arguments as options to select
    generateTypeInput("Type", formElement, ['text', 'number', 'yes/no']);

    //adding elements to containers
    questionContainer.appendChild(document.createElement('br')); //container
    questionContainer.appendChild(formElement); //container

    //creating a container for subquestions
    const subquestionsContainer = document.createElement('div');
    subquestionsContainer.classList.add("subquestions-container");
    questionContainer.appendChild(subquestionsContainer);

    //button for adding subquestions
    const addSubquestion = document.createElement('button');
    addSubquestion.textContent = "Add subquestion";
    addSubquestion.addEventListener('click', function () {
        event.preventDefault();
        const typeValue = formElement.querySelector('select[name="Type"]').value;
        createQuestion(true, subquestionsContainer, typeValue); // CHANGE THIS NULL!!!

    });
    addSubquestion.classList.add('subquestion-btn');
    formElement.appendChild(addSubquestion);


    //button for deleting subquestions
    const deleteSubquestion = document.createElement('button');
    deleteSubquestion.textContent = "Delete subquestion";
    deleteSubquestion.addEventListener('click', function () {
        event.preventDefault();
        const subquestionContainer = deleteSubquestion.closest('.question-container');
        subquestionContainer.remove();
        blockOrUnblock(container, false);
    });
    deleteSubquestion.classList.add('subquestion-delete-btn');
    formElement.appendChild(deleteSubquestion);


}


//Function that creates 'select' type input
function generateTypeInput(h1name, container, argsArray) {
    const typeTag = document.createElement('h4');
    typeTag.textContent = h1name;
    container.appendChild(typeTag);
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

//Function that creates 'text' type input
function generateTextInput(h1name, container) {
    const questionTag = document.createElement('h4');
    questionTag.textContent = h1name;
    container.appendChild(questionTag);
    const questionInput = document.createElement('input');
    questionInput.setAttribute('type', 'text');
    questionInput.setAttribute('name', h1name);
    container.appendChild(questionInput);
    container.appendChild(document.createElement('br'));
}


//dATA to JSON  -- not completed !!! --
const submitFormsBtn = document.getElementById('submit-forms-btn');
submitFormsBtn.addEventListener('click', function () {
    event.preventDefault();
    const forms = document.querySelectorAll('.simple-form, .simple-subform');
    const data = [];
    forms.forEach(form => {
        const formData = new FormData(form);
        const obj = {};
        formData.forEach((value, key) => {
            obj[key] = value;
        });
        data.push(obj);
    });
    console.log(JSON.stringify(data));
});


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