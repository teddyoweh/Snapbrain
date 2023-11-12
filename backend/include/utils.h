#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>
#include <map>
#include <regex>
#include <string>
using namespace std;



string getmapvalue(const map<string, string>& myMap, const string& key);
map<string, string> jsonStringToMap(const string& jsonString);
string mapToString(const map<string, string>& inputMap);