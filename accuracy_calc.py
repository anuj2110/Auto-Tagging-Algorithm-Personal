import numpy as np
from sklearn.metrics import normalized_mutual_info_score, adjusted_rand_score

nmi = normalized_mutual_info_score
ari = adjusted_rand_score


def map_SOM(y_true, y_pred):
    """
    Calculate clustering accuracy. Require scikit-learn installed
    # Arguments
        y: true labels, numpy.array with shape `(n_samples,)`
        y_pred: predicted labels, numpy.array with shape `(n_samples,)`
    # Return
        accuracy, in [0,1]
    """
    y_true = y_true.astype(np.int64)
    assert y_pred.size == y_true.size
    D = max(y_pred.max(), y_true.max()) + 1
    w = np.zeros((D, D), dtype=np.int64)
    for i in range(y_pred.size):
        w[y_pred[i], y_true[i]] += 1
    from sklearn.utils.linear_assignment_ import linear_assignment
    ind = linear_assignment(w.max()- w)
    accuracy = sum([w[i, j] for i, j in ind]) * 1.0 / y_pred.size
    dict = {}
    for i in range(0,y_pred.max()+1):
        dict[ind[i][0]] = ind[i][1]
    for i in range(y_pred.size):
        y_pred[i] = dict[y_pred[i]]
    return (accuracy,y_pred)
def map_kmeans(saved_centroids,saved_clusters,K,n_points,Y):
    # Label Nomenclature
    hard_label = 2
    medium_label = 1
    easy_label = 0

    polls = np.zeros((K, 2), dtype=np.uint8)
    # For feature 1 - Fraction of people who solved the given question
    # correctly adjusted by weights.
    # Expectation: Negative value for hard questions
    #Positive value for easy questions
    #Values close to zero for medium level questions
    # Hence order expected: Hard < Medium < Easy
    indices = np.argsort(saved_centroids[:, 0])  # sorting in descending order
    polls[indices[0], 0] = hard_label
    polls[indices[1], 0] = medium_label
    polls[indices[2], 0] = easy_label

    # For feature 2 - Average marks of people who solved given question
    # incorrectly or did not solve it at all adjusted by weights
    # Expectation: Positive value for hard questions
    #Negative value for easy questions
    #Values close to zero for medium level questions
    # Hence order expected: Easy < Medium < Hard

    indices = np.argsort(saved_centroids[:, 1])  # sorting in descending order
    polls[indices[0], 1] = easy_label
    polls[indices[1], 1] = medium_label
    polls[indices[2], 1] = hard_label

    print(polls)

    # Map the labels
    map = np.zeros((K, 1), dtype=np.uint8)
    mode = polls[0, :]
    # print(mode[0])
    map[0, 0] = mode[0]  # Winning Label of Cluster 1
    mode = polls[1, :]
    map[1, 0] = mode[0]  # Winning Label of Cluster 2
    mode = polls[2, :]
    map[2, 0] = mode[0]  # Winning Label of Cluster 3
    print(map)
    # Now assign semantically correct difficulty tags
    # print(clusters)
    predicted_tags = np.zeros((n_points, 1), dtype=np.uint8)

    for i in range(n_points):
        predicted_tags[i, 0] = map[int(saved_clusters[i]), 0]

    count = 0
    for i in range(n_points):
        if(predicted_tags[i] == Y[i]):
            count = count + 1
    accuracy = count/n_points*100
    return(predicted_tags,accuracy) 