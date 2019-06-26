from flask import Flask,render_template,request
from flask_sqlalchemy import SQLAlchemy 
from Feature_functions import *
from SOM_functions import *
from accuracy_calc import *
import pandas as pd 
import numpy as np 
from sklearn.preprocessing import StandardScaler,MinMaxScaler
from sklearn.cluster import KMeans
import pickle

app = Flask(__name__)
ss = StandardScaler()
kmeans = KMeans(n_clusters = 3,max_iter = 900)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://anuj:Anuj@21101998@localhost/auto_tagging_data"
app.config["SQLALCHEMY_BINDS"] = {
    'stats' : 'mysql+pymysql://anuj:Anuj@21101998@localhost/stats',
    
}
db = SQLAlchemy(app)
query = "select pre_tag from question_master"
a = db.engine.execute(query)
df = pd.DataFrame(a,columns = a.keys())
tags = list(df["pre_tag"])
@app.route("/",methods = ['post','get'])
def predict():
    names = request.get_json()
    message = 'ok'
    print(names)
    print(names['features'][0])
    if request.method == "POST":
        features = make_features(int(names['features'][0]),db.engine)
        data = features[names['features'][1:]]
        data_pp = ss.fit_transform(data)
        pred_kmeans = kmeans.fit_predict(data_pp)
        pred_SOM = fit_predict(data_pp)
        acc_kmeans = acc(np.array(tags),pred_kmeans)
        acc_SOM = acc(np.array(tags),np.array(pred_SOM))
        message = "The Accuracy of Kmeans is "+str(acc_kmeans)+" and accuracy of SOM is "+str(acc_SOM)
    return message
if __name__ == "__main__":
    app.run(port = 5000,debug = True)