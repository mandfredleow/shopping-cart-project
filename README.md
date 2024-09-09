# Technical Decisions and Assumptions

## Project Overview
This project contains two assignments.
The first assignment is a static webpage that follows the give design found in "public/images/design.png".
The second assignment which is the React webapp is a simple shopping cart application built with React and TypeScript. It allows users to browse products, add them to a cart, and manage their cart contents.
    - Product details are drawn from 'https://fakestoreapi.com'

## Key Technical Decisions

### 1. React with TypeScript
- **Decision**: Used React with TypeScript for the frontend.
- **Reasoning**: TypeScript provides static typing, enhancing code quality and developer productivity. It catches potential errors early in the development process and improves code maintainability.

### 2. State Management: React Context API
- **Decision**: Utilized React's Context API for state management over other state management libraries.
- **Reasoning**: For a relatively small-scale application like this shopping cart, the Context API provides sufficient state management capabilities without the overhead of additional libraries. It simplifies the codebase and reduces bundle size.

### 3. Styling: CSS Modules
- **Decision**: Employed CSS Modules for styling components.
- **Reasoning**: CSS Modules provide local scoping for styles, preventing global namespace conflicts. This approach enhances modularity and makes the styles more maintainable compared to global CSS or inline styles.

### 4. Data Fetching: Custom Hook with Fetch API
- **Decision**: Created a custom hook using the native Fetch API for data fetching.
- **Reasoning**: For this project's scope, a lightweight solution was preferred over heavier libraries. The custom hook encapsulates fetching logic, promoting reusability and separation of concerns.

### 5. Responsive Design
- **Decision**: Implemented responsive design using CSS media queries and flexbox.
- **Reasoning**: This ensures the application is usable across various device sizes without relying on additional libraries, keeping the bundle size small.

## Assumptions

1. **API Stability**: Assumed the provided API endpoints are stable and follow the documented structure.
2. **Browser Support**: Developed with modern browsers in mind, assuming users have up-to-date browsers that support ES6+ features.
3. **Performance**: Assumed the product list wouldn't grow to a size that would cause performance issues with the current implementation.
4. **User Authentication**: The current implementation doesn't include user authentication, assuming it's not required for this phase of the project.
5. **Static Webapge**: Assumed for assignment 1 that it's a static webpage without any dynamic content or functionality.
6. **Product Information**: 
    - Products are splited into three categories: "Clothing (Men's and Women's)", "Jewelery", and "Electronics".
    - Products' details and specifications are similar for each product in the same category.
    - Only Clothing and Jewelery have "size" property.

## Future Considerations

1. Implement data persistence for the shopping cart using local storage or a backend service. 
2. User authentication and authorization.
3. Add unit and integration tests to ensure reliability as the application grows.
4. Evaluate the need for a more robust state management solution if the application's complexity increases significantly.

# To run Assingment 1 

### Option 1: Open directly in browser

1. Open the folder named Assingment_1 when you will find the "index.html" file.
2. Double-click it, and your default web browser (Chrome, Firefox, etc.) will open it.

### Option 2: Run Using a Simple HTTP Server

1. Navigate to the project folder Assignment 1 in your terminal/command prompt.
2. Run a Python HTTP server
    ```
    python -m http.server
    ```
3. Open your web browser and navigate to `http://localhost:8000` to see the application.

# To run Assingment 2 

1. Open a terminal or command prompt
2. Navigate to the project directory (where the package.json file is located)
3. Run npm install to install all the project dependencies
4. After the installation is complete, run npm start to start the development server
So the commands would be:
```
cd SHOPPING-CART-PROJECT
npm install
npm start
```
# To run the tests

1. Open a terminal or command prompt
2. Navigate to the project directory (where the package.json file is located)
3. Run npm test to run the tests
So the commands would be:
```
cd SHOPPING-CART-PROJECT
npm test
```


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
