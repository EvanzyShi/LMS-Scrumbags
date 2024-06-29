# 3900H11AScrumbags EduSpace

## Description
EduSpace is the capstone project for the UNSW course COMP3900. Our aim is to create a learning management system that takes existing ones such as Moodle, Edstem and WebCMS and seeks to combine the best of their features into one application.

## Installation
For our application we are using the virtual machine method to host.

### Frontend
For frontend, first make sure that nvm is installed. Run the following command.
```
sudo apt install nvm
```
After that run the following command to install the correct node version for this application.
```
nvm install v20.11.0
```

Verify you have the right version of node by running the following command.
```
nvm -V
```

After that navigate to the frontend directory of the application and run the following command to install packages.
```
npm install
```

Frontend configuration is now complete we will now move on to configuring the backend.

### For backend we first want to install pyenv with the following command
```
$ curl https://pyenv.run | bash
```

Check that it is installed with the following command.
```
pyenv -v
```

Run the following command to install the correct version of python for this application.
```
pyenv install 3.11.0
```

Next run the following command to verify that we have installed python 3.11
```
pyenv versions
```

This should show only 3.11.0. Next we activate it by running.
```
pyenv global 3.11.0
```

Run the following command to ensure that we are using the right version of python3. This should print out 3.11.0
```
python3 --version
```

After this install pip with.
```
sudo apt install python3-pip
```

After pip installation install pipenv
```
pip install pipenv
```

Pipenv allows us to create virtual environments and install python packages all with the same command. Run the following command to activate a virtual environment.
```
pipenv shell
```

After this run the following command to install python packages.
```
pipenv install
```

Congratulations you have now set up all the packages for the project.

## Quickstart
To start the application, make sure you have two terminals open. One should be in the frontend directory, and the other should be in the backend directory.

In the backend directory, run ```pipenv shell``` to enter the virtual environment after the following command to start the backend server.
```
python3 manage.py runserver
```

In our frontend directory, run ```npm start``` to start the application.

This will automatically start localhost:3000; however, please use 127.0.0.1:3000 instead when testing.

The following accounts are available for testing; however, feel free to make your own on the sign-up page.
Student
Email: test1@mail.com
Password: password
Teacher
Email: teacher1@mail.com
Password: password