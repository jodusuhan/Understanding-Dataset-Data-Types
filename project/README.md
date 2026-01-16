# Dataset Analysis Tool

**AI & ML Internship - Task 1: Understanding Dataset & Data Types**

A web-based interactive tool for comprehensive dataset analysis, built with React, TypeScript, and Tailwind CSS.

## Features

### Dataset Analysis Capabilities

- **Data Loading**: Pre-loaded Titanic and Students Performance datasets
- **Data Visualization**: View first and last rows of datasets (similar to df.head() and df.tail())
- **Data Structure Analysis**: Display data types, null values, and feature types (similar to df.info())
- **Statistical Summary**: Comprehensive statistics for numerical and categorical features (similar to df.describe())
- **Data Quality Assessment**: Identify missing values, class imbalance, and ML readiness
- **Report Generation**: Download detailed markdown reports of the analysis

### Key Components

1. **DataTable**: Displays dataset rows in a clean, scrollable table format
2. **DataInfo**: Shows column information, data types, and feature types
3. **DataStats**: Provides statistical summaries for numerical and categorical features
4. **DataQuality**: Analyzes data quality issues, missing values, and class balance
5. **Report Generator**: Creates downloadable markdown reports

## Task Requirements Completed

- Load datasets using data parsing functions
- Display first and last records
- Identify numerical, categorical, ordinal, and binary features
- Implement df.info() equivalent functionality
- Implement df.describe() equivalent functionality
- Check unique values in categorical columns
- Identify target variables and input features
- Analyze dataset size for ML suitability
- Write observations about data quality issues
- Include interview questions and answers

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **Lucide React**: Beautiful icons

## Datasets Included

### 1. Titanic Dataset
- 40 rows, 12 columns
- Classification problem
- Target variable: Survived
- Features include passenger demographics and ticket information

### 2. Students Performance Dataset
- 40 rows, 8 columns
- Regression problem
- Features include demographics and test scores

## How to Use

1. Select a dataset from the home screen
2. Explore the data through various analysis views:
   - First and last rows
   - Data structure and types
   - Statistical summaries
   - Quality assessment
3. Download a comprehensive analysis report
4. Review interview questions to test your understanding

## Analysis Features

### Data Structure
- View data types and null counts
- Identify feature types (numerical, categorical, binary, ordinal)
- See unique value counts per column

### Statistical Summary
- Mean, standard deviation, min, max
- Quartiles (25%, 50%, 75%)
- Count, unique values, top values for categorical features

### Quality Analysis
- Missing value detection and percentage
- Dataset size assessment for ML suitability
- Class imbalance detection for target variables
- Feature type distribution

## Interview Questions Covered

The application includes answers to key interview questions:
- Difference between numerical and categorical data
- What is a target variable?
- Why is data understanding important before modeling?
- What is data imbalance?
- What does df.describe() show?

## Final Outcome

This tool demonstrates a complete understanding of:
- Data structure and organization
- Data types and their characteristics
- Statistical analysis techniques
- Data quality assessment
- ML readiness evaluation

## Development

Built as a modern web application that replicates core Pandas functionality in an interactive, visual format accessible through any web browser.
