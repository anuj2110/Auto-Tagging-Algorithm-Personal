# Auto-Tagging-Algorithm-2.0-2019
### Installation Guide
- Firstly install MySQL Server [for Ubuntu here](https://linuxize.com/post/how-to-install-mysql-on-ubuntu-18-04/) [and other OS from here](https://dev.mysql.com/downloads/)
- Then install NodeJs [from here](https://nodejs.org/)
- If you are on Windows/Mac then install Python 3.7.3 [from here](https://www.python.org/downloads/release/python-373/)
- Clone the [Github Repository](https://github.com/eyantra-eysip/Auto-Tagging-Algorithm-2.0-2019)
- Now go to **Auto-Tagging-Algorithm-2.0-2019/Auto-tagger** and run the following to install all node packages
  ```
  $ npm install 
  ```
  or
  ```
  $ npm install package.json
  ```
- Now activate a virtual environment if you have already otherwise make it and head on to **Auto-Tagging-Algorithm-2.0-2019/RESTAPI** and run the following to install python libraries
  ```
  $ pip install -r requirements.txt
  ```
### Usage Guide
- First go to **Auto-Tagging-Algorithm-2.0-2019/RESTAPI** and run 
  ```
  $ python app.py
  ```
- Then head on to **Auto-Tagging-Algorithm-2.0-2019/Auto-tagger** and run
  ```
  $ nodemon app
  ```
  or
  ```
  $ node app
  ```
- The above two commands should start a server for python and node respectively.
- Open the browser and browse http://localhost:8000 to see the web app