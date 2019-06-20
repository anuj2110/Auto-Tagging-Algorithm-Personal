from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import numpy as np
from sqlalchemy import text
def f1(weights_map,marked,sum_weight):
    feature_f1=[]
    sum_ =0
    for i in marked:
        if(i==1):
            for j in marked[i]:
                if(j[1]==3):
                    sum_ = sum_+float(weights_map[j[0]])
            feature_f1.append(sum_/float(sum_weight))
    
        elif(i>=2):
            sum_=0
            for j in marked[i]:
                if(j[1]==3):
                    sum_ = sum_+float(weights_map[j[0]])
            feature_f1.append(sum_/float(sum_weight))
    return feature_f1
def f2(weights_map,marks_map,marked,sum_weight):
    feature_f2=[]
    sum_ =0
    for i in marked:
        if(i==1):
            for j in marked[i]:
                if(j[1]!=3):
                    sum_ = sum_+(float(weights_map[j[0]])*marks_map[j[0]])
            feature_f2.append(sum_/float(sum_weight))
        
        elif(i>=2):
            sum_=0
            for j in marked[i]:
                if(j[1]!=3):
                    sum_ = sum_+(float(weights_map[j[0]])*marks_map[j[0]])
            feature_f2.append(sum_/float(sum_weight))
    return feature_f2
def weighted_features(conn):
    query1= "select marks_scored from test_start_details"
    a = conn.execute(text(query1))
    for_weights = pd.DataFrame(a,columns = a.keys())
    weights_p=[]
    for i in for_weights["marks_scored"]:
        weights_p.append(float(i))
    marks = np.array(weights_p)
    mms = MinMaxScaler(feature_range = (0,2))
    weights = list(mms.fit_transform(marks.reshape((-1,1))))
    query2 = "select t1.id,t2.question_id,t2.marks,t2.marked from test_start_details t1,test_ques_ans_dtls t2 where t1.id = t2.test_id;"
    b = conn.execute(text(query2))
    cal_for_f1 = pd.DataFrame(b,columns = b.keys())
    sum_weight = np.sum(weights)
    ques_ids = [i for i in range(1,1801)]
    marked = {i:[] for i in ques_ids}
    for i,val in enumerate(cal_for_f1["question_id"]):
        marked[val].append((cal_for_f1["id"].iloc[i],cal_for_f1["marks"].iloc[i]))
    print(len(marked))
    query3= "select id from test_start_details"
    c = conn.execute(text(query3))
    mem_id = pd.DataFrame(c,columns = c.keys())
    mem_id_l = []
    for i in mem_id["id"]:
        mem_id_l.append(i)
    weights_map = {mem_id_l[i]:float(weights[i]) for i in range(len(mem_id_l))}
    marks_map = {mem_id_l[i]:weights_p[i] for i in range(len(mem_id_l))}
    feature_f1 = f1(weights_map,marked,sum_weight)
    feature_f2 = f2(weights_map,marks_map,marked,sum_weight)
    ques=[x for x in range(1,1801)]
    i=0
    d = {"question_id":ques,"f1":feature_f1,"f2":feature_f2}
    return pd.DataFrame(d)
def make_features(year,conn):
    query = "show tables like \"features_%d\""%year
    a = conn.execute(query)
    if(len(a.fetchall())==0):
        f1 = conn.execute(text("select question_id,count(answer_option) as correctly_answered from for_features where marks = 3 and marked =1 group by question_id"))
        f2 = conn.execute(text("select question_id,count(answer_option) as incorrectly_answered from for_features where marks = -1 and marked =1 group by question_id"))
        f3 = conn.execute(text("select question_id,count(answer_option) as not_answered from for_features where marked =0 group by question_id"))
        f4 = conn.execute(text("select question_id,avg(marks_scored) as avg_marks_correct from for_features where marks = 3 and marked =1 group by question_id"))
        f5 = conn.execute(text("select question_id,avg(marks_scored) as avg_marks_incorrect from for_features where marks = -1 and marked =1 group by question_id"))
        f6 = conn.execute(text("select question_id,avg(marks_scored) as avg_marks_na from for_features where marked =0 group by question_id"))
    
        feature1 = pd.DataFrame(f1,columns = f1.keys())
        feature2 = pd.DataFrame(f2,columns = f2.keys())
        feature3 = pd.DataFrame(f3,columns = f3.keys())
        feature4 = pd.DataFrame(f4,columns = f4.keys())
        feature5 = pd.DataFrame(f5,columns = f5.keys())
        feature6 = pd.DataFrame(f6,columns = f6.keys())
        weighted = weighted_features(conn)
    
        feature_list = [feature1,feature2,feature3,feature4,feature5,feature6]
        ques=[x for x in range(1,1801)]
        i=0
        features = pd.DataFrame(ques,columns = ["question_id"])
        while(i<=5):
            features = pd.merge(features,feature_list[i],on = "question_id")
            i = i+1
        features = pd.merge(features,weighted ,on = "question_id")
        features.to_sql("features_%d"%year,conn)
        return features
    else:
        table_name = "features_%d"%year
        table = conn.execute("select * from "+table_name)
        return pd.DataFrame(table,columns = table.keys())