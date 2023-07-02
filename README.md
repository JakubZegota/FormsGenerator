# Specification
## Conditional subquestions
The goal of this project is to build a simple form generator. 
There are three types of input, that generate subquestions upon certain conditions:
### Text
* Equals - The subquestion generates if the answer is equal to this value
### Number
* Equals - The number entered is equal to this value
* Greater than - The number entered is greater than this value
* Less than - The number entered is less than this value   
### Yes/No
* Equals - The radio selected is equal to this value (either yes or no)
## Other features
* The form currently saves the HTML in the local data of the browser.
* The program lets the user add any number of questions with any level of depth (subquestions can their own have subquestions)
* the subquestion blocks its parent question 
# Plans
## Things to change
* forms should not save the HTML, but other forms of data instead
* comments in the code should be improved
## Features to add
* generating HTML as the final result
