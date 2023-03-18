const generateFormButton = document.getElementById('generate-form-btn');

generateFormButton.addEventListener('click', function () {
    event.preventDefault();
    const formContainer = document.getElementById('forms');
    createQuestion(false, formContainer);
});



function createQuestion(isSubquestion, container) {


    //a container for the question
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');
    container.appendChild(questionContainer);

    //creating form element
    const formElement = document.createElement('form');
    const formId = `form-${Date.now()}`;
    formElement.setAttribute('id', formId);

    if (isSubquestion) {
        formElement.classList.add('simple-subform');
    } else {
        formElement.classList.add('simple-form');
    }

    //generate input for questions
    generateQuestionInput(formElement);

    //generate input with arguments as options to select
    generateTypeInput("Type: ",formElement, ['text', 'number', 'yes/no']);

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
        createQuestion(true, subquestionsContainer);
    });
    addSubquestion.classList.add('subquestion-btn');
    formElement.appendChild(addSubquestion);

}


function generateTypeInput(h1name, container, argsArray) {
    const typeTag = document.createElement('h4');
    typeTag.textContent = h1name;
    container.appendChild(typeTag);
    const selectElement = document.createElement('select');
    selectElement.setAttribute('name', 'type');
    argsArray.forEach(element => {
        const textType = document.createElement('option');
        textType.textContent = element;
        textType.setAttribute('value', element);
        selectElement.appendChild(textType);

    });
    container.appendChild(selectElement);
}

function generateQuestionInput(container) {
    const questionTag = document.createElement('h4');
    questionTag.textContent = "Question:"
    container.appendChild(questionTag);
    const questionInput = document.createElement('input');
    questionInput.setAttribute('type', 'text');
    questionInput.setAttribute('name', 'question');
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