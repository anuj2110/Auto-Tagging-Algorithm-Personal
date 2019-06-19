from flask import Flask,render_template,request
import sqlalchemy
from flask_sqlalchemy import SQLAlchemy 
from functions import *
from accuracy_calc import *
import pandas as pd 
import numpy as np 
from sklearn.preprocessing import StandardScaler,MinMaxScaler
import pickle

model = pickle.load(open("finalized_model.sav",'rb'))
mms = MinMaxScaler()
def predict_(db):
    df = weighted_features(db.engine)
    col_names = list(df.columns.values)
    col_names.remove("question_id")
    data = mms.fit_transform(np.array(df[col_names]))
    predictions = model.predict(data)
    df = pd.read_sql("question_master",db.engine)
    tags = list(df["pre_tag"])
    return acc(np.array(tags),predictions)
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://anuj:Anuj@21101998@localhost/auto_tagging_data"
db = SQLAlchemy(app)
@app.route("/")
def hello():
    return "Hello"
@app.route("/predict")
def predict():
    # df = pd.read_sql("question_master",db.engine)
    # tags = list(df["pre_tag"])
    acc = predict_(db)
    return str(acc)
if __name__ == '__main__':
    app.run(debug=True)