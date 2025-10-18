# Basic Plan

	Design
	- for web app & automate CI/CD and deployment pipeline
	Production
	- making a usable Python web app; BMI calculator
	Testing
	- unit testing for web app
	Automated Pipeline
	- setting up scripts to automate things

# Design

## Initial Design for DevOps Pipeline

<img width="1561" height="311" alt="image" src="https://github.com/user-attachments/assets/5f7b84a6-6024-4d32-9567-314f97e41415" />

## Initial UML design for BMI web calculator

<img width="549" height="421" alt="image" src="https://github.com/user-attachments/assets/5e17549e-8e8b-4047-ba64-1a0370d62a48" />

## Initial UI design for BMI calculator

<img width="681" height="431" alt="image" src="https://github.com/user-attachments/assets/b02230db-3888-4272-a10a-8445c521939f" />

BMI Calculator inspiration: https://www.calculator.net/bmi-calculator.html


# Initial plans for testing
Suggested library; pytest
- Proposed unit tests
- Syntax checking for inputs
- Calculate BMI correctly as expected of BMI formula
- Return correct BMI ranges for gender/ age
	- Required for each gender and age range combo
- Return correct BMI result based on range and calculated bmi
	- Required for each BMI category

Proposed integration tests
Test api connection
Test submit form
Test data returned
Test returned displayed data

