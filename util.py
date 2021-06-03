import json

import re
import math

import pandas as pd

from tensorflow import keras

INFLUENCER_MIN_FOLLOWERS = 1000
INFERENCE_MIN_FOLLOWS = 10
MAX_NAME_LENGTH = 16
RACES = ['pctwhite', 'pctblack', 'pctapi', 'pcthispanic', 'other']
NAME_DENY_LIST = {'Journal', 'Institute', 'News', 'The', 'AI', 'Capital', 'App'}

with open('./race_prediction/data/census.jsonl', 'rb') as json_file:
    CENSUS = {}
    for line in json_file:
        line = json.loads(line)
        CENSUS[line['name']] = {
            'pctwhite': line['pctwhite'],
            'pctblack': line['pctblack'],
            'pctapi': line['pctapi'],
            'pcthispanic': line['pcthispanic'],
            'other': line['other']
        }


def get_name_and_info(data):
    """prase name from twitter raw data, filter out news publishers/official branded accounts"""
    parsed_data = [
        (get_english_only(i['name']),
         1 if i['followers_count'] > INFLUENCER_MIN_FOLLOWERS else 0) for i in data
        if 'news' not in i['description'].lower() and 'official' not in i['description'].lower()]

    # hardcoded blacklist to remove obvious business accounts
    parsed_data = [i for i in parsed_data if not any(w in i[0] for w in NAME_DENY_LIST)]

    # personal accounts tends to have 1 or 2 spaces only in the name
    parsed_data = [i for i in parsed_data if 0 < i[0].count(' ') < 3]

    return parsed_data


def get_english_only(text):
    return re.sub('[^A-Za-z ]+', '', text).strip()


def diversity_calculation(df, prefix=''):
    """round up small numbers and round down big numbers"""
    if len(df) == 0:
        d = {
            'pctwhite': 0,
            'pctblack': 0,
            'pctapi': 0,
            'pcthispanic': 0,
            'other': 0,
            'total_count': 0
        }
    else:
        pct = (df[RACES].mean() * 100).map(math.ceil)
        d = dict(pct)
        for k, v in d.items():
            if v == max(pct):
                d[k] = max(pct) - sum(pct) + 100
                break
        d['total_count'] = int(len(df))

    if prefix:
        d = {prefix + '_' + k: v for k, v in d.items()}
    return d


def pad_to_sequences(x, encoder):
    x = encoder.texts_to_sequences(x)
    return keras.preprocessing.sequence.pad_sequences(x, maxlen=MAX_NAME_LENGTH)


def get_diversity(data, model, encoder):
    """example output:
    {
    'pctwhite': 59,
    'pctblack': 9,
    'pctapi': 23,
    'pcthispanic': 6,
    'other': 3,
    'total_count': 105,
    'influencer_pctwhite': 59,
    'influencer_pctblack': 9,
    'influencer_pctapi': 23,
    'influencer_pcthispanic': 6,
    'influencer_other': 3,
    'influencer_total_count': 103
    }"""
    df = pd.DataFrame(get_name_and_info(data), columns=['name', 'is_influencer'])
    if len(df) > INFERENCE_MIN_FOLLOWS:
        df['last_name'] = df['name'].apply(lambda x: x.split()[-1].title())
        df = df[df['last_name'].map(len) > 1].reset_index(drop=True)

        # predicted results
        race_pred = pd.DataFrame(model.predict(pad_to_sequences(df['last_name'], encoder)).round(3), columns=RACES)
        # concat
        df = pd.concat([df, race_pred], 1)

        # update distribution through census data if possible
        for idx, row in df.iterrows():
            if row['last_name'] in CENSUS:
                df.loc[idx, RACES] = CENSUS[row['last_name']].values()

        # ignore the distributions that are less prominent
        df = df[df[RACES].max(1) > .4]

        return {**diversity_calculation(df), **diversity_calculation(df[df['is_influencer'] == 1], 'influencer')}
    else:
        empty_df = pd.DataFrame()
        return {**diversity_calculation(empty_df), **diversity_calculation(empty_df, 'influencer')}
