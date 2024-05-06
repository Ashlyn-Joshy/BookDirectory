# Book Directory
Book Directory is a web platform that allows users to access book details such as title, author, country, language, and year of publication. Users can also add new information about books, edit or delete existing details. Whenever a new book detail is added, the data will be sent to the admin for verification. The admin will review and confirm all the details before making it available to all users. Admins have complete control over the system. Additionally,
users have the option to leave a review about the books.

## Demo
[https://bookdirectory-lng2.onrender.com/](https://bookdirectory-lng2.onrender.com/)

## Deployment
To deploy this project run
```
git clone https://github.com/Ashlyn-Joshy/BookDirectory.git
```
Enter into project folder.

Create .env file inside folder
```
MY_JWT_SECRET = "#your_jwt_secret_code"
DB_URL= "#your_db_url"
SECRET= "#your_secret_code"
```
Install dependencies using
```
npm i
```
Run the project
```
npm start
```

To open the app in your browser go to
```
localhost:8080
```

## Features

- **User Authentication** User authentication allows users to safely register, log in, and log out.
- **Upload Book Details** Users who have verified their identity may add new book details and provide them with a title, author, country, language, and year of publication.
- **View Book Details** All of the book details that other users have made are visible to users.
- **Edit and Delete Book Details** Book details created by users are modifiable and deleteable.
- **Add Reviews** Users are able to add reviews to the book that include a start rating and a description.
- **Delete Reviews**  Reviews can be removed by users from the book details they have built.
- **Admin Authentication** Admin authentication allows admin to log in and log out.
- **Upload Book Details by Admin** Admin can add new book details.
- **Edit and Delete Book Details by Admin** Admin can edit and delete the book details that are uploaded by the users.
- **Approval of Book**  Admin will review and confirm all the details of book before making it available to all users.

  ## Built with

**Front-end :** ejs,Bootstrap

**Back-end :** node, express, mongoose, bcrypt

**Database :** MongoDB

**Authenticatio :** jwt

**Validation :** yup
