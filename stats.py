import pandas as pd
import numpy as np
def to_statistics(year,kmeans_labels,SOM_labels,accuracy_KMeans,accuracy_SOM,tags,conn):
    labels = pd.DataFrame(kmeans_labels,columns = ["KMeans_labels"]) #making the dataframe from the given list/numpy array
    labels["SOM_labels"] = SOM_labels
    labels["original"] = tags#adding another column
    #making the table names for storing in database
    table_name_stats = "stats_"+str(year)
    table_name_accuracy = "accuracy_"+str(year)
    query1 = conn.execute("show tables like \'"+table_name_stats+"\';")#checking if stats table exists
    result1 = query1.fetchall() #fetching the results
    if (len(result1)==0):
        '''
        if table is not made earlier we will add this directly to the database
        '''
        labels.to_sql(table_name_stats,conn)
    elif(result1[0][0] == table_name_stats):
        '''
        if table is exists we will drop the older one and adding the new one
        '''
        conn.execute("drop table "+table_name_stats+";")
        labels.to_sql(table_name_stats,conn)