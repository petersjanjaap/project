# import libraries
import requests
import json
from collections import defaultdict

# define globals
DATA = defaultdict(int)
COUNTRIES = defaultdict(str)


# define functions
def load_data(link, type):
    """
    this function loads DATA on trade partner percentages in total trade or
    DATA on total trade given a link to world banks API
    """
    # load data containing info on trade value in $
    response = requests.get(link)

    # read as JSON object
    j = json.loads(response.content)

    # data for nine sectors were loaded
    sectors = defaultdict(int)

    # codes for sectors are stored in json file
    codes = j['structure']['dimensions']['series'][3]['values']
    for i, code in enumerate(codes):

        # use code as key and id and name as values in list
        sectors[i] = [code['id'], code['name']]

    # iterate over country keys in dataset
    for key in j['dataSets'][0]['series']:

        """
        the key n:n:n:n:n contains at the middle position the country code, at
        the second last the sector code and in the last position the imprt
        indicator
        """
        codes = key.split(':')
        country = int(codes[2])
        sector = int(codes[3])
        mprt = int(codes[4])

        """
        the observation value is in the first element of the dictionary in the
        value
        """
        obs = j['dataSets'][0]['series'][key]['observations']['0'][0]

        # check where data should be placed
        if mprt:
            if type == 'share':
                DATA[country]['share']['mprt'] = obs
            else:
                DATA[country]['trade']['mprt'][sectors[sector][0]] = obs
        else:
            if type == 'share':
                DATA[country]['share']['xprt'] = obs
            else:
                DATA[country]['trade']['xprt'][sectors[sector][0]] = obs


def json_save(dictionary, save_title):
    """
    saves dictionary as json file
    """
    j_data = json.dumps(dictionary)
    print(j_data)
    f = open(save_title, "w")
    f.write(j_data)


def main():
    """
    loads all data from API into python dictionary, which is converted to JSON
    """

    # get page containing info on import and export shares in percentage
    link_shares = "http://wits.worldbank.org/API/V1/SDMX/V21/DATAsource/tradestats-trade/reporter/gbr/year/2017/partner/all/product/ /indicator/XPRT-PRTNR-SHR;MPRT-PRTNR-SHR?format=JSON"

    response = requests.get(link_shares)

    # read as JSON object
    j = json.loads(response.content)

    # initialize data based on countries in dataset
    for i, h in enumerate(j['structure']['dimensions']['series'][2]['values']):

        # generate new dictionary behind each country
        DATA[i] = defaultdict(str)

        # make room keys for percentage and dollar value trade information
        DATA[i]['share'] = defaultdict(str)
        DATA[i]['trade'] = defaultdict(str)
        DATA[i]['trade']['xprt'] = defaultdict(str)
        DATA[i]['trade']['mprt'] = defaultdict(str)

        # in country dictionary use numerical countryid as key
        cid = h['id']
        cname = h['name']

        # save country string country code and name in country dictionary
        COUNTRIES[i] = defaultdict(str)
        COUNTRIES[i]['name'] = cname
        COUNTRIES[i]['id'] = cid

    # load data for partner shares
    load_data(link_shares, 'share')

    # load data for trade values
    link_values = "http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/gbr/year/2017/partner/ALL/product/Total;AgrRaw;Chemical;Food;Fuels;manuf;OresMtls;Textiles;Transp/indicator/XPRT-TRD-VL;MPRT-TRD-VL?format=JSON"
    load_data(link_values, 'value')

    # convert dataset and countries info to JSON objects and save these
    json_save(DATA, 'dataset.json')
    json_save(COUNTRIES, 'countries.json')


if __name__ == '__main__':
    """
    execute functions
    """
    main()
