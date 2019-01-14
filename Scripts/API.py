# import libraries
import requests
import json
from collections import defaultdict

# define globals
DATA = defaultdict(int)
COUNTRIES = defaultdict(int)
GDP = defaultdict(str)


# define functions
def init_countries(object):
    """
    obtains info on countries and returns as dict
    """
    countries = defaultdict(int)

    # initialize data based on countries in dataset
    for i, h in enumerate(object['structure']['dimensions']['series'][2]
                          ['values']):

        # generate new dictionary behind each country
        countries[i] = [h['id'], h['name']]

        # check if country is already added to global countries
        if h['id'] not in COUNTRIES:
            COUNTRIES[h['id']] = h['name']

    # return the dictionary
    return countries


def init_sectors(object):
    """
    get codes for sectors
    """

    # initialize dictionary to hold sectors
    sectors = defaultdict(int)

    # codes for sectors are stored in json file
    codes = object['structure']['dimensions']['series'][3]['values']
    for i, code in enumerate(codes):

        # use code as key and id and name as values in list
        sectors[i] = [code['id'], code['name']]

    # return the dictionary
    return sectors


def country_dict(year, country_id):

        # if not, add entry for this country
        DATA[year][country_id] = defaultdict(str)

        # add dictionary for two datasets
        DATA[year][country_id]['share'] = defaultdict(str)
        DATA[year][country_id]['trade'] = defaultdict(str)

        # put extra dictionaries for sectors in trade dataset
        DATA[year][country_id]['trade']['xprt'] = defaultdict(str)
        DATA[year][country_id]['trade']['mprt'] = defaultdict(str)


def load_data(link, year, type):
    """
    this function loads DATA on trade partner percentages in total trade or
    DATA on total trade given a link to world banks API
    """

    # load data containing info on trade value in $
    response = requests.get(link)

    # read as JSON object
    j = json.loads(response.content)

    # obtain code on countries
    countries = init_countries(j)

    """
    add new dictionaries for both this year for all countries if the link type
    is shares, because this set is read through for each year and they both
    contain the same countries
    """
    if type == 'share':

        # add countries to dictionary for this year
        for country in countries:

            # use country id as key
            cid = countries[country][0]
            country_dict(year, cid)

    # sectors are only available for trade dataset
    if type == 'trade':

        # obtain code on countries
        sectors = init_sectors(j)

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

        # get sector and country string codes
        country = countries[country][0]

        # double check if country is present in both dataset
        if country not in DATA[year]:

            # if not add entries to dictionary
            country_dict(year, country)

            # add missing entries
            DATA[year][country]['share']['mprt'] = None
            DATA[year][country]['share']['xprt'] = None

        # sectors are only available for trade dataset
        if type == 'trade':
            sector = sectors[sector][0]

        """
        the observation value is in the first element of the dictionary in the
        value
        """
        obs = j['dataSets'][0]['series'][key]['observations']['0'][0]

        # covert obs to float
        if obs:
            obs = float(obs)

        # check where data should be placed
        if mprt:

            if type == 'share':
                DATA[year][country][type]['mprt'] = obs
            else:

                # put info per sector
                DATA[year][country][type]['mprt'][sector] = obs
        else:

            # put info for export
            if type == 'share':
                DATA[year][country]['share']['xprt'] = obs

            else:
                # put info per sector
                DATA[year][country][type]['xprt'][sector] = obs


def load_GDP():
    """
    GDP indicators manufacturing, agr, oil& coals (fuels), mining, services,
    trade
    """
    gdp_vars = ['NV.IND.MANF.ZS', 'NV.AGR.TOTL.ZS', 'NY.GDP.PETR.RT.ZS',
                'NY.GDP.COAL.RT.ZS', 'NY.GDP.MINR.RT.ZS', 'NV.SRV.TOTL.ZS',
                'NE.TRD.GNFS.ZS']

    # join indicators and include semicolon
    indics = ';'.join(gdp_vars)

    # load all data on GDP
    for country in COUNTRIES:

        GDP[country] = defaultdict(int)

        # add dictionaries to hold info per year
        for year in range(2000, 2018):
            GDP[country][year] = defaultdict(str)

            # add entries for all sectors
            for gdp_var in gdp_vars:
                GDP[country][year][gdp_var] = None

    # get link for country from api for data on all vars for 2000-2017
    link = f'http://api.worldbank.org/v2/country/all/indicator/{indics}?source=2&format=json&date=2000:2017'

    # get response and transform to JSON
    response = requests.get(link)
    j = json.loads(response.content)

    # the response consists of multiple pages
    pages = j[0]['pages']

    # go to all pages and extract data
    for i in range(1, pages + 1):
        link = f'http://api.worldbank.org/v2/country/ALL/indicator/{indics}?source=2&format=json&date=2000:2017&page={i}'

        # get response and transform to JSON
        response = requests.get(link)
        j = json.loads(response.content)

        # dataset is the second element of the json file
        dataset = j[1]

        # iterate over entries in dataset
        for data in range(len(dataset)):

            #  extract info
            ccode = dataset[data]['countryiso3code']

            # check if ccode in countries
            if ccode:

                # if so add to observations
                if ccode in COUNTRIES:

                    # get info from observations
                    year = int(dataset[data]['date'])
                    gdp_var = dataset[data]['indicator']['id']

                    #  get obs and convert to float
                    obs = dataset[data]['value']
                    if obs:
                        obs = float(obs)

                    # add info to dictionary
                    GDP[ccode][year][gdp_var] = obs


def json_save(dictionary, save_title):
    """
    saves dictionary as json file
    """
    j_data = json.dumps(dictionary)
    f = open(save_title, "w")
    f.write(j_data)


def main():
    """
    loads all data from API into python dictionary, which is converted to JSON
    """

    # iterate over years 2000-2017
    for year in range(2000, 2018):

        #  add position to hold information for year
        DATA[year] = defaultdict(str)

        """
        create links for API, world bank does not allow to download all years
        at once
        """

        # adjust API for given year
        link_shares = f'http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/gbr/year/{year}/partner/ /product/ /indicator/XPRT-PRTNR-SHR;MPRT-PRTNR-SHR?format=JSON'
        link_values = f'http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/gbr/year/{year}/partner/ALL/product/Total;AgrRaw;Chemical;Food;Fuels;manuf;OresMtls;Textiles;Transp/indicator/XPRT-TRD-VL;MPRT-TRD-VL?format=JSON'

        # load data for partner shares
        load_data(link_shares, year, 'share')

        # load data for trade values
        load_data(link_values, year, 'trade')

    # load data for GDP values
    load_GDP()

    # convert dataset and countries info to JSON objects and save these
    json_save(DATA, 'dataset.json')
    json_save(COUNTRIES, 'countries.json')
    json_save(GDP, 'gdp.json')


if __name__ == '__main__':
    """
    execute functions
    """
    main()
