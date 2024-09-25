from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.webdriver import Firefox
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import *
import os
import json
import time
import re
from itertools import chain
import ci_scraper as ci
import multiprocessing
import requests

'''
AUGUST 2024 Course Catalog Scraper
Uses the RPI catalog website to search for individual courses, and then scrapes all of that data. Depends a lot on consistent catalog formatting,
so if that changes it will need work.
Check here for formatting:
https://catalog.rpi.edu/content.php?catoid=30&navoid=788

by Giancarlo Martinelli (gcm on discord)
'''

'''
Formatting Regex. Replaces unicode characters and removes unnessecary spaces caused by messy scraping (Sorry.)
'''
def un_spaceify(string: str) -> str:
    string = re.sub("\xa0", " ", string)
    string = re.sub(" +", " ", string)
    string = re.sub(r"\s(?=[,.;!/]|$)", "", string)
    string = re.sub(r"^ (?=\w)", "", string)
    string = re.sub("\u2019", "'", string)
    string = re.sub("\u2014", "-", string)
    string = re.sub("\u2013", "-", string)
    string = re.sub("\u2026", "...", string)
    string = re.sub("\u201c", '"', string)
    string = re.sub("\u201d", '"', string)
    string = re.sub("\u00E9", 'e', string)
    return string

def re_spaceify(string: str) -> str:
    string = re.sub(r".(?=\w)", ". ", string)

'''
Splits a list into a list of n lists. Useful for multiprocessing.
'''
def split(a: list[str], n: int):
    parts = []
    [parts.append([]) for _ in range(n)]
    for allocating in range(len(a)):
        parts[allocating % n].append(a[allocating])
    return parts

def navigate_to_course(driver: Firefox, term:str) -> list[str, str]:
    driver.get("https://catalog.rpi.edu")
    dropdown = driver.find_element(By.XPATH, '//*[@id="catalog_select_parent"]').click()
    drop = driver.find_element(By.XPATH, '//*[@id="select2-select_catalog-results"]')
    years = drop.find_elements(By.XPATH, '*')
    wait = WebDriverWait(driver, timeout=2, ignored_exceptions=(NoSuchElementException))
    for year in years:
        if year.text.split(" ")[2] == term:
            year.click()
            break
    wait.until(lambda d : driver.find_element(By.XPATH, '//*[@id="acalog-navigation"]').is_displayed())
    nav = driver.find_element(By.XPATH, '//*[@id="acalog-navigation"]')
    items = nav.find_elements(By.XPATH, '*')
    for item in items:
        if item.text == "Courses":
            ele = item.find_element(By.TAG_NAME, "a").get_property("href")
            return [ele.rsplit("=", 1)[1], ele.rsplit("=", 2)[1].rsplit("&", 1)[0]]

'''
Large scraping function. Goes to the search page of a single course, checks if the data exists, and then scrapes the course
'''
def scrape_single_course(prefix:str, code:str, nav: str, cat: str, cis) -> dict:
    try:

        link = "https://catalog.rpi.edu/content.php?filter%5B27%5D={}&filter%5B29%5D={}&filter%5Bkeyword%5D=&filter%5B32%5D=1&filter%5Bcpage%5D=1&cur_cat_oid={}&expand=&navoid={}&search_database=Filter&filter%5Bexact_match%5D=1#acalog_template_course_filter".format(prefix, code, cat, nav)
        r1 = requests.get(link)
        content1 = r1.content
        soup1 = bs(content1, "html.parser")
        check = soup1.find("td", {"class": "block_content"})
        '''
        Testing to see if the course exists. We need the webdriver waits so that selenium only does things when the necessary elements exist. 
        If they don't load in time we probably don't have a valid course.
        '''
        if check is None:
            return dict()
        if "No courses found" in check.get_text(strip=True) or "" == check.get_text(strip=True):
            return dict()
        nopop = check.find("a", {"aria-expanded": "false"}).get("href") # gets the link to the nopopup page
        '''
        Beautiful soup for the nopopup page
        '''
        r = requests.get("https://catalog.rpi.edu/" + nopop)
        content = r.content
        soup = bs(content, "html.parser")
        soup = soup.find("td", {"class": "block_content"}) # select the relevant information
        if soup is None:
            return dict()
        title = soup.find("h1")
        soup.find("a" , {"class": "portfolio_link acalog-highlight-ignore acalog-icon"}).extract() # remove the portfolio link so that it doesn't end up in the prereqs
        check = soup.find("tbody") # remove the header
        if check is None:
            soup.find("table", {"class" : "table_default"}).extract()
        else:
            check.extract()
        title.extract() # remove the title
        closes = soup.find_all("div") # For some reason there are an unknown number of Close buttons on any given course element. I get rid of those with extract()
        for close in closes: 
            close.extract()
        a_tags = soup.find_all("a") # These are all of the course links
        classes_mentioned = [] # we save the courses with links to a classes mentioned list so that we have all of the prerequisites later
        for a in a_tags:
            temp = a.get_text(strip=True)
            if temp != "":
                classes_mentioned.append(temp)
        s_string = str(soup) # we do string manipulation because the description isn't stored in any distinct tag. This is so annoying to deal with.
        parts = s_string.split("<strong>") # all strong parts are all parts with labels (Think Prerequisites:, When Offered, etc.)
        description_html = parts[0]
        if prefix == "INQR": # remove this piece of code when they eventually remove the part that says that a course used to be IHSS (This exists on all INQR courses)
            description_html = parts[1]
            description_html = description_html.split("<br/>", 3)[-1]
        desc_soup = bs(description_html, "html.parser") # put back into beautiful soup to remove left over tags
        description = un_spaceify(desc_soup.get_text())
        rest = s_string.removeprefix(description_html) # get rid of all of the description stuff to scrape remaining important labels
        r_soup = bs(rest, "html.parser")
        rest_text = r_soup.get_text() # get all of the text from the rest
        delimiters = ["Prerequisites/Corequisites:","Cross Listed:", "When Offered:", "Credit Hours:", "Co-Listed:", "Contact, Lecture or Lab Hours:", "Graded:"] # these are all of the important labels that we need
        '''
        This code splits the course text by all of the delimiters in the delimiters list, but keeps those delimiters at the beginning of each respective part
        '''
        built_list = [rest_text]
        for de in delimiters: # focus on a delimiter
            t = []
            for l in built_list: # go through each element of our text list
                splitted = l.split(de, 1) # does the splitting
                if de in l: # check if our delimiter actually exists in the thing we just split
                    splitted[1] = de + splitted[1] # adds the delimiter back
                t.append(splitted) # stores our splitted (or not splitted) parts for later
                    
            built_list = list(chain.from_iterable(t)) # black magic which collapses our multidimensional list into a single dimension list
        if len(built_list) != 0: # I honestly forgot why I added this. There's probably something useless in the first position of our built list.
            built_list.pop(0)
        
        for i in range(len(built_list)):
            built_list[i] = un_spaceify(built_list[i]) # some final formatting.
        '''
        Dictionary formatting for the json
        '''
        result = dict()
        title = title.get_text(strip=True)
        result = dict()
        result["prerequisites"], result["rawprecoreq"] = prerequisite_constructor(built_list, classes_mentioned)
        result["cross listed"] = crosslisted_constructor(built_list, classes_mentioned)
        result["description"] = description.split("Credit Hours")[0].replace("\n", " ").strip()
        result["name"] = un_spaceify(title.split("-", 1)[1])
        result["offered"] = when_offered_constructor(built_list)
        result["properties"] = properties_constructor(prefix, code, cis)
        result["professors"] = []
        result["subj"] = prefix
        result["ID"] = code
    except Exception as e:
        print(link)
        raise Exception(e)
    return result

'''
Formats the relevent properties tag from the course object
'''
def properties_constructor(prefix: str, code: str, cis: list[str]):
    result = dict()
    result["HI"] = (prefix == "INQR")
    result["CI"] = (prefix + "-" + code in cis)
    result["major_restricted"] = False # no good way to check this right now, should never be true because it's a pathway
    return result

'''
Checks if a Prerequisite tag exists, and then checks it for courses
'''
def prerequisite_constructor(course_data: list[str], courses_mentioned: list[str]):
    prereq_list = []
    looking = ""
    for i in course_data:
        if "Prerequisites/Corequisites:" in i:
            looking = i
            looking = looking.removeprefix("Prerequisites/Corequisites:")
    pre_looking = ""
    if "Corequisites" in looking:
        pre_looking = looking.split("Corequisites")[0]
    else:
        pre_looking = looking
    for course in courses_mentioned:
        if course in pre_looking:
            prereq_list.append(course)
    if "Prerequisite" not in looking and prereq_list != []:
        looking = "Prerequisites/Corequisites: " + looking.strip()
    return [prereq_list, looking.strip().replace("\n", "")]

'''
Similar to prerequisite function, but for cross-listed courses
'''
def crosslisted_constructor(course_data: list[str], courses_mentioned: list[str]):
    crosslist_list = set()
    looking_cross = ""
    looking_co = ""
    for i in course_data:
        if "Cross Listed:" in i:
            looking_cross = i
        if "Co-Listed:" in i:
            looking_co = i
    for course in courses_mentioned:
        if course in looking_cross:
            crosslist_list.add(course)
        if course in looking_co:
            crosslist_list.add(course)
    return list(crosslist_list)

'''
Looks for the special text that means that a course is offered at a time.
'''
def when_offered_constructor(course_data: list[str]):
    result = dict()
    result["even"] = False
    result["odd"] = False
    result["fall"] = False
    result["spring"] = False
    result["summer"] = False
    result["uia"] = False
    result["text"] = ""
    for i in course_data:
        if "when offered:" in i.lower():
            result["text"] = i
    if "even years" in result["text"].lower() or "even-numbered" in result["text"].lower():
        result["even"] = True
    if "odd years" in result["text"].lower() or "odd-numbered" in result["text"].lower():
        result["odd"] = True
    if "fall" in result["text"].lower():
        result["fall"] = True
    if "spring" in result["text"].lower():
        result["spring"] = True
    if "summer" in result["text"].lower():
        result["summer"] = True
    if "availability of instructor" in result["text"].lower() or "upon availability" in result["text"].lower(): 
        result["uia"] = True
    return result

'''
Checks our pathway json to gather all courses that we need to scrape. See pathway scraper for details on the tag naming.
'''
def check_to_scrape(year: int) -> list[str]:
    dir_path = os.path.dirname(os.path.realpath(__file__))
    parent_path = os.path.dirname(dir_path)
    jsons_path = os.path.join(parent_path, "json")
    folder_title = "{}-{}".format(year - 1, year)
    json_checking_path = os.path.join(jsons_path, folder_title, "pathways.json")
    to_check = list()
    with open(json_checking_path, 'r') as f:
        j = dict(json.load(f))
    for pathway in j.keys():
        if "Remaining" in j[pathway].keys():
            [to_check.append(i) for i in j[pathway]["Remaining"].values()]
        if "Required" in j[pathway].keys():
            [to_check.append(i) for i in j[pathway]["Required"].values()]
        if "One Of0" in j[pathway].keys():
            [to_check.append(i) for i in j[pathway]["One Of0"].values()]
        if "One Of1" in j[pathway].keys():
            [to_check.append(i) for i in j[pathway]["One Of1"].values()]
        if "One Of2" in j[pathway].keys():
            [to_check.append(i) for i in j[pathway]["One Of2"].values()]
    to_check = list(set(to_check))
    return to_check

'''
Single process scrape. Largely unnecessary because we can just use num_browsers = 1 in the multiprocess function but it's nice to have.
'''
def scrape_courses(year: int, pdf_name: str, json_path: str, term: str):
    driver = webdriver.Firefox()
    driver.implicitly_wait(2)
    to_check = check_to_scrape(year)
    dir_path = os.path.dirname(os.path.realpath(__file__))
    pdf_path = os.path.join(dir_path, 'pdfs', pdf_name)
    cis = ci.parse_pdf(pdf_path)
    nav, cat = navigate_to_course(driver, term)
    driver.quit()
    all_courses = dict()
    for course in to_check:
        prefix, code = course.split(" ")
        if 'X' in code:
            [to_check.append(prefix + " " + code.replace("X", str(i))) for i in range(0, 10)]
            to_check.remove(course)
    for course in to_check:
        prefix, code = course.split(" ")
        course_data = scrape_single_course(driver, prefix, code, nav, cat, cis)
        if len(course_data.keys()) == 0:
            continue
        all_courses[course_data["name"]] = course_data

    out = json.dumps(all_courses, indent= 4)
    print(out)
    with open(json_path, 'w') as f:
        f.write(out)
    driver.quit()

'''
Uses multiprocessing to open multiple browsers to scrape all necessary courses.
'''
def multi_process_scrape(year: int, pdf_name: str, json_path: str, num_browsers: int, term: str):
    to_check = check_to_scrape(year)
    dir_path = os.path.dirname(os.path.realpath(__file__))
    driver = webdriver.Firefox()
    driver.implicitly_wait(2)
    nav, cat = navigate_to_course(driver, term)
    driver.quit()
    pdf_path = os.path.join(dir_path, 'pdfs', pdf_name)
    cis = ci.parse_pdf(pdf_path) # uses the pdf scraper to find all communication intensive courses
    all_courses = dict()
    for course in to_check:
        prefix, code = course.split(" ")
        if 'X' in code: # replaces all topics courses with all possible code combinations. Probably unnessecary.
            [to_check.append(prefix + " " + code.replace("X", str(i))) for i in range(0, 10)]
            to_check.remove(course)

    with multiprocessing.Pool(num_browsers) as pool:
        parts = list(split(to_check, num_browsers))
        results = pool.starmap(scrape_process, [(part, nav, cat, cis) for part in parts])
    
    for res in results:
        all_courses.update(res) # this should combine all of our multiprocess results together

    out = json.dumps(all_courses, indent= 4)
    with open(json_path, 'w') as f: # dump to json file
        f.write(out)

'''
Function which the multiprocess uses
'''
def scrape_process(to_scrape: list[str], nav:str, cat:str, cis:set[str]) -> dict:
    result = dict()
    for course in to_scrape: # scrapes every course
        subject, code = course.split(" ")[0], course.split(" ")[1]
        course_data = scrape_single_course(subject, code, nav, cat, cis)
        if len(course_data.keys()) == 0: # removes blank courses
            continue
        result[course_data["name"]] = course_data # builds dictionary
    return result

'''
For testing.
'''
if __name__ == "__main__":
    dir_path = os.path.dirname(os.path.realpath(__file__))
    pdf_path = os.path.join(dir_path, 'pdfs', 'fall2024-ci.pdf')
    #cis = ci.parse_pdf(pdf_path)
    multi_process_scrape(2025, pdf_path, "courses.json", 6)
    #print(scrape_single_course(webdriver.Firefox(), "INQR", "1140", cis))