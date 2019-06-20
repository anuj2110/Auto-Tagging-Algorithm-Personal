import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler,MinMaxScaler
from accuracy_calc import *
import sqlalchemy

def get_weights(total_data):
    '''
    function for initialize random values in the weight vectors for the neural network to be used.
    uses the no of features to initialize a vector.
    '''
    y = np.random.random()*(2.0/np.sqrt(total_data))
    return 0.5 - (1/np.sqrt(total_data)) + y 
    
def compute_distance(w,x):
    '''
    function for computing the distance between the x(data) and w(Weight) vector
    takes in two arguments 
    w: weights
    x: features
    '''
    distance=0
    for i in range(len(w)):
        distance = distance + (w[i] - x[i])*(w[i] - x[i])
    distance = np.sqrt(distance)
    return distance
    
def find_closest_to_x(W,x):
    '''
    function to calculate the closest x vectors to the w vectors
    takes in two arguments
    w: weights
    x: features
    '''
    
    w = W[0]
    dist = compute_distance(w,x)
    i = 0
    i_n = i
    for w_ in W:
        if compute_distance(w_,x)<dist:
            dist = compute_distance(w_, x)
            w = w_
            i_n = i
        i = i + 1
    return (w,i_n)
def fit_predict(data):
    W=[]
    n_clusters = 3
    features = len(data[0])
    total_data = len(data)
    for i in range(n_clusters):
        W.append(list())
        for j in range(features):
            W[i].append(get_weights(total_data) * 0.5)
    la = 0.3   # λ coefficient
    dla = 0.05  # Δλ
    '''
    This code applies the training process defined above for every data point given in the dataset.
    We run a loop till la is equal to 0. In that we take 10 iterations and find closest datapoint ot the neuron and then
    updates the value of the wn as in the above equation.
    '''
    while la >= 0:
        for k in range(10):
            for x in data:
                wm = find_closest_to_x(W, x)[0]
                for i in range(len(wm)):
                    wm[i] = wm[i] + la * (x[i] - wm[i]) 
        la = la - dla
    prediction=[]
    for x in data:
        i_n = find_closest_to_x(W,x)[1]
        prediction.append(i_n)
    return prediction