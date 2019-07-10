from flask import Flask,render_template,request,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import sqlalchemy
def make_features(year):
    
    feature1 = pd.read_sql_query("select t1.question_id,count(t1.answer_option) from test_ques_ans_dtls t1,test_start_details t2 where t2.id = t1.test_id and t1.marks = 3 group by t1.question_id",conn)
    feature2 = pd.read_sql_query("select t1.question_id,count(t1.answer_option) from test_ques_ans_dtls t1,test_start_details t2 where t2.id = t1.test_id and t1.marks = -1 group by t1.question_id",conn)
    feature3 = pd.read_sql_query("select t1.question_id,count(t1.answer_option) from test_ques_ans_dtls t1,test_start_details t2 where t2.id = t1.test_id and t1.marked = 0 group by t1.question_id",conn)
    feature4 = pd.read_sql_query("select t1.question_id,avg(t2.marks_scored) from test_ques_ans_dtls t1,test_start_details t2 where t2.id = t1.test_id and t1.marks = 3 group by t1.question_id",conn)
    feature5 = pd.read_sql_query("select t1.question_id,avg(t2.marks_scored) from test_ques_ans_dtls t1,test_start_details t2 where t2.id = t1.test_id and t1.marks = -1 group by t1.question_id",conn)
    feature6 = pd.read_sql_query("select t1.question_id,avg(t2.marks_scored) from test_ques_ans_dtls t1,test_start_details t2 where t2.id = t1.test_id and t1.marked = 0 group by t1.question_id",conn)
    #feature7 = pd.read_sql_query("select question_id,count(percentile) as tp10 from for_features where percentile>90 and marked =1 and marks = 3 group by question_id",conn)
    feature_list = [feature1,feature2,feature3,feature4,feature5,feature6]
    ques=[x for x in range(1,1801)]
    i=0
    features = pd.DataFrame(ques,columns = ["question_id"])
    while(i<=5):
        features = pd.merge(features,feature_list[i],on = "question_id")
        i = i+1
    features.to_sql("something",conn)
    return features
app = Flask(__name__)
conn = sqlalchemy.create_engine("mysql+pymysql://anuj:Anuj@21101998@localhost/auto_tagging_data")
app = Flask(__name__)
@app.route('/')
def hello():
    return "hello"
@app.route('/make')

app.run(debug =True)