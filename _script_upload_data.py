import csv
import json
from algoliasearch import algoliasearch


def upload_objects(search_index, batch):
    client = algoliasearch.Client("AZZ840SW44", "bd3c34a38733c721f6ed4f621a093fb5")
    index = client.init_index(search_index)
    index.add_objects(batch)


def update_objects(search_index, batch):
    client = algoliasearch.Client("AZZ840SW44", "bd3c34a38733c721f6ed4f621a093fb5")
    index = client.init_index(search_index)
    index.partial_update_objects(batch)


def prep_json_data(file_path):
    json1 = json.load(open(file_path, encoding="utf-8"))

    for item in json1:
        payment_options = []

        for option in item['payment_options']:
            # Replace CB and DC with Discover
            if option == "Carte Blanche" or option == "Diners Club":
                payment_options.append("Discover")
            else:
                payment_options.append(option)

        # Remove JCB, Open Table & Cash Only
        payment_options_set = set(payment_options) - set(['JCB', 'Pay with OpenTable', 'Cash Only'])
        # Remove Duplicates
        payment_options_deduped = list(payment_options_set)

        item['payment_options'] = payment_options_deduped
        # print(item['payment_options'])

    return json1


def prep_csv_data(file_path):
    csv_rows = []
    reader = csv.DictReader(open(file_path))
    field_names = reader.fieldnames[0].split(';')
    for row in reader:
        field_values = row[reader.fieldnames[0]].split(';')
        csv_rows.extend([{field_names[i]:field_values[i] for i in range(len(field_values))}])

    for item in csv_rows:
        item['objectID'] = int(item['objectID'])
        item['stars_count'] = float(item['stars_count'])
        item['reviews_count'] = int(item['reviews_count'])

    return csv_rows


# Upload records
json_batch = prep_json_data('_resources/dataset/restaurants_list.json')
upload_objects('restaurants', json_batch)

# Update records
# First, make sure there's no commas in the csv fields
f1 = open('_resources/dataset/restaurants_info.csv', 'r')
f2 = open('_resources/dataset/restaurants_updates.csv', 'w')
for line in f1:
    f2.write(line.replace(',', ' /'))
f1.close()
f2.close()

# Push updates
csv_batch = prep_csv_data('_resources/dataset/restaurants_updates.csv')
update_objects('restaurants', csv_batch)
